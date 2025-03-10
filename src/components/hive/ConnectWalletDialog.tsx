
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConnectWalletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  onUsernameChange: (username: string) => void;
  onConnect: () => void;
  isLoading: boolean;
}

export const ConnectWalletDialog = ({
  isOpen,
  onOpenChange,
  username,
  onUsernameChange,
  onConnect,
  isLoading
}: ConnectWalletDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to Hive</DialogTitle>
          <DialogDescription>
            Enter your Hive username to connect with Hive Keychain
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="username"
              placeholder="Enter your Hive username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              disabled={isLoading}
              className="bg-background border-input"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline" 
            disabled={isLoading}
            className="border-input text-foreground"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConnect}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
