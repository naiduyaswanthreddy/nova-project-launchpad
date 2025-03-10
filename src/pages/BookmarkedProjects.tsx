
import { useState, useEffect } from "react";
import { FooterSection } from "@/components/landing/FooterSection";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/my-projects/LoadingState";
import { ProjectModal } from "@/components/project/ProjectModal";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { fetchProjectDetails, formatPostToProject } from "@/utils/hive/projects";
import { Bookmark } from "lucide-react";
import { ProjectsList } from "@/components/project/ProjectsList";

const BookmarkedProjects = () => {
  const [bookmarkedProjectsData, setBookmarkedProjectsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookmarkedProjects } = useBookmarks();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBookmarkedProjects = async () => {
      setIsLoading(true);
      
      try {
        const projectPromises = bookmarkedProjects.map(async (id) => {
          // Project IDs are stored as "author-permlink"
          const [author, permlink] = id.split('-');
          if (!author || !permlink) return null;
          
          const projectData = await fetchProjectDetails(author, permlink);
          return projectData ? formatPostToProject(projectData) : null;
        });
        
        const projectsData = await Promise.all(projectPromises);
        setBookmarkedProjectsData(projectsData.filter(Boolean));
      } catch (error) {
        console.error("Error fetching bookmarked projects:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookmarked projects. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookmarkedProjects();
  }, [bookmarkedProjects, toast]);
  
  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-10 pb-10">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl font-bold mb-4 gradient-text flex items-center">
            <Bookmark className="mr-3 h-6 w-6" />
            Bookmarked Projects
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
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
              <Bookmark className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl text-gray-400 mb-2">No bookmarked projects yet</p>
              <p className="text-gray-500">
                Start exploring projects and bookmark your favorites
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
