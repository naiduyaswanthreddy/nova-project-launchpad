
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingState } from "./LoadingState";
import { NotConnectedState } from "./EmptyStates";
import { EmptyProjectsState } from "./EmptyStates";
import { ProjectsGrid } from "./ProjectsGrid";
import { getConnectedUsername } from "@/utils/hive";

interface ProjectsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isLoading: boolean;
  projects: any[];
  drafts: any[];
  contributions: any[];
  onProjectClick: (project: any) => void;
  onCreateProject: () => void;
  onDeleteDraft: (draftId: string) => void;
  onNavigateHome: () => void;
}

export const ProjectsTabs = ({
  activeTab,
  setActiveTab,
  isLoading,
  projects,
  drafts,
  contributions,
  onProjectClick,
  onCreateProject,
  onDeleteDraft,
  onNavigateHome
}: ProjectsTabsProps) => {
  const renderContent = () => {
    // Not connected state
    if (!getConnectedUsername()) {
      return <NotConnectedState onNavigateHome={onNavigateHome} />;
    }
    
    // Loading state
    if (isLoading) {
      return <LoadingState />;
    }
    
    // Empty states
    if (activeTab === "created" && projects.length === 0) {
      return <EmptyProjectsState onCreateProject={onCreateProject} type="created" />;
    }
    
    if (activeTab === "drafts" && drafts.length === 0) {
      return <EmptyProjectsState onCreateProject={onCreateProject} type="drafts" />;
    }
    
    if (activeTab === "contributed" && contributions.length === 0) {
      return <EmptyProjectsState onCreateProject={onCreateProject} type="contributed" />;
    }
    
    // Projects grid
    return (
      <ProjectsGrid
        activeTab={activeTab as "created" | "drafts" | "contributed"}
        projects={projects}
        drafts={drafts}
        contributions={contributions}
        onProjectClick={onProjectClick}
        onCreateProject={onCreateProject}
        onDeleteDraft={onDeleteDraft}
      />
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
      <TabsList className="mb-8">
        <TabsTrigger value="created">Created Projects</TabsTrigger>
        <TabsTrigger value="drafts">Drafts</TabsTrigger>
        <TabsTrigger value="contributed">Contributions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="created" className="mt-6">
        {renderContent()}
      </TabsContent>
      
      <TabsContent value="drafts" className="mt-6">
        {renderContent()}
      </TabsContent>
      
      <TabsContent value="contributed" className="mt-6">
        {renderContent()}
      </TabsContent>
    </Tabs>
  );
};
