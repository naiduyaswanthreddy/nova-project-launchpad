
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Star } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    creator: string;
    description: string;
    image: string;
    category?: string;
    target: string;
    raised: string;
    progress: number;
  };
  onClick: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  // Truncate description to 100 characters
  const truncatedDescription = project.description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .slice(0, 100) + (project.description.length > 100 ? '...' : '');

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
      }
    },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 8px 10px -6px rgba(124, 58, 237, 0.1)",
      transition: { 
        duration: 0.2 
      }
    }
  };
  
  // Determine if project is trending (for UI highlights)
  const isTrending = project.progress > 70;
  const isAlmostFunded = project.progress > 90;

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      onClick={onClick}
      className="glass-card rounded-lg overflow-hidden cursor-pointer h-full flex flex-col shadow-sm transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {project.category && (
          <div className="absolute top-3 left-3">
            <span className="text-xs bg-purple-900/70 text-purple-100 px-2 py-1 rounded-full">
              {project.category}
            </span>
          </div>
        )}
        
        {isTrending && (
          <div className="absolute top-3 right-3">
            {isAlmostFunded ? (
              <Badge className="bg-green-600/80 text-white flex items-center gap-1 px-2">
                <Star className="h-3 w-3" /> Almost Funded!
              </Badge>
            ) : (
              <Badge className="bg-purple-600/80 text-white flex items-center gap-1 px-2">
                <Award className="h-3 w-3" /> Trending
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-1">
          {truncatedDescription}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>{project.raised}</span>
            <span>{project.target}</span>
          </div>
          <Progress 
            value={project.progress} 
            className={`h-2 mb-2 ${
              project.progress > 90 
                ? 'bg-green-900/50' 
                : project.progress > 70 
                  ? 'bg-purple-900/50' 
                  : 'bg-gray-700'
            }`} 
          />
          <div className="flex justify-between items-center">
            <div className={`text-sm ${
              project.progress > 90 
                ? 'text-green-400' 
                : project.progress > 70 
                  ? 'text-purple-400' 
                  : 'text-primary'
            }`}>
              {project.progress}% funded
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-xs text-gray-400 hover:text-purple-400 transition-colors"
            >
              by @{project.creator}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
