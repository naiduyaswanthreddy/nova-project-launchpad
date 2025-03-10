import { Button } from "@/components/ui/button";
import { Wallet, AlertCircle, ExternalLink } from "lucide-react";
import { getKeychainDownloadLink } from "@/utils/hive";
import { useHiveWallet } from "@/hooks/use-hive-wallet";
import { WalletMenu } from "./WalletMenu";
import { ConnectWalletDialog } from "./ConnectWalletDialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const WalletConnect = () => {
  const { toast } = useToast();
  const {
    username,
    setUsername,
    connected,
    connectedUser,
    isDialogOpen,
    setIsDialogOpen,
    isKeychainAvailable,
    isLoading,
    isRefreshing,
    accountInfo,
    handleConnect,
    handleDisconnect,
    fetchUserAccountInfo,
    initializeWallet
  } = useHiveWallet();

  // This effect will run when the component mounts on any page
  // ensuring the keychain availability is checked on every page
  useEffect(() => {
    // Force reinitialize wallet every time component is mounted
    // This ensures keychain is checked on every page load
    initializeWallet();
  }, [initializeWallet]);

  const openConnectDialog = () => {
    // Force a check for keychain before opening dialog
    const keychainAvailable = typeof window !== 'undefined' && window.hive_keychain !== undefined;
    
    if (!keychainAvailable) {
      const downloadLink = getKeychainDownloadLink();
      toast({
        title: "Hive Keychain not detected",
        description: (
          <div className="flex flex-col gap-2">
            <p>Please install the Hive Keychain browser extension to connect your wallet.</p>
            <a 
              href={downloadLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
            >
              Download Hive Keychain <ExternalLink size={14} />
            </a>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleRefreshBalance = () => {
    if (connectedUser) {
      fetchUserAccountInfo(connectedUser);
    }
  };

  return (
    <>
      {connected && connectedUser ? (
        <WalletMenu
          connectedUser={connectedUser}
          accountInfo={accountInfo}
          isRefreshing={isRefreshing}
          onRefresh={handleRefreshBalance}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={openConnectDialog}
          className="flex items-center gap-2 border-input text-foreground"
        >
          {!isKeychainAvailable ? (
            <AlertCircle size={16} className="text-yellow-500" />
          ) : (
            <Wallet size={16} className="text-foreground" />
          )}
          <span>Connect Wallet</span>
        </Button>
      )}

      <ConnectWalletDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        username={username}
        onUsernameChange={setUsername}
        onConnect={handleConnect}
        isLoading={isLoading}
      />
    </>
  );
};
