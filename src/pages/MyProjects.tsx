
import { useState, useEffect } from "react";
import { FooterSection } from "@/components/landing/FooterSection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "@/components/project/ProjectModal";
import { getConnectedUsername, fetchLatestProjects, formatPostToProject } from "@/utils/hive";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JoinMovementSection } from "@/components/landing/JoinMovementSection";
import { ProjectsTabs } from "@/components/my-projects/ProjectsTabs";

const MyProjects = () => {
  const [activeTab, setActiveTab] = useState("created");
  const [projects, setProjects] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const username = getConnectedUsername();
    
    if (!username) {
      toast({
        title: "Not connected",
        description: "Please connect your Hive wallet to view your projects",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    const fetchUserProjects = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects created by the user from Hive
        const hivePosts = await fetchLatestProjects('crowdhive', 'created', 50);
        
        // Filter posts by the current user
        const userPosts = hivePosts.filter(post => post.author === username);
        
        // Format the posts to match our project structure
        const formattedProjects = userPosts
          .map(post => formatPostToProject(post))
          .filter(Boolean); // Remove null values
        
        setProjects(formattedProjects);
        
        // Get draft projects from localStorage
        const storedDrafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
        const userDrafts = storedDrafts.filter((draft: any) => draft.creator === username);
        setDrafts(userDrafts);
        
        // For contributions, we would fetch transfers from the blockchain
        // This is simplified for now
        setContributions([]);
        
      } catch (error) {
        console.error("Error fetching user projects:", error);
        toast({
          title: "Error",
          description: "Failed to load your projects. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProjects();
  }, [toast]);
  
  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  
  const handleCreateProject = () => {
    // Get the create project button from JoinMovementSection
    document.getElementById('create-project-btn')?.click();
  };
  
  const handleDeleteDraft = (draftId: string) => {
    try {
      // Get drafts from localStorage
      const storedDrafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      // Filter out the draft to delete
      const updatedDrafts = storedDrafts.filter((draft: any) => draft.id !== draftId);
      // Save updated drafts back to localStorage
      localStorage.setItem('projectDrafts', JSON.stringify(updatedDrafts));
      // Update state
      setDrafts(drafts.filter(draft => draft.id !== draftId));
      
      toast({
        title: "Draft deleted",
        description: "Your project draft has been removed",
      });
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast({
        title: "Error",
        description: "Failed to delete the draft. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-10 pb-10">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl font-bold mb-4 gradient-text">My Projects</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Manage your created projects, drafts, and contributions
          </p>
          
          <ProjectsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={isLoading}
            projects={projects}
            drafts={drafts}
            contributions={contributions}
            onProjectClick={handleProjectClick}
            onCreateProject={handleCreateProject}
            onDeleteDraft={handleDeleteDraft}
            onNavigateHome={() => navigate('/')}
          />
        </div>
      </div>
      
      <div className="container px-4 mx-auto py-8">
        <Button
          onClick={handleCreateProject}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>
      
      <div className="hidden">
        <JoinMovementSection />
      </div>
      
      <FooterSection />
      
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MyProjects;
