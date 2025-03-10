
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "@/components/project/ProjectModal";
import { Input } from "@/components/ui/input";
import { Search, X, Check, Trophy, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import debounce from 'lodash/debounce';

interface Contributor {
  username: string;
  amount: string;
  date: string;
}

interface Project {
  id: string;
  title: string;
  creator: string;
  image: string;
  progress: number;
  target: string;
  raised: string;
  category: string;
  description: string;
  contributors: Contributor[];
}

const projectDescriptions = [
  "This innovative decentralized art gallery aims to showcase digital artworks as NFTs while providing artists with fair compensation. By leveraging blockchain technology, we're creating a transparent marketplace where creators retain more control and earnings from their work. The platform will feature curated exhibitions, virtual reality galleries, and direct artist-to-collector connections.",
  "Building a community-powered podcast network that democratizes content creation and distribution. Our platform enables independent podcasters to receive direct funding from listeners without intermediaries taking large cuts. Features include exclusive content for supporters, community voting on topics, and fair monetization options for creators of all sizes.",
  "A revolutionary blockchain gaming platform that lets players truly own their in-game assets as NFTs. We're developing a suite of games with interoperable assets, meaning items purchased or earned in one game can be used across our entire ecosystem. The platform will feature PvP tournaments with HIVE token prizes and a player-driven marketplace.",
  "Creating a decentralized tracking system for renewable energy production and consumption. This platform helps individuals and communities monitor and verify their sustainable energy usage while earning rewards for positive environmental impact. The system interfaces with smart meters and uses blockchain for immutable record-keeping."
];

const sampleContributors = [
  { username: "hive_enthusiast", amount: "500 HIVE", date: "2 days ago" },
  { username: "crypto_whale", amount: "1,000 HIVE", date: "3 days ago" },
  { username: "web3_believer", amount: "250 HIVE", date: "5 days ago" },
  { username: "future_builder", amount: "100 HIVE", date: "1 week ago" },
  { username: "defi_explorer", amount: "75 HIVE", date: "1 week ago" }
];

const categoryImages = {
  Art: "https://placehold.co/600x400/7928CA/ffffff?text=Art+Project",
  Tech: "https://placehold.co/600x400/0070F3/ffffff?text=Tech+Project",
  Community: "https://placehold.co/600x400/F5A623/ffffff?text=Community+Project",
  Gaming: "https://placehold.co/600x400/6EE7B7/333333?text=Gaming+Project",
  Environment: "https://placehold.co/600x400/10B981/ffffff?text=Green+Project",
  Education: "https://placehold.co/600x400/3B82F6/ffffff?text=Education+Project",
  Finance: "https://placehold.co/600x400/6366F1/ffffff?text=Finance+Project",
  Health: "https://placehold.co/600x400/EC4899/ffffff?text=Health+Project"
};

const generateProjects = (count: number, startId: number): Project[] => {
  const categories = ["Art", "Tech", "Community", "Gaming", "Environment", "Education", "Finance", "Health"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = startId + index;
    const progress = Math.floor(Math.random() * 100);
    const target = `${(Math.floor(Math.random() * 20) + 5) * 1000} HIVE`;
    const raised = `${Math.floor(progress * parseInt(target) / 100)} HIVE`;
    const category = categories[id % categories.length];
    
    return {
      id: id.toString(),
      title: `Project ${id}`,
      creator: `Creator${id}`,
      image: categoryImages[category as keyof typeof categoryImages] || `https://placehold.co/600x400/3a206e/e8b4b6?text=Project+${id}`,
      progress,
      target,
      raised,
      category,
      description: projectDescriptions[id % projectDescriptions.length],
      contributors: sampleContributors.slice(0, (id % 5) + 1)
    };
  });
};

const FeaturedProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Decentralized Art Gallery",
      creator: "ArtisTech",
      image: categoryImages["Art"],
      progress: 75,
      target: "10,000 HIVE",
      raised: "7,500 HIVE",
      category: "Art",
      description: projectDescriptions[0],
      contributors: sampleContributors.slice(0, 3)
    },
    {
      id: "2",
      title: "Community Podcast Network",
      creator: "Voice DAO",
      image: categoryImages["Community"],
      progress: 45,
      target: "5,000 HIVE",
      raised: "2,250 HIVE",
      category: "Community",
      description: projectDescriptions[1],
      contributors: sampleContributors.slice(1, 4)
    },
    {
      id: "3",
      title: "Blockchain Gaming Platform",
      creator: "GameChain",
      image: categoryImages["Gaming"],
      progress: 90,
      target: "20,000 HIVE",
      raised: "18,000 HIVE",
      category: "Gaming",
      description: projectDescriptions[2],
      contributors: sampleContributors.slice(0, 5)
    },
    {
      id: "4",
      title: "Sustainable Energy Tracker",
      creator: "GreenBlock",
      image: categoryImages["Environment"],
      progress: 30,
      target: "15,000 HIVE",
      raised: "4,500 HIVE",
      category: "Environment",
      description: projectDescriptions[3],
      contributors: sampleContributors.slice(2, 4)
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [highlightedTerms, setHighlightedTerms] = useState<string[]>([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState([
    { username: "hive_enthusiast", contributions: 2500, tier: "gold", avatar: "https://placehold.co/100/gold/white?text=HE" },
    { username: "crypto_whale", contributions: 2000, tier: "gold", avatar: "https://placehold.co/100/gold/white?text=CW" },
    { username: "web3_believer", contributions: 1500, tier: "silver", avatar: "https://placehold.co/100/silver/white?text=WB" },
    { username: "future_builder", contributions: 1000, tier: "silver", avatar: "https://placehold.co/100/silver/white?text=FB" },
    { username: "defi_explorer", contributions: 750, tier: "bronze", avatar: "https://placehold.co/100/bronze/white?text=DE" },
    { username: "blockchain_fan", contributions: 500, tier: "bronze", avatar: "https://placehold.co/100/bronze/white?text=BF" },
    { username: "hive_supporter", contributions: 350, tier: "bronze", avatar: "https://placehold.co/100/bronze/white?text=HS" },
  ]);
  const { toast } = useToast();

  const categories = ["Art", "Tech", "Community", "Gaming", "Environment", "Education", "Finance", "Health"];

  useEffect(() => {
    if (searchTerm.trim()) {
      setHighlightedTerms(searchTerm.trim().toLowerCase().split(/\s+/));
    } else {
      setHighlightedTerms([]);
    }
  }, [searchTerm]);

  const loadMoreProjects = () => {
    const newProjects = generateProjects(8, projects.length + 1);
    setProjects([...projects, ...newProjects]);
    
    toast({
      title: "Projects loaded",
      description: "8 more projects have been loaded",
    });
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm.trim() || 
                          project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.includes(project.category);
    
    return matchesSearch && matchesCategory;
  });

  const highlightText = (text: string) => {
    if (highlightedTerms.length === 0) return text;
    
    let highlightedText = text;
    highlightedTerms.forEach(term => {
      if (term.length > 2) {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-purple-400/30 text-inherit px-1 rounded">$1</mark>');
      }
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const topProjects = [...projects]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.add('loaded');
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
    <section id="projects" className="py-20 bg-secondary/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Featured Projects</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover innovative creators and become part of their journey
          </p>
        </div>
        
        <div className="mb-10 flex flex-col md:flex-row gap-4 items-start justify-between">
          <div className="w-full md:w-1/2 relative">
            <Input
              onChange={handleSearchChange}
              placeholder="Search projects by title, creator or description..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          
          <div className="w-full md:w-auto">
            <p className="mb-2 font-medium">Filter by category:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategoryFilter(category)}
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-12 glass-card p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-4 gradient-text">Top Funded Projects</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2">Rank</th>
                  <th className="text-left py-2">Project</th>
                  <th className="text-left py-2">Creator</th>
                  <th className="text-left py-2">Funding</th>
                  <th className="text-left py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map((project, index) => (
                  <tr 
                    key={project.id} 
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => openProjectModal(project)}
                  >
                    <td className="py-3 font-medium">#{index + 1}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-10 h-10 rounded-md object-cover lazy-image"
                          loading="lazy"
                          onLoad={handleImageLoad}
                        />
                        <span>{highlightText(project.title)}</span>
                      </div>
                    </td>
                    <td className="py-3">{highlightText(project.creator)}</td>
                    <td className="py-3">{project.raised}</td>
                    <td className="py-3 w-32">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2 flex-1 bg-gray-700 progress-animate" />
                        <span className="text-xs text-purple-400">{project.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-12 glass-card p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-4 gradient-text">Top Contributors</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2">Rank</th>
                  <th className="text-left py-2">Contributor</th>
                  <th className="text-left py-2">Points</th>
                  <th className="text-left py-2">Tier</th>
                  <th className="text-left py-2">Total Contributions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardUsers.map((user, index) => (
                  <motion.tr 
                    key={user.username} 
                    className="border-b border-white/5 hover:bg-white/5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="py-3 font-medium">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-yellow-500 mr-1" /> 
                          #1
                        </div>
                      ) : index === 1 ? (
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-gray-400 mr-1" /> 
                          #2
                        </div>
                      ) : index === 2 ? (
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-amber-700 mr-1" /> 
                          #3
                        </div>
                      ) : (
                        `#${index + 1}`
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            user.tier === 'gold' 
                              ? 'bg-yellow-500/20 border-2 border-yellow-500' 
                              : user.tier === 'silver' 
                                ? 'bg-gray-400/20 border-2 border-gray-400' 
                                : 'bg-amber-700/20 border-2 border-amber-700'
                          }`}
                        >
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span>@{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      >
                        {user.contributions * 0.4} pts
                      </motion.div>
                    </td>
                    <td className="py-3">
                      {getContributorTierBadge(user.tier)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="bg-gray-700 h-2 rounded-full overflow-hidden w-32"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <motion.div 
                            className={`h-full ${
                              user.tier === 'gold' 
                                ? 'bg-yellow-500' 
                                : user.tier === 'silver' 
                                  ? 'bg-gray-400' 
                                  : 'bg-amber-700'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(user.contributions / 2500) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          />
                        </motion.div>
                        <span>{user.contributions} HIVE</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="glass-card rounded-xl overflow-hidden h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index % 8 * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 lazy-image"
                  loading="lazy"
                  onLoad={handleImageLoad}
                />
              </div>
              <div className="p-6">
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-2">{highlightText(project.title)}</h3>
                <p className="text-gray-400 mb-4">by {highlightText(project.creator)}</p>
                <div className="mb-2 flex justify-between text-sm text-gray-300">
                  <span>{project.raised}</span>
                  <span>{project.target}</span>
                </div>
                <Progress 
                  value={project.progress} 
                  className="h-2 mb-4 bg-gray-700 progress-animate"
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-purple-400">
                    {project.progress}% funded
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openProjectModal(project)}
                    className="transition-all hover:bg-purple-500/20"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 glass-card rounded-xl p-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No matching projects found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters to find what you're looking for.</p>
            {selectedCategories.length > 0 && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedCategories([])}
              >
                Clear category filters
              </Button>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            onClick={loadMoreProjects}
            className="gradient-border bg-accent/30 hover:bg-accent/50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300"
          >
            Load More Projects
          </Button>
        </div>
      </div>
      
      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default FeaturedProjectsSection;
