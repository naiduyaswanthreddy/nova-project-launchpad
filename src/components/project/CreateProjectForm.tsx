
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Camera, 
  Upload, 
  FileImage, 
  Check, 
  AlertCircle, 
  Info, 
  Rocket, 
  ArrowRight, 
  ArrowLeft, 
  Save 
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  getConnectedUsername, 
  postProject,
  isKeychainInstalled
} from "@/utils/hive";

// Project creation form schema
const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  fundingGoal: z.string().min(1, "Please enter a funding goal"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  coverImage: z.string().optional(),
  socialLinks: z.object({
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    discord: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    github: z.string().url("Please enter a valid URL").optional().or(z.literal(""))
  }).optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const CATEGORIES = [
  "Art",
  "Comics",
  "Community",
  "Crafts",
  "Dance",
  "Design",
  "Education",
  "Environment",
  "Fashion",
  "Film & Video",
  "Food",
  "Games",
  "Health",
  "Journalism",
  "Music",
  "Photography",
  "Publishing",
  "Technology",
  "Theater"
];

export function CreateProjectForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [tempCoverImage, setTempCoverImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isKeychainAvailable, setIsKeychainAvailable] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is connected with Hive Keychain
  useEffect(() => {
    const checkAuth = () => {
      const username = getConnectedUsername();
      setIsAuthenticated(!!username);
      setIsKeychainAvailable(isKeychainInstalled());
    };
    
    checkAuth();
    
    // Check authentication status when the form opens
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  // Create form with default values
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setStep(0);
      setTempCoverImage(null);
    }
  }, [isOpen, form]);

  const steps = [
    { title: "Basic Info", description: "Project title and category" },
    { title: "Description", description: "Detailed information about your project" },
    { title: "Funding", description: "Set your funding goal and milestones" },
    { title: "Media", description: "Upload images and videos" },
    { title: "Links", description: "Add your social media links" },
    { title: "Review", description: "Review and publish your project" }
  ];

  const onSubmit = async (data: ProjectFormValues) => {
    // Check if user is connected with Hive Keychain
    const username = getConnectedUsername();
    
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

  const saveAsDraft = async () => {
    const username = getConnectedUsername();
    
    if (!username) {
      toast({
        title: "Authentication Error",
        description: "Please connect your Hive wallet before saving a draft",
        variant: "destructive"
      });
      return;
    }
    
    setSavingDraft(true);
    
    try {
      // Get the current form values, even if they're not complete
      const currentValues = form.getValues();
      
      // Only require title for draft
      if (!currentValues.title || currentValues.title.length < 3) {
        toast({
          title: "Draft Not Saved",
          description: "Please enter at least a title (3+ characters) for your draft",
          variant: "destructive"
        });
        setSavingDraft(false);
        return;
      }
      
      // Store the draft locally since we can't save incomplete projects to blockchain yet
      const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      
      const draft = {
        id: Date.now().toString(),
        title: currentValues.title,
        category: currentValues.category || "Uncategorized",
        fundingGoal: currentValues.fundingGoal || "0",
        description: currentValues.description || "Draft project",
        coverImage: currentValues.coverImage || null,
        socialLinks: currentValues.socialLinks || null,
        creator: username,
        status: 'draft',
        created_at: new Date().toISOString()
      };
      
      drafts.push(draft);
      localStorage.setItem('projectDrafts', JSON.stringify(drafts));
      
      toast({
        title: "Draft saved!",
        description: "Your project draft has been saved locally. Access it from 'My Projects'.",
      });
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSavingDraft(false);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // In a real implementation, you would upload to IPFS or another decentralized storage
      // For now, we'll use a data URL
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setTempCoverImage(imageUrl);
        form.setValue("coverImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Connect to Start a Project</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please connect your Hive wallet to create a project on CrowdHive.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <AlertCircle className="h-16 w-16 text-yellow-500" />
            <p className="text-center text-gray-300">
              You need to connect your Hive wallet before you can create a project.
              Use the wallet connect button in the navigation bar.
            </p>
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isKeychainAvailable) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Hive Keychain Required</DialogTitle>
            <DialogDescription className="text-gray-300">
              Please install the Hive Keychain browser extension to create projects.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <AlertCircle className="h-16 w-16 text-yellow-500" />
            <p className="text-center text-gray-300">
              Hive Keychain extension is required to post content to the Hive blockchain.
              Please install it and reload the page.
            </p>
            <Button 
              onClick={() => window.open("https://hive-keychain.com", "_blank")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Get Hive Keychain
            </Button>
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
            Start a Project
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Share your idea with the community and get the funding you need.
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Getting Started</span>
            <span>Ready to Submit</span>
          </div>
          <Progress value={(step / (steps.length - 1)) * 100} className="h-2" />
        </div>
        
        {/* Steps indicator */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div 
                className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1 transition-colors
                  ${i < step ? 'bg-green-500/20 text-green-400 border border-green-500' :
                    i === step ? 'bg-purple-500/30 text-white border border-purple-500' :
                    'bg-gray-800/50 text-gray-400 border border-gray-700'}`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <p className={`text-xs truncate ${i === step ? 'text-purple-400 font-medium' : 'text-gray-400'}`}>
                {s.title}
              </p>
            </div>
          ))}
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Basics</h3>
                <p className="text-gray-400 text-sm">Let's start with the fundamentals of your project.</p>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a clear, specific title" 
                          {...field} 
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormDescription>
                        Make it catchy, clear, and memorable (5-100 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the category that best fits your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Step 2: Description */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Description</h3>
                <p className="text-gray-400 text-sm">Describe your project in detail to attract supporters.</p>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project in detail. What is it? Why does it matter? How will you execute it?" 
                          {...field} 
                          className="min-h-[200px] bg-background/50 resize-y"
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific and comprehensive (minimum 50 characters). Include your goals, timeline, and what the funds will be used for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Step 3: Funding */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Funding Goals</h3>
                <p className="text-gray-400 text-sm">Set your funding target and milestones.</p>
                
                <FormField
                  control={form.control}
                  name="fundingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal (HIVE)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            min="10"
                            step="0.1"
                            placeholder="e.g., 1000" 
                            {...field} 
                            className="bg-background/50 pl-16"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-400 border-r border-gray-700">
                            HIVE
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Be realistic about what you need to complete your project. Minimum 10 HIVE.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Project milestones info */}
                <div className="bg-secondary/40 p-4 rounded-lg border border-purple-900/30">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">Project Milestones</h4>
                      <p className="text-xs text-gray-300">
                        Your project will automatically have these funding milestones:
                      </p>
                      <ul className="text-xs text-gray-300 mt-2 space-y-1 ml-4 list-disc">
                        <li>25% - First milestone reached</li>
                        <li>50% - Halfway to goal</li>
                        <li>75% - Three-quarters funded</li>
                        <li>100% - Fully funded</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Media */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Media</h3>
                <p className="text-gray-400 text-sm">Upload images to showcase your project.</p>
                
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {tempCoverImage ? (
                            <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                              <img 
                                src={tempCoverImage} 
                                alt="Cover preview" 
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full"
                                onClick={() => {
                                  setTempCoverImage(null);
                                  form.setValue("coverImage", "");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-background/30 hover:bg-background/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Camera className="w-8 h-8 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                  </p>
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload a high-quality image that represents your project.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Additional media uploads would go here in a full implementation */}
              </div>
            )}
            
            {/* Step 5: Social Links */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Links</h3>
                <p className="text-gray-400 text-sm">Add links to your website and social media profiles.</p>
                
                <FormField
                  control={form.control}
                  name="socialLinks.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://yourwebsite.com" 
                          {...field} 
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormDescription>
                        Your project's website or personal site (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socialLinks.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://twitter.com/yourusername" 
                          {...field} 
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormDescription>
                        Your Twitter profile (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socialLinks.discord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://discord.gg/invite" 
                          {...field} 
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormDescription>
                        Your Discord server invite link (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socialLinks.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/yourusername" 
                          {...field} 
                          className="bg-background/50"
                        />
                      </FormControl>
                      <FormDescription>
                        Your GitHub profile or project repository (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Step 6: Review */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Review Your Project</h3>
                <p className="text-gray-400 text-sm">Please review all details before submitting your project.</p>
                
                <div className="space-y-4">
                  <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Title</p>
                        <p className="font-medium">{form.watch("title")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="font-medium">{form.watch("category")}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm whitespace-pre-line">{form.watch("description")}</p>
                  </div>
                  
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Funding Goal</h4>
                    <p className="font-medium text-purple-400">{form.watch("fundingGoal")} HIVE</p>
                  </div>
                  
                  {tempCoverImage && (
                    <div className="bg-secondary/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Cover Image</h4>
                      <img 
                        src={tempCoverImage} 
                        alt="Cover preview" 
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Social Links</h4>
                    <div className="space-y-2">
                      {form.watch("socialLinks.website") && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Website:</span>
                          <span className="text-sm">{form.watch("socialLinks.website")}</span>
                        </div>
                      )}
                      {form.watch("socialLinks.twitter") && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Twitter:</span>
                          <span className="text-sm">{form.watch("socialLinks.twitter")}</span>
                        </div>
                      )}
                      {form.watch("socialLinks.discord") && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Discord:</span>
                          <span className="text-sm">{form.watch("socialLinks.discord")}</span>
                        </div>
                      )}
                      {form.watch("socialLinks.github") && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">GitHub:</span>
                          <span className="text-sm">{form.watch("socialLinks.github")}</span>
                        </div>
                      )}
                      {!form.watch("socialLinks.website") && 
                       !form.watch("socialLinks.twitter") && 
                       !form.watch("socialLinks.discord") && 
                       !form.watch("socialLinks.github") && (
                        <p className="text-sm text-gray-400">No social links provided</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          I agree to the CrowdHive Terms of Service and Creator Guidelines
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
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
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={saveAsDraft}
                  disabled={savingDraft}
                  className="bg-secondary/20"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {savingDraft ? "Saving..." : "Save Draft"}
                </Button>
                
                {step < steps.length - 1 ? (
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
