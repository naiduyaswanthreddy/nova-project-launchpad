
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreateProjectForm } from "@/components/project/CreateProjectForm";
import { Rocket } from "lucide-react";

export const JoinMovementSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  return (
    <section id="join" className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-2xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Join the Movement</h2>
            <p className="text-xl text-gray-300 mb-8">
              Be part of the decentralized funding revolution and connect with creators around the world
            </p>

            <Button 
              id="create-project-btn"
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-6 px-8"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start a Project
            </Button>

            <p className="mt-6 text-sm text-gray-400">
              By joining, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};
