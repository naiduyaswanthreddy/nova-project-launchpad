
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Check, 
  Share2, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  RefreshCw, 
  ExternalLink,
  BookmarkPlus,
  CircleDollarSign,
  Award,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getConnectedUsername, 
  sendHiveTokens, 
  fetchRecentTransfers,
  getHiveExplorerUrl,
  convertHiveToUsd
} from "@/utils/hive";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Contributor {
  username: string;
  amount: string;
  date: string;
  txId?: string;
}

interface ProjectModalProps {
  project: {
    id: string;
    title: string;
    creator: string;
    image: string;
    progress: number;
    target: string;
    raised: string;
    description: string;
    contributors?: Contributor[];
    category?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const POINTS = {
  CONTRIBUTION: 10, // Base points per contribution
  CONTRIBUTION_PER_HIVE: 0.4, // Points per HIVE contributed
  COMMENT: 5, // Points for leaving a comment
  SHARE: 3, // Points for sharing a project
  BOOKMARK: 2, // Points for bookmarking a project
};

const TIERS = {
  BRONZE: 100,
  SILVER: 500,
  GOLD: 1000
};

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [amount, setAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [usdValue, setUsdValue] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedPoints = localStorage.getItem("crowdhive_user_points");
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("crowdhive_user_points", userPoints.toString());
  }, [userPoints]);

  useEffect(() => {
    if (isOpen && project) {
      setAmount("");
      setShowSuccess(false);
      setIsContributing(false);
      setContributors(project.contributors || []);
      setTransactionId(null);
      setUsdValue(null);
      setShowSocialShare(false);
      setShowPointsAnimation(false);
      setAnimatedPoints(0);
      fetchContributions();
    }
  }, [isOpen, project]);

  const getUserTier = (points: number) => {
    if (points >= TIERS.GOLD) return "gold";
    if (points >= TIERS.SILVER) return "silver";
    if (points >= TIERS.BRONZE) return "bronze";
    return "newcomer";
  };

  const awardPoints = (action: keyof typeof POINTS, value?: number) => {
    const username = getConnectedUsername();
    if (!username) return;
    
    let pointsToAdd = POINTS[action];
    
    if (action === "CONTRIBUTION" && value) {
      const amountStr = typeof value === 'number' ? value.toString() : value;
      const hiveAmount = parseFloat(amountStr);
      pointsToAdd += Math.floor(hiveAmount * POINTS.CONTRIBUTION_PER_HIVE);
    }
    
    setAnimatedPoints(pointsToAdd);
    setShowPointsAnimation(true);
    
    setTimeout(() => {
      setUserPoints(prev => prev + pointsToAdd);
      setShowPointsAnimation(false);
    }, 2000);
    
    toast({
      title: `+${pointsToAdd} points!`,
      description: `You earned points for your ${action.toLowerCase()} activity!`,
    });
  };

  // Fix the useEffect with async function
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setUsdValue(null);
      return;
    }
    
    // Define an async function inside the effect
    const updateUsdValue = async () => {
      try {
        const usd = await convertHiveToUsd(`${amount} HIVE`);
        setUsdValue(usd);
      } catch (error) {
        console.error("Error converting to USD:", error);
        setUsdValue(null);
      }
    };
    
    // Call the async function
    updateUsdValue();
  }, [amount]);

  const fetchContributions = async () => {
    if (!project) return;
    
    setIsLoading(true);
    
    try {
      const transfers = await fetchRecentTransfers(project.creator);
      
      const newContributors = transfers
        .filter(transfer => transfer.to === project.creator)
        .map(transfer => ({
          username: transfer.from,
          amount: transfer.amount,
          date: new Date(transfer.timestamp).toLocaleDateString(),
          txId: transfer.transaction_id
        }));
      
      const existingTxIds = contributors.map(c => c.txId).filter(Boolean);
      const filteredNewContributors = newContributors.filter(
        c => c.txId && !existingTxIds.includes(c.txId)
      );
      
      setContributors([...filteredNewContributors, ...contributors]);
      
      toast({
        title: "Updated contributions",
        description: "Latest contributions have been loaded",
      });
    } catch (error) {
      console.error("Error fetching contributions:", error);
      toast({
        title: "Failed to update",
        description: "Could not fetch the latest contributions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const connectedUser = getConnectedUsername();
    
    if (!connectedUser) {
      toast({
        title: "Not connected",
        description: "Please connect your Hive wallet first",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to contribute",
        variant: "destructive",
      });
      return;
    }

    if (!project) return;

    setIsContributing(true);

    try {
      const result = await sendHiveTokens(
        connectedUser,
        project.creator,
        amount,
        `Contribution to ${project.title} on CrowdHive`
      );

      if (result.success) {
        if (result.txId) {
          setTransactionId(result.txId);
        }
        
        const newContribution = {
          username: connectedUser,
          amount: `${amount} HIVE`,
          date: new Date().toLocaleDateString(),
          txId: result.txId
        };
        
        setContributors([newContribution, ...contributors]);
        
        const contributedAmount = parseFloat(amount);
        const targetAmount = parseInt(project.target.replace(/[^\d]/g, ''));
        const newProgress = Math.min(
          project.progress + Math.floor((contributedAmount / targetAmount) * 100),
          100
        );
        
        awardPoints("CONTRIBUTION", parseFloat(amount));
        
        checkMilestones(project.progress, newProgress);
        
        setShowSuccess(true);
      } else {
        toast({
          title: "Transaction failed",
          description: result.message,
          variant: "destructive",
        });
        setIsContributing(false);
      }
    } catch (error) {
      console.error("Contribution error:", error);
      toast({
        title: "Transaction error",
        description: "Failed to process your contribution",
        variant: "destructive",
      });
      setIsContributing(false);
    }
  };

  const checkMilestones = (oldProgress: number, newProgress: number) => {
    if (newProgress >= 50 && oldProgress < 50) {
      toast({
        title: "🎉 Milestone reached: 50%!",
        description: `${project?.title} is now 50% funded thanks to your contribution!`,
      });
    } else if (newProgress >= 75 && oldProgress < 75) {
      toast({
        title: "🎉 Milestone reached: 75%!",
        description: `${project?.title} is now 75% funded thanks to your contribution!`,
      });
    } else if (newProgress >= 100 && oldProgress < 100) {
      toast({
        title: "🎉 Goal reached: 100%!",
        description: `${project?.title} is now fully funded thanks to your contribution!`,
      });
    } else {
      toast({
        title: "Contribution successful!",
        description: `You've contributed ${amount} HIVE to ${project?.title}`,
      });
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    const username = getConnectedUsername();
    if (!username) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to post comments",
        variant: "destructive"
      });
      return;
    }
    
    const newComment = {
      id: Date.now(),
      username,
      text: comment,
      date: new Date().toLocaleString()
    };
    
    setComments([newComment, ...comments]);
    setComment("");
    
    awardPoints("COMMENT");
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion"
    });
  };

  const shareProject = (platform: string) => {
    if (!project) return;
    
    const projectTitle = encodeURIComponent(project.title);
    const message = encodeURIComponent(`I just contributed to ${project.title} on CrowdHive! Check it out and join me in supporting this project.`);
    let url = '';

    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${message}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=https://crowdhive.io&title=${projectTitle}`;
        break;
      case 'discord':
        toast({
          title: "Share to Discord",
          description: "Project link copied to clipboard! Paste it in Discord.",
        });
        navigator.clipboard.writeText(`Check out ${project.title} on CrowdHive!`);
        break;
    }

    const username = getConnectedUsername();
    if (username) {
      awardPoints("SHARE");
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleBookmarkProject = () => {
    if (!project) return;
    
    toast({
      title: "Project bookmarked",
      description: "This project has been added to your bookmarks.",
      variant: "default",
    });
    
    const username = getConnectedUsername();
    if (username) {
      awardPoints("BOOKMARK");
    }
  };

  const handleSocialShare = () => {
    setShowSocialShare(true);
  };

  const renderPointsBadge = () => {
    const tier = getUserTier(userPoints);
    return (
      <div className="flex items-center">
        {tier === "gold" && (
          <Badge className="bg-yellow-500/80 text-yellow-100 flex items-center">
            <Award className="h-3 w-3 mr-1" /> Gold Tier
          </Badge>
        )}
        {tier === "silver" && (
          <Badge className="bg-gray-400/80 text-gray-100 flex items-center">
            <Star className="h-3 w-3 mr-1" /> Silver Tier
          </Badge>
        )}
        {tier === "bronze" && (
          <Badge className="bg-amber-700/80 text-amber-100 flex items-center">
            <Award className="h-3 w-3 mr-1" /> Bronze Tier
          </Badge>
        )}
        {tier === "newcomer" && (
          <Badge className="bg-blue-500/80 text-blue-100 flex items-center">
            Newcomer
          </Badge>
        )}
        <span className="ml-2 text-sm">
          {userPoints} points
        </span>
      </div>
    );
  };

  const renderTransactionReceipt = () => {
    if (!project || !transactionId) return null;
    
    return (
      <div className="border border-white/10 rounded-lg p-4 bg-black/20 mb-6">
        <h3 className="text-base font-semibold mb-3 flex items-center">
          <CircleDollarSign className="mr-2 h-4 w-4 text-green-400" />
          Transaction Receipt
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Amount:</span>
            <span className="font-medium">{amount} HIVE</span>
          </div>
          
          {usdValue && (
            <div className="flex justify-between">
              <span className="text-gray-400">USD Value:</span>
              <span className="font-medium">{usdValue}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-400">From:</span>
            <span className="font-medium">@{getConnectedUsername()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">To:</span>
            <span className="font-medium">@{project.creator}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Date:</span>
            <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-gray-400">Transaction ID:</span>
            <a 
              href={getHiveExplorerUrl(transactionId)} 
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-400 hover:text-purple-300 flex items-center"
            >
              View on Hive Explorer
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (!project || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {showPointsAnimation && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-2xl font-bold text-purple-400"
          >
            +{animatedPoints} points!
          </motion.div>
        </div>
      )}
      
      <div 
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl animate-in fade-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {showSuccess ? (
          <div className="p-10 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Contribution Successful!</h2>
            
            {renderTransactionReceipt()}
            
            <p className="text-lg text-gray-300 mb-6">
              Thank you for supporting {project.title} with {amount} HIVE!
            </p>
            
            <div className="mb-6 p-4 bg-purple-900/20 border border-purple-900/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                <Award className="text-purple-400 mr-2 h-5 w-5" />
                Your Rewards Status
              </h3>
              <div className="flex justify-center items-center mb-2">
                {renderPointsBadge()}
              </div>
              <p className="text-sm text-gray-400">
                Keep contributing to unlock more rewards and exclusive features!
              </p>
            </div>
            
            {!showSocialShare ? (
              <div className="flex flex-col space-y-4 items-center">
                <Button 
                  onClick={handleSocialShare}
                  variant="outline"
                  className="flex items-center"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share your contribution
                </Button>
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-2">
                  Share your contribution with others:
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => shareProject('twitter')}
                    className="bg-[#1DA1F2]/10 border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20"
                  >
                    <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => shareProject('linkedin')}
                    className="bg-[#0077B5]/10 border-[#0077B5]/20 hover:bg-[#0077B5]/20"
                  >
                    <Linkedin className="mr-2 h-4 w-4 text-[#0077B5]" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => shareProject('discord')}
                    className="bg-[#5865F2]/10 border-[#5865F2]/20 hover:bg-[#5865F2]/20"
                  >
                    <MessageCircle className="mr-2 h-4 w-4 text-[#5865F2]" />
                    Discord
                  </Button>
                </div>
                <Button 
                  onClick={onClose}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full mb-2 inline-block">
                  {project.category || "Project"}
                </span>
                <h2 className="text-3xl font-bold">{project.title}</h2>
                <p className="text-gray-300">by {project.creator}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmarkProject}
                className="absolute top-4 right-16 rounded-full bg-black/50 hover:bg-black/70"
                title="Bookmark project"
              >
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              
              {getConnectedUsername() && (
                <div className="absolute top-4 left-4">
                  {renderPointsBadge()}
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-sm text-gray-300">
                  <span>{project.raised}</span>
                  <span>{project.target}</span>
                </div>
                <Progress 
                  value={project.progress} 
                  className="h-3 mb-2 bg-gray-700 progress-animate"
                />
                <div className="text-right text-sm text-purple-400">
                  {project.progress}% funded
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="contributors">Contributors</TabsTrigger>
                      <TabsTrigger value="updates">Updates</TabsTrigger>
                      <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="about" className="space-y-4">
                      <h3 className="text-xl font-semibold">About this project</h3>
                      <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
                      
                      <div className="flex space-x-2 mt-6">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => shareProject('twitter')}
                        >
                          <Twitter size={16} />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => shareProject('linkedin')}
                        >
                          <Linkedin size={16} />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => shareProject('discord')}
                        >
                          <MessageCircle size={16} />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contributors">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Contributors</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={fetchContributions}
                          disabled={isLoading}
                          className="flex items-center gap-1"
                        >
                          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                          <span>Refresh</span>
                        </Button>
                      </div>
                      
                      {contributors.length > 0 ? (
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                          {contributors.map((contributor, index) => (
                            <div key={index} className="border border-white/10 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <p className="font-medium">@{contributor.username}</p>
                                <p className="text-sm text-gray-400">{contributor.date}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-purple-400 font-semibold">
                                  {contributor.amount}
                                </div>
                                {contributor.txId && (
                                  <a 
                                    href={getHiveExplorerUrl(contributor.txId)} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-gray-400 hover:text-purple-400 flex items-center mt-1"
                                  >
                                    View transaction <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No contributors yet. Be the first!</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="updates">
                      <div className="text-center py-8">
                        <Share2 className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Project Updates</h3>
                        <p className="text-gray-400">The creator hasn't posted any updates yet.</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="discussion">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Discussion</h3>
                        
                        {getConnectedUsername() ? (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={handleAddComment}>Post</Button>
                          </div>
                        ) : (
                          <div className="text-sm text-yellow-400 mb-4">
                            Connect your Hive wallet to join the discussion
                          </div>
                        )}
                        
                        {comments.length > 0 ? (
                          <div className="space-y-4 mt-4">
                            {comments.map((item) => (
                              <div key={item.id} className="border border-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="font-medium">@{item.username}</div>
                                  <div className="text-xs text-gray-400">{item.date}</div>
                                </div>
                                <p className="text-gray-300">{item.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 mt-4">No comments yet. Start the conversation!</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="md:col-span-2">
                  <div className="border border-white/10 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4">Contribute to this project</h3>
                    <form onSubmit={handleContribute} className="space-y-4">
                      <div>
                        <Input
                          type="number"
                          placeholder="Amount in HIVE"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min="0.1"
                          step="0.1"
                          className="w-full"
                          disabled={isContributing}
                        />
                        
                        {usdValue && (
                          <div className="text-right text-xs text-gray-400 mt-1">
                            ≈ {usdValue} USD
                          </div>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        disabled={isContributing || !getConnectedUsername()}
                      >
                        {isContributing ? 
                          "Processing..." : 
                          getConnectedUsername() ? 
                            "Contribute with HIVE" : 
                            "Connect wallet to contribute"
                        }
                      </Button>
                      
                      {!getConnectedUsername() && (
                        <p className="text-xs text-center text-yellow-400 mt-2">
                          You need to connect your Hive wallet first
                        </p>
                      )}
                      
                      <p className="text-xs text-center text-gray-400 mt-4">
                        By contributing, you agree to our Terms of Service and the project's funding terms.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
