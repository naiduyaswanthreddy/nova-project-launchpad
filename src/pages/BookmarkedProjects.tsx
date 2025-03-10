
import { useState, useEffect } from "react";
import { FooterSection } from "@/components/landing/FooterSection";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/my-projects/LoadingState";
import { ProjectModal } from "@/components/project/ProjectModal";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { fetchProjectDetails, formatPostToProject } from "@/utils/hive/projects";
import { Bookmark, RefreshCw, AlertCircle } from "lucide-react";
import { ProjectsList } from "@/components/project/ProjectsList";
import { Button } from "@/components/ui/button";
import { Project } from "@/components/project/ProjectsList";

const BookmarkedProjects = () => {
  const [bookmarkedProjectsData, setBookmarkedProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookmarkedProjects } = useBookmarks();
  const { toast } = useToast();
  
  const fetchBookmarkedProjects = async () => {
    if (isRefreshing) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    
    try {
      const projectPromises = bookmarkedProjects.map(async (id) => {
        // Project IDs are stored as "author-permlink"
        const [author, permlink] = id.split('-');
        if (!author || !permlink) return null;
        
        const projectData = await fetchProjectDetails(author, permlink);
        return projectData ? formatPostToProject(projectData) : null;
      });
      
      const projectsData = await Promise.all(projectPromises);
      const validProjects = projectsData.filter(Boolean) as Project[];
      setBookmarkedProjectsData(validProjects);
      
      if (isRefreshing) {
        toast({
          title: "Bookmarks refreshed",
          description: `Found ${validProjects.length} bookmarked projects`
        });
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error("Error fetching bookmarked projects:", error);
      toast({
        title: "Error",
        description: "Failed to load your bookmarked projects. Please try again later.",
        variant: "destructive",
      });
      setIsRefreshing(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookmarkedProjects();
  }, [bookmarkedProjects, toast]);
  
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookmarkedProjects();
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-10 pb-10">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold gradient-text flex items-center">
              <Bookmark className="mr-3 h-6 w-6" />
              Bookmarked Projects
            </h1>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <p className="text-xl text-gray-400 max-w-2xl mb-8">
            Projects you've saved for later
          </p>
          
          {isLoading ? (
            <LoadingState />
          ) : bookmarkedProjectsData.length > 0 ? (
            <div className="mt-8">
              <ProjectsList 
                projects={bookmarkedProjectsData} 
                onProjectClick={handleProjectClick}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl text-gray-400 mb-2">No bookmarked projects found</p>
              <p className="text-gray-500 text-center max-w-md">
                Start exploring projects and use the bookmark icon to save your favorites.
                They will appear here for easy access.
              </p>
            </div>
          )}
        </div>
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

export default BookmarkedProjects;
