
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl?: string;
  onAction?: () => void;
}

export function AuthRequiredDialog({ isOpen, onClose, title, description, actionLabel, actionUrl, onAction }: AuthDialogProps) {
  const handleAction = () => {
    if (actionUrl) {
      window.open(actionUrl, "_blank");
    } else if (onAction) {
      onAction();
    }
    
    // If neither is provided, just close
    if (!actionUrl && !onAction) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{title}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <AlertCircle className="h-16 w-16 text-yellow-500" />
          <p className="text-center text-gray-300">
            {description}
          </p>
          <Button 
            onClick={handleAction}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
