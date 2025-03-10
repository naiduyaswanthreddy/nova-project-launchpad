
import { Skeleton } from "@/components/ui/skeleton";

interface WalletBalancesProps {
  accountInfo: any;
  isRefreshing: boolean;
}

export const WalletBalances = ({ accountInfo, isRefreshing }: WalletBalancesProps) => {
  if (isRefreshing) {
    return <Skeleton className="h-3 w-14" />;
  }

  if (!accountInfo) {
    return null;
  }

  return (
    <div className="flex flex-col items-start w-full space-y-0.5">
      <span className="text-xs font-medium text-foreground truncate max-w-full">
        {accountInfo.balance}
      </span>
      {accountInfo.hbd_balance && (
        <span className="text-xs text-muted-foreground truncate max-w-full">
          {accountInfo.hbd_balance}
        </span>
      )}
    </div>
  );
}
