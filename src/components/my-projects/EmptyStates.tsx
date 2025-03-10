
import { AlertCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NotConnectedProps {
  onNavigateHome: () => void;
}

export const NotConnectedState = ({ onNavigateHome }: NotConnectedProps) => (
  <div className="text-center py-20">
    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
    <h3 className="text-2xl font-semibold mb-2">Connect Your Wallet</h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">
      Please connect your Hive wallet to view your projects, drafts, and contributions.
    </p>
    <Button
      onClick={onNavigateHome}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
    >
      Go to Home
    </Button>
  </div>
);

interface EmptyProjectsProps {
  onCreateProject: () => void;
  type: "created" | "drafts" | "contributed";
}

export const EmptyProjectsState = ({ onCreateProject, type }: EmptyProjectsProps) => {
  const navigate = useNavigate();
  
  const content = {
    created: {
      title: "You haven't created any projects yet",
      description: "Start a new project today and share your ideas with the Hive community!",
      buttonText: "Create New Project",
      buttonAction: onCreateProject,
      buttonIcon: <PlusCircle className="mr-2 h-4 w-4" />
    },
    drafts: {
      title: "No Drafts Found",
      description: "You don't have any saved drafts. Start creating a project and save it as a draft to continue later.",
      buttonText: "Create New Project",
      buttonAction: onCreateProject,
      buttonIcon: <PlusCircle className="mr-2 h-4 w-4" />
    },
    contributed: {
      title: "No Contributions Yet",
      description: "You haven't contributed to any projects yet. Explore projects and support creators!",
      buttonText: "Explore Projects",
      buttonAction: () => navigate('/projects'),
      buttonIcon: null
    }
  };
  
  const { title, description, buttonText, buttonAction, buttonIcon } = content[type];
  
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      <Button
        onClick={buttonAction}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        {buttonIcon}
        {buttonText}
      </Button>
    </div>
  );
};
