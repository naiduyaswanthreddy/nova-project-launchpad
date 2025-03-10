
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Award, Star, Trophy, Users } from "lucide-react";

interface ProjectsListProps {
  projects: any[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  // Get top contributors from localStorage or create default ones
  const [topContributors, setTopContributors] = useState([
    { username: "hive_enthusiast", contributions: 2500, tier: "gold", avatar: "https://placehold.co/100/gold/white?text=HE" },
    { username: "crypto_whale", contributions: 2000, tier: "gold", avatar: "https://placehold.co/100/gold/white?text=CW" },
    { username: "web3_believer", contributions: 1500, tier: "silver", avatar: "https://placehold.co/100/silver/white?text=WB" },
    { username: "future_builder", contributions: 1000, tier: "silver", avatar: "https://placehold.co/100/silver/white?text=FB" },
    { username: "defi_explorer", contributions: 750, tier: "bronze", avatar: "https://placehold.co/100/bronze/white?text=DE" }
  ]);

  const categories = ["All", ...new Set(projects.map(p => p.category))];

  // Load user points on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem("crowdhive_user_points");
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints));
    }
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filter === "all") return true;
    return project.category?.toLowerCase() === filter.toLowerCase();
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime();
    } else if (sortBy === "funded") {
      return b.progress - a.progress;
    } else if (sortBy === "popular") {
      // Sort by number of contributors or some popularity metric
      return (b.contributors?.length || 0) - (a.contributors?.length || 0);
    }
    return 0;
  });

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Determine user tier based on points
  const getUserTier = (points: number) => {
    if (points >= 1000) return "gold";
    if (points >= 500) return "silver";
    if (points >= 100) return "bronze";
    return "newcomer";
  };

  const getContributorTierBadge = (tier: string) => {
    switch(tier) {
      case "gold":
        return (
          <Badge className="ml-2 bg-yellow-500/80 text-yellow-100">
            <Trophy className="h-3 w-3 mr-1" /> Gold
          </Badge>
        );
      case "silver":
        return (
          <Badge className="ml-2 bg-gray-400/80 text-gray-100">
            <Star className="h-3 w-3 mr-1" /> Silver
          </Badge>
        );
      case "bronze":
        return (
          <Badge className="ml-2 bg-amber-700/80 text-amber-100">
            <Award className="h-3 w-3 mr-1" /> Bronze
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex overflow-x-auto pb-2 max-w-full">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filter === category.toLowerCase() ? "default" : "outline"}
              className="mr-2 cursor-pointer px-3 py-1 text-sm capitalize"
              onClick={() => setFilter(category.toLowerCase())}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-4 items-center">
          <Tabs defaultValue="newest" value={sortBy} onValueChange={setSortBy} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="newest">Newest</TabsTrigger>
              <TabsTrigger value="funded">Most Funded</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-secondary flex items-center gap-1 px-3 py-1.5"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            <Users className="h-4 w-4" /> 
            Leaderboard
          </Badge>
        </div>
      </div>

      {showLeaderboard && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 glass-card p-6 rounded-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold gradient-text flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" /> 
              Top Contributors
            </h3>
            
            {userPoints > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Your rank:</span>
                <Badge className="bg-purple-600/80">
                  {userPoints} points ({getUserTier(userPoints)})
                </Badge>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topContributors.map((contributor, index) => (
              <motion.div
                key={contributor.username}
                className="glass-card p-4 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="relative mb-2">
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  )}
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    contributor.tier === 'gold' 
                      ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500' 
                      : contributor.tier === 'silver' 
                        ? 'bg-gray-400/20 border-2 border-gray-400 text-gray-400' 
                        : 'bg-amber-700/20 border-2 border-amber-700 text-amber-700'
                  }`}>
                    {contributor.username.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <p className="font-medium text-sm">@{contributor.username}</p>
                <p className="text-purple-400 text-sm font-bold">{contributor.contributions * 0.4} points</p>
                <div className="mt-2">
                  {getContributorTierBadge(contributor.tier)}
                </div>
                <div className="mt-2">
                  <Progress 
                    value={(contributor.contributions / 2500) * 100} 
                    className={`h-1.5 ${
                      contributor.tier === 'gold' 
                        ? 'bg-yellow-900/30' 
                        : contributor.tier === 'silver' 
                          ? 'bg-gray-700/30' 
                          : 'bg-amber-900/30'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </motion.div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
