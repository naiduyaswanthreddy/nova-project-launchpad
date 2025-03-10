
import { useState, useEffect } from "react";

export function useBookmarks() {
  const [bookmarkedProjects, setBookmarkedProjects] = useState<string[]>([]);
  
  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedProjects');
    if (savedBookmarks) {
      setBookmarkedProjects(JSON.parse(savedBookmarks));
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarkedProjects', JSON.stringify(bookmarkedProjects));
  }, [bookmarkedProjects]);
  
  const toggleBookmark = (projectId: string) => {
    setBookmarkedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };
  
  const isBookmarked = (projectId: string) => {
    return bookmarkedProjects.includes(projectId);
  };
  
  return {
    bookmarkedProjects,
    toggleBookmark,
    isBookmarked
  };
}
