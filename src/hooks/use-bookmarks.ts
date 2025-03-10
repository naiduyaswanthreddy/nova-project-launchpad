
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface BookmarkState {
  bookmarkedProjects: string[];
  toggleBookmark: (projectId: string) => void;
  isBookmarked: (projectId: string) => boolean;
  clearBookmarks: () => void;
}

export function useBookmarks(): BookmarkState {
  const [bookmarkedProjects, setBookmarkedProjects] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('bookmarkedProjects');
      if (savedBookmarks) {
        setBookmarkedProjects(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast({
        title: "Error",
        description: "Could not load your bookmarks. Please try again.",
        variant: "destructive"
      });
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bookmarkedProjects', JSON.stringify(bookmarkedProjects));
    } catch (error) {
      console.error("Error saving bookmarks:", error);
      toast({
        title: "Error",
        description: "Could not save your bookmark. Please try again.",
        variant: "destructive"
      });
    }
  }, [bookmarkedProjects, toast]);
  
  const toggleBookmark = (projectId: string) => {
    try {
      setBookmarkedProjects(prev => {
        if (prev.includes(projectId)) {
          toast({
            title: "Bookmark removed",
            description: "Project removed from your bookmarks",
          });
          return prev.filter(id => id !== projectId);
        } else {
          toast({
            title: "Bookmark added",
            description: "Project added to your bookmarks",
          });
          return [...prev, projectId];
        }
      });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Could not update your bookmark. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const isBookmarked = (projectId: string): boolean => {
    return bookmarkedProjects.includes(projectId);
  };
  
  const clearBookmarks = () => {
    try {
      setBookmarkedProjects([]);
      localStorage.removeItem('bookmarkedProjects');
      toast({
        title: "Bookmarks cleared",
        description: "All bookmarks have been removed",
      });
    } catch (error) {
      console.error("Error clearing bookmarks:", error);
      toast({
        title: "Error",
        description: "Could not clear your bookmarks. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return {
    bookmarkedProjects,
    toggleBookmark,
    isBookmarked,
    clearBookmarks
  };
}
