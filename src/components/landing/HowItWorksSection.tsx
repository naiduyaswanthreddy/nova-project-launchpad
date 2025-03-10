import { motion } from "framer-motion";
import { Search, Coins, Gift } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      title: "Discover Creators",
      description: "Browse through innovative projects and find creators that inspire you",
      icon: <Search className="w-10 h-10 text-purple-400" />,
    },
    {
      title: "Fund with HIVE",
      description: "Support your favorite creators directly with HIVE cryptocurrency",
      icon: <Coins className="w-10 h-10 text-purple-400" />,
    },
    {
      title: "Get Exclusive Rewards",
      description: "Receive unique benefits and rewards from the creators you support",
      icon: <Gift className="w-10 h-10 text-purple-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">How It Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fund creators directly with our decentralized platform in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="glass-card p-8 rounded-xl text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-accent/30 animate-pulse-glow">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 hidden md:block">
                {index < steps.length - 1 && (
                  <div className="text-3xl text-purple-500">→</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
