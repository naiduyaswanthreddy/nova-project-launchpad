
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ProjectDraftData {
  id: string;
  title: string;
  category: string;
  fundingGoal: string;
  description: string;
  coverImage: string;
  socialLinks: {
    website: string;
    twitter: string;
    discord: string;
    github: string;
  };
  termsAccepted: boolean;
  creator: string;
  lastUpdated: string;
}

export function useProjectDraft(draftId: string, creator: string) {
  const [draft, setDraft] = useState<ProjectDraftData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle");
  const { toast } = useToast();
  
  // Load draft on mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        setIsLoading(true);
        const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
        const existingDraft = drafts.find((d: any) => d.id === draftId);
        
        if (existingDraft) {
          // Ensure socialLinks has all required properties
          const socialLinks = existingDraft.socialLinks || {};
          existingDraft.socialLinks = {
            website: socialLinks.website || "",
            twitter: socialLinks.twitter || "",
            discord: socialLinks.discord || "",
            github: socialLinks.github || ""
          };
          
          setDraft(existingDraft);
        } else if (draftId === 'new') {
          // Create a new draft
          const newDraft: ProjectDraftData = {
            id: `draft-${Date.now()}`,
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
            termsAccepted: false,
            creator,
            lastUpdated: new Date().toISOString()
          };
          setDraft(newDraft);
          
          // Save the new draft
          saveProjectDraft(newDraft);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        toast({
          title: "Error",
          description: "Failed to load draft data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDraft();
  }, [draftId, creator, toast]);
  
  // Save draft to localStorage
  const saveProjectDraft = useCallback((updatedDraft: ProjectDraftData) => {
    try {
      setAutoSaveStatus("saving");
      
      const drafts = JSON.parse(localStorage.getItem('projectDrafts') || '[]');
      const draftIndex = drafts.findIndex((d: any) => d.id === updatedDraft.id);
      
      // Ensure socialLinks is properly formatted
      const draftToSave = {
        ...updatedDraft,
        socialLinks: {
          website: updatedDraft.socialLinks?.website || "",
          twitter: updatedDraft.socialLinks?.twitter || "",
          discord: updatedDraft.socialLinks?.discord || "",
          github: updatedDraft.socialLinks?.github || ""
        },
        lastUpdated: new Date().toISOString()
      };
      
      if (draftIndex >= 0) {
        drafts[draftIndex] = draftToSave;
      } else {
        drafts.push(draftToSave);
      }
      
      localStorage.setItem('projectDrafts', JSON.stringify(drafts));
      setAutoSaveStatus("saved");
      
      // Reset status after a delay
      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 2000);
      
      return draftToSave;
    } catch (error) {
      console.error("Error saving draft:", error);
      setAutoSaveStatus("error");
      toast({
        title: "Error",
        description: "Failed to save draft changes",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);
  
  // Update draft with new values
  const updateDraft = useCallback((updates: Partial<ProjectDraftData>) => {
    if (!draft) return;
    
    // Ensure socialLinks is properly formatted if it's being updated
    let updatedSocialLinks = draft.socialLinks;
    if (updates.socialLinks) {
      updatedSocialLinks = {
        website: updates.socialLinks.website || draft.socialLinks.website || "",
        twitter: updates.socialLinks.twitter || draft.socialLinks.twitter || "",
        discord: updates.socialLinks.discord || draft.socialLinks.discord || "",
        github: updates.socialLinks.github || draft.socialLinks.github || ""
      };
    }
    
    const updatedDraft = {
      ...draft,
      ...updates,
      socialLinks: updatedSocialLinks
    };
    
    setDraft(updatedDraft);
    saveProjectDraft(updatedDraft);
  }, [draft, saveProjectDraft]);
  
  return {
    draft,
    isLoading,
    updateDraft,
    saveProjectDraft,
    autoSaveStatus
  };
}
