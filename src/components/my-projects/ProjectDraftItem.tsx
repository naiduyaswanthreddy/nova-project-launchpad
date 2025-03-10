
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProjectDraftItemProps {
  draft: any;
  onDraftClick: () => void;
  onDeleteDraft: (draftId: string) => void;
}

export const ProjectDraftItem = ({ draft, onDraftClick, onDeleteDraft }: ProjectDraftItemProps) => {
  return (
    <div className="relative">
      <ProjectCard
        project={{
          id: draft.id,
          title: draft.title,
          creator: draft.creator,
          description: draft.description || "Draft project",
          image: draft.coverImage || "https://placehold.co/600x400/3a206e/e8b4b6?text=Draft",
          category: draft.category,
          target: `${draft.fundingGoal || 0} HIVE`,
          raised: "0 HIVE",
          progress: 0
        }}
        onClick={onDraftClick}
      />
      <div className="absolute top-2 right-2">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteDraft(draft.id);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
