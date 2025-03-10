
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, DollarSign, Crown, Users, Award, Sparkles, Megaphone } from "lucide-react";
import { getConnectedUsername } from "@/utils/hive";
import { FooterSection } from "@/components/landing/FooterSection";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  includedIn: ('basic' | 'pro' | 'enterprise')[];
}

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  
  const features: PlanFeature[] = [
    { name: "Create and publish projects", includedIn: ['basic', 'pro', 'enterprise'] },
    { name: "Basic project analytics", includedIn: ['basic', 'pro', 'enterprise'] },
    { name: "Community support", includedIn: ['basic', 'pro', 'enterprise'] },
    { name: "Advanced analytics dashboard", includedIn: ['pro', 'enterprise'] },
    { name: "Priority project review", includedIn: ['pro', 'enterprise'] },
    { name: "Featured in category pages", includedIn: ['pro', 'enterprise'] },
    { name: "Verified creator badge", includedIn: ['pro', 'enterprise'] },
    { name: "Reduced commission rates", includedIn: ['pro', 'enterprise'] },
    { name: "Homepage featured placement", includedIn: ['enterprise'] },
    { name: "Dedicated account manager", includedIn: ['enterprise'] },
    { name: "Custom branding options", includedIn: ['enterprise'] },
    { name: "Marketing support", includedIn: ['enterprise'] },
  ];

  const plans = [
    {
      id: 'basic',
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started with crowdfunding",
      commission: "5% on successful projects",
      icon: <Users className="h-6 w-6" />,
      color: "from-blue-500 to-purple-500",
    },
    {
      id: 'pro',
      name: "Pro",
      price: "20 HIVE",
      period: "per month",
      description: "Advanced tools for serious creators",
      commission: "3% on successful projects",
      icon: <Award className="h-6 w-6" />,
      color: "from-indigo-500 to-purple-600",
      popular: true,
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      price: "100 HIVE",
      period: "per month",
      description: "Complete solution for professional teams",
      commission: "2% on successful projects",
      icon: <Crown className="h-6 w-6" />,
      color: "from-purple-600 to-pink-600",
    }
  ];

  useEffect(() => {
    const username = getConnectedUsername();
    setIsLoggedIn(!!username);
  }, []);

  const handleSubscribe = (plan: 'basic' | 'pro' | 'enterprise') => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please connect your Hive wallet to subscribe",
        variant: "destructive"
      });
      return;
    }

    // Here we would implement the actual subscription logic
    // For now, we'll just show a toast
    toast({
      title: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Selected`,
      description: "This feature will be fully implemented soon",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container px-4 mx-auto py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Membership Plans</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan to boost your crowdfunding projects
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`border-white/10 overflow-hidden h-full ${plan.popular ? 'ring-2 ring-primary' : ''} relative glass-card`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="m-2 bg-gradient-to-r from-purple-600 to-indigo-600">Popular</Badge>
                  </div>
                )}
                <CardHeader className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    {plan.icon}
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-sm ml-1 opacity-80">{plan.period}</span>}
                  </div>
                  <CardDescription className="text-white/80 mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-8">
                  <div className="text-sm flex items-center mb-6">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    <span>Commission: {plan.commission}</span>
                  </div>
                  <div className="space-y-3">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        {feature.includedIn.includes(plan.id as any) ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${!feature.includedIn.includes(plan.id as any) ? 'text-gray-500' : ''}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className={`w-full ${plan.id === 'basic' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 
                      plan.id === 'pro' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 
                      'bg-gradient-to-r from-purple-600 to-pink-600'}`}
                    onClick={() => handleSubscribe(plan.id as any)}
                  >
                    {plan.id === 'basic' ? 'Get Started' : 'Subscribe'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <motion.div 
            className="glass-card p-8 border border-white/10 rounded-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <Megaphone className="h-8 w-8 text-primary mr-4" />
              <h2 className="text-2xl font-bold">Sponsored Project Promotions</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Boost your project's visibility with our sponsored promotion options. Get featured on the homepage, category pages, and in our newsletter.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
                  <h3 className="font-medium">Homepage Feature</h3>
                </div>
                <p className="text-sm text-gray-400">50 HIVE / week</p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
                  <h3 className="font-medium">Category Feature</h3>
                </div>
                <p className="text-sm text-gray-400">30 HIVE / week</p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
                  <h3 className="font-medium">Newsletter Feature</h3>
                </div>
                <p className="text-sm text-gray-400">100 HIVE / feature</p>
              </div>
            </div>
            <div className="mt-6">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                Promote Your Project
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
};

export default Membership;
