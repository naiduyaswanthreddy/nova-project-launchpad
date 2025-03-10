
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Form,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  ArrowLeft, 
  Rocket,
  Save,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  getConnectedUsername, 
  postProject,
  isKeychainInstalled
} from "@/utils/hive";
import { useProjectDraft } from "@/hooks/use-project-draft";
import { projectSchema, FORM_STEPS, type ProjectFormValues } from "./project-form-schema";
import { ProjectFormSteps } from "./ProjectFormSteps";
import { BasicInfoStep } from "./form-steps/BasicInfoStep";
import { DescriptionStep } from "./form-steps/DescriptionStep";
import { FundingStep } from "./form-steps/FundingStep";
import { MediaStep } from "./form-steps/MediaStep";
import { SocialLinksStep } from "./form-steps/SocialLinksStep";
import { ReviewStep } from "./form-steps/ReviewStep";
import { AuthRequiredDialog } from "./AuthRequiredDialogs";

export function CreateProjectForm({ isOpen, onClose, editDraftId }: { isOpen: boolean; onClose: () => void; editDraftId?: string }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempCoverImage, setTempCoverImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isKeychainAvailable, setIsKeychainAvailable] = useState(false);
  const username = getConnectedUsername();
  const draftId = editDraftId || 'new';
  const { draft, isLoading: isDraftLoading, updateDraft, autoSaveStatus } = useProjectDraft(draftId, username || '');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is connected with Hive Keychain
  useEffect(() => {
    const checkAuth = () => {
      const name = getConnectedUsername();
      setIsAuthenticated(!!name);
      setIsKeychainAvailable(isKeychainInstalled());
    };
    
    checkAuth();
    
    // Check authentication status when the form opens
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  // Create form with draft values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      category: "",
      fundingGoal: "",
      description: "",
      coverImage: "",
      socialLinks: {
        website: "",
        twitter: "",
        discord: "",
        github: ""
      },
      termsAccepted: false
    }
  });

  // Load draft data into form
  useEffect(() => {
    if (draft && !isDraftLoading) {
      form.reset({
        title: draft.title,
        category: draft.category,
        fundingGoal: draft.fundingGoal,
        description: draft.description,
        coverImage: draft.coverImage,
        socialLinks: draft.socialLinks,
        termsAccepted: draft.termsAccepted
      });
      
      if (draft.coverImage) {
        setTempCoverImage(draft.coverImage);
      }
    }
  }, [draft, isDraftLoading, form]);

  // Auto-save form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (draft && !isDraftLoading) {
        const formValues = form.getValues();
        updateDraft({
          title: formValues.title,
          category: formValues.category,
          fundingGoal: formValues.fundingGoal,
          description: formValues.description,
          coverImage: formValues.coverImage,
          socialLinks: formValues.socialLinks,
          termsAccepted: formValues.termsAccepted
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateDraft, draft, isDraftLoading]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setStep(0);
    }
  }, [isOpen]);

  const onSubmit = async (data: ProjectFormValues) => {
    // Check if user is connected with Hive Keychain
    if (!username) {
      toast({
        title: "Authentication Error",
        description: "Please connect your Hive wallet before creating a project",
        variant: "destructive"
      });
      return;
    }
    
    if (!isKeychainAvailable) {
      toast({
        title: "Hive Keychain Required",
        description: "Please install the Hive Keychain browser extension to submit projects",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format project body with markdown
      const projectBody = `
# ${data.title}

## About This Project
${data.description}

## Funding Goal
${data.fundingGoal} HIVE

## Creator
@${username}

---
*Posted via CrowdHive - Decentralized crowdfunding on the Hive blockchain*
      `;
      
      // Post the project to Hive blockchain
      const result = await postProject(
        username,
        data.title,
        projectBody,
        data.category,
        parseFloat(data.fundingGoal),
        data.coverImage || null,
        data.socialLinks
      );
      
      if (result.success) {
        toast({
          title: "Project submitted!",
          description: "Your project has been successfully posted to the Hive blockchain.",
        });
        
        // Remove draft if successful
        if (draft) {
          const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
          const updatedDrafts = drafts.filter((d: any) => d.id !== draft.id);
          localStorage.setItem('projectDrafts', JSON.stringify(updatedDrafts));
        }
        
        // Close modal and redirect to projects page
        onClose();
        navigate('/projects');
      } else {
        throw new Error(result.message);
      }
      
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Validate current step fields before proceeding
    switch (step) {
      case 0:
        form.trigger(["title", "category"]).then((isValid) => {
          if (isValid) setStep(step + 1);
        });
        break;
      case 1:
        form.trigger(["description"]).then((isValid) => {
          if (isValid) setStep(step + 1);
        });
        break;
      case 2:
        form.trigger(["fundingGoal"]).then((isValid) => {
          if (isValid) setStep(step + 1);
        });
        break;
      default:
        setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(Math.max(0, step - 1));
  };

  if (!isAuthenticated) {
    return (
      <AuthRequiredDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Connect to Start a Project"
        description="Please connect your Hive wallet to create a project on CrowdHive. Use the wallet connect button in the navigation bar."
        actionLabel="Got it"
      />
    );
  }

  if (!isKeychainAvailable) {
    return (
      <AuthRequiredDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Hive Keychain Required"
        description="Hive Keychain extension is required to post content to the Hive blockchain. Please install it and reload the page."
        actionLabel="Get Hive Keychain"
        actionUrl="https://hive-keychain.com"
      />
    );
  }

  if (isDraftLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-300">Loading project data...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text flex items-center">
            <Rocket className="mr-2 h-5 w-5" />
            {editDraftId ? "Edit Project" : "Start a Project"}
          </DialogTitle>
          <DialogDescription className="text-gray-300 flex items-center justify-between">
            <span>Share your idea with the community and get the funding you need.</span>
            <div className="flex items-center ml-4">
              {autoSaveStatus === "saving" && (
                <span className="text-xs flex items-center text-amber-400">
                  <Clock className="animate-pulse h-3 w-3 mr-1" />
                  Saving...
                </span>
              )}
              {autoSaveStatus === "saved" && (
                <span className="text-xs flex items-center text-green-400">
                  <Check className="h-3 w-3 mr-1" />
                  Saved
                </span>
              )}
              {autoSaveStatus === "error" && (
                <span className="text-xs flex items-center text-red-400">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Error saving
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Getting Started</span>
            <span>Ready to Submit</span>
          </div>
          <Progress value={(step / (FORM_STEPS.length - 1)) * 100} className="h-2" />
        </div>
        
        {/* Steps indicator */}
        <ProjectFormSteps steps={FORM_STEPS} currentStep={step} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 0 && <BasicInfoStep form={form} />}
            
            {/* Step 2: Description */}
            {step === 1 && <DescriptionStep form={form} />}
            
            {/* Step 3: Funding */}
            {step === 2 && <FundingStep form={form} />}
            
            {/* Step 4: Media */}
            {step === 3 && (
              <MediaStep 
                form={form} 
                tempCoverImage={tempCoverImage} 
                setTempCoverImage={setTempCoverImage} 
              />
            )}
            
            {/* Step 5: Social Links */}
            {step === 4 && <SocialLinksStep form={form} />}
            
            {/* Step 6: Review */}
            {step === 5 && (
              <ReviewStep 
                form={form} 
                tempCoverImage={tempCoverImage} 
              />
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-800">
              <div>
                {step > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="bg-secondary/20"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                {step < FORM_STEPS.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !form.watch("termsAccepted")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Project"}
                    <Rocket className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
