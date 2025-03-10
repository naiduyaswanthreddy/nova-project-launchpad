
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getConnectedUsername, postProject } from "@/utils/hive/projects";
import { ProjectFormSteps } from "@/components/project/ProjectFormSteps";
import { BasicInfoStep } from "@/components/project/form-steps/BasicInfoStep";
import { DescriptionStep } from "@/components/project/form-steps/DescriptionStep";
import { FundingStep } from "@/components/project/form-steps/FundingStep";
import { MediaStep } from "@/components/project/form-steps/MediaStep";
import { SocialLinksStep } from "@/components/project/form-steps/SocialLinksStep";
import { ReviewStep } from "@/components/project/form-steps/ReviewStep";
import { AuthRequiredDialog } from "@/components/project/AuthRequiredDialog";
import { ArrowLeft, ArrowRight, Loader2, Bookmark, Save, CheckCircle2 } from "lucide-react";
import { FORM_STEPS, projectSchema, ProjectFormValues } from "./project-form-schema";

export const CreateProjectForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [projectPermlink, setProjectPermlink] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
  
  const { formState } = form;
  
  useEffect(() => {
    // Check if user is authenticated
    const username = getConnectedUsername();
    if (!username) {
      setShowAuthDialog(true);
    }
  }, []);

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);
    
    const result = await form.trigger(fieldsToValidate as any);
    if (!result) return;
    
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const getFieldsToValidate = (step: number): (keyof ProjectFormValues)[] => {
    switch (step) {
      case 0:
        return ["title", "category"];
      case 1:
        return ["description"];
      case 2:
        return ["fundingGoal"];
      case 3:
        return ["coverImage"];
      case 4:
        return ["socialLinks"];
      case 5:
        return ["termsAccepted"];
      default:
        return [];
    }
  };

  const submitProject = async (values: ProjectFormValues) => {
    const username = getConnectedUsername();
    
    if (!username) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the description with markdown
      const description = formatDescription(values);
      
      // Convert fundingGoal to number for the API
      const fundingGoal = parseFloat(values.fundingGoal);
      
      const result = await postProject(
        username,
        values.title,
        description,
        values.category,
        fundingGoal,
        values.coverImage || null,
        values.socialLinks
      );
      
      if (result.success) {
        setIsSuccess(true);
        setProjectPermlink(result.permlink || null);
        toast({
          title: "Project created successfully",
          description: "Your project has been published to the Hive blockchain",
        });
      } else {
        toast({
          title: "Failed to create project",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating your project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDescription = (values: ProjectFormValues): string => {
    // Create a formatted description with markdown
    return `# ${values.title}

## About this project
${values.description}

## Funding Goal
${values.fundingGoal} HIVE

## Category
${values.category}
`;
  };

  const handleSaveAsDraft = () => {
    // Get current form values
    const values = form.getValues();

    // Get existing drafts from localStorage
    const existingDrafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
    
    // Create a new draft with current form values and a timestamp
    const newDraft = {
      id: Date.now().toString(),
      title: values.title || 'Untitled Project',
      description: values.description || 'No description',
      creator: getConnectedUsername() || 'anonymous',
      lastUpdated: new Date().toISOString(),
      formData: values
    };
    
    // Add new draft to existing drafts
    const updatedDrafts = [...existingDrafts, newDraft];
    
    // Save updated drafts to localStorage
    localStorage.setItem('projectDrafts', JSON.stringify(updatedDrafts));
    
    toast({
      title: "Draft saved",
      description: "Your project has been saved as a draft",
    });
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep form={form} />;
      case 1:
        return <DescriptionStep form={form} />;
      case 2:
        return <FundingStep form={form} />;
      case 3:
        return <MediaStep form={form} />;
      case 4:
        return <SocialLinksStep form={form} />;
      case 5:
        return <ReviewStep form={form} />;
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Project Created Successfully!</h2>
          <p className="text-muted-foreground">
            Your project has been published to the Hive blockchain and is now live.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <Button
            onClick={() => navigate(`/project/${getConnectedUsername()}/${projectPermlink}`)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            View Your Project
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/my-projects")}
          >
            Go to My Projects
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitProject)} className="space-y-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a New Project</h1>
            <p className="text-muted-foreground">
              Fill out the form below to create your crowdfunding project.
            </p>
          </div>
          
          <ProjectFormSteps steps={FORM_STEPS} currentStep={currentStep} />
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{FORM_STEPS[currentStep].title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{FORM_STEPS[currentStep].description}</p>
            
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <div>
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {!isSuccess && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Save as Draft</span>
                    <span className="inline sm:hidden">Save</span>
                  </Button>
                )}
                
                {currentStep < FORM_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formState.isValid}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        Publish Project
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      
      <AuthRequiredDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </Form>
  );
};
