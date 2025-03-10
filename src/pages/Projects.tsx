
import { useState, useEffect } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/landing/FooterSection";
import { useToast } from "@/hooks/use-toast";
import { fetchLatestProjects, formatPostToProject } from "@/utils/hive";
import { ProjectsList } from "@/components/project/ProjectsList";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Projects = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const PROJECTS_PER_PAGE = 20;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const hivePosts = await fetchLatestProjects('crowdhive', 'created', PROJECTS_PER_PAGE);
        
        // Format the posts to match our project structure
        const formattedProjects = hivePosts
          .map(post => formatPostToProject(post))
          .filter(Boolean); // Remove null values
        
        setProjects(formattedProjects);
        setHasMore(hivePosts.length >= PROJECTS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects from the Hive blockchain. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const loadMoreProjects = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      // In a real implementation, we would use the last post's author and permlink as the start parameter
      const nextPage = page + 1;
      const hivePosts = await fetchLatestProjects(
        'crowdhive', 
        'created', 
        PROJECTS_PER_PAGE,
        // We would normally pass the last post's author and permlink here
      );
      
      // Format the posts to match our project structure
      const formattedProjects = hivePosts
        .map(post => formatPostToProject(post))
        .filter(Boolean); // Remove null values
      
      if (formattedProjects.length > 0) {
        setProjects(prev => [...prev, ...formattedProjects]);
        setPage(nextPage);
        setHasMore(formattedProjects.length >= PROJECTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more projects:", error);
      toast({
        title: "Error",
        description: "Failed to load more projects. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-20 pb-10">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Discover Projects</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore innovative projects from creators around the world and be part of something amazing
          </p>
        </div>
      </div>
      
      <div className="container px-4 mx-auto pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : projects.length > 0 ? (
          <>
            <ProjectsList projects={projects} />
            
            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button 
                  onClick={loadMoreProjects} 
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Projects'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">No Projects Found</h3>
            <p className="text-gray-400 mb-8">
              Be the first to create a project on CrowdHive!
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={() => document.getElementById('create-project-btn')?.click()}
            >
              Start a Project
            </Button>
          </div>
        )}
      </div>
      
      <FooterSection />
    </div>
  );
};

export default Projects;
