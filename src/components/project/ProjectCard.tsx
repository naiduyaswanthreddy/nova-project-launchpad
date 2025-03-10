
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    creator: string;
    description: string;
    image: string;
    category: string;
    target: string;
    raised: string;
    progress: number;
  };
  onClick: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(project.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(project.id);
  };

  return (
    <Card 
      className="overflow-hidden border-white/10 hover:border-white/20 transition-all cursor-pointer glass-card"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${bookmarked ? 'bg-primary/20' : 'bg-black/20'}`}
            onClick={handleBookmarkClick}
          >
            <Bookmark 
              className={`h-4 w-4 ${bookmarked ? 'fill-primary text-primary' : 'text-white'}`} 
            />
          </Button>
        </div>
        <Badge className="absolute top-2 left-2 bg-secondary/80">{project.category}</Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg truncate">{project.title}</CardTitle>
        <CardDescription className="text-sm">By {project.creator}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
        <div className="mt-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Raised: {project.raised}</span>
            <span>Goal: {project.target}</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full">
          <div className="text-xs text-muted-foreground mb-2">{project.progress}% funded</div>
        </div>
      </CardFooter>
    </Card>
  );
};
