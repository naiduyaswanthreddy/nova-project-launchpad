
import { ProjectCard } from "@/components/project/ProjectCard";
import { ProjectDraftItem } from "./ProjectDraftItem";

interface ProjectsGridProps {
  activeTab: "created" | "drafts" | "contributed";
  projects: any[];
  drafts: any[];
  contributions: any[];
  onProjectClick: (project: any) => void;
  onCreateProject: () => void;
  onDeleteDraft: (draftId: string) => void;
}

export const ProjectsGrid = ({
  activeTab,
  projects,
  drafts,
  contributions,
  onProjectClick,
  onCreateProject,
  onDeleteDraft
}: ProjectsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {activeTab === "created" && projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project)}
        />
      ))}
      
      {activeTab === "drafts" && drafts.map(draft => (
        <ProjectDraftItem
          key={draft.id}
          draft={draft}
          onDraftClick={onCreateProject}
          onDeleteDraft={onDeleteDraft}
        />
      ))}
      
      {activeTab === "contributed" && contributions.map(contribution => (
        <ProjectCard
          key={contribution.id}
          project={contribution}
          onClick={() => onProjectClick(contribution)}
        />
      ))}
    </div>
  );
};
