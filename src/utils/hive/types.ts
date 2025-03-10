
export interface KeychainResponse {
  success: boolean;
  error?: string;
  result?: any;
}

export interface HiveAccount {
  name: string;
  balance: string;
  hbd_balance: string;
  vesting_shares: string;
  reputation: number;
  profile_image?: string;
}

export interface HiveProject {
  author: string;
  permlink: string;
  title: string;
  body: string;
  category: string;
  created: string;
  last_update: string;
  json_metadata: string;
  net_votes: number;
  children: number;
  payout: number;
}
