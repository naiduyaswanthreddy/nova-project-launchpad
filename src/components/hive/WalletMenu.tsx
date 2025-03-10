
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, RefreshCw } from "lucide-react";
import { WalletBalances } from "./WalletBalances";

interface WalletMenuProps {
  connectedUser: string;
  accountInfo: any;
  isRefreshing: boolean;
  onRefresh: () => void;
  onDisconnect: () => void;
}

export const WalletMenu = ({ 
  connectedUser, 
  accountInfo, 
  isRefreshing,
  onRefresh,
  onDisconnect 
}: WalletMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 border-input text-foreground min-w-[160px] h-auto py-2">
          {isRefreshing ? (
            <RefreshCw size={16} className="animate-spin text-foreground shrink-0" />
          ) : (
            <Wallet size={16} className="text-foreground shrink-0" />
          )}
          <div className="flex flex-col items-start w-full truncate">
            <span className="text-xs text-foreground truncate max-w-full">@{connectedUser}</span>
            <WalletBalances accountInfo={accountInfo} isRefreshing={isRefreshing} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Hive Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {accountInfo && (
          <>
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">HIVE:</span>
                <span className="font-medium text-foreground">{accountInfo.balance}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">HBD:</span>
                <span className="font-medium text-foreground">{accountInfo.hbd_balance}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={onRefresh} className="cursor-pointer">
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Refresh Balance</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onDisconnect}
          className="text-red-500 focus:text-red-500 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
