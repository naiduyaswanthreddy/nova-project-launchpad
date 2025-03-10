
import { motion } from "framer-motion";
import { Globe, UserX, ShieldCheck, Award, CreditCard, Layers, LineChart } from "lucide-react";

export const WhyChooseUsSection = () => {
  const features = [
    {
      title: "Decentralized",
      description: "Our platform runs on the HIVE blockchain, ensuring full transparency and no central control",
      icon: <Globe className="w-12 h-12 text-purple-400" />,
    },
    {
      title: "No Middlemen",
      description: "Connect directly with creators, with no platform fees or intermediaries taking a cut",
      icon: <UserX className="w-12 h-12 text-purple-400" />,
    },
    {
      title: "Secure Transactions",
      description: "Every contribution is recorded on the blockchain, making transactions secure and immutable",
      icon: <ShieldCheck className="w-12 h-12 text-purple-400" />,
    },
    {
      title: "Earn Rewards",
      description: "Support creators and earn rewards through the HIVE ecosystem's built-in incentives",
      icon: <Award className="w-12 h-12 text-purple-400" />,
    },
  ];

  const revenueModels = [
    {
      title: "Success-Based Commission",
      description: "We only take a small 3-5% commission when your project is successfully funded",
      icon: <LineChart className="w-12 h-12 text-purple-400" />,
    },
    {
      title: "Tiered Memberships",
      description: "Choose from Basic, Pro, or Enterprise plans with exclusive features for creators",
      icon: <Layers className="w-12 h-12 text-purple-400" />,
    },
    {
      title: "Sponsored Promotions",
      description: "Get your project featured on the homepage and increase visibility to potential backers",
      icon: <CreditCard className="w-12 h-12 text-purple-400" />,
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-gradient-to-t from-background to-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Why Choose Us</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our Web3 platform offers unique advantages for both creators and supporters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card p-8 rounded-xl text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-accent/30 animate-pulse-glow">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Revenue Models</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Sustainable revenue streams that align with creator success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {revenueModels.map((model, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 rounded-xl text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-accent/30 animate-pulse-glow">
                    {model.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{model.title}</h3>
                <p className="text-gray-400">{model.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
