
import { HiveAccount } from './types';

// Get stored account info from localStorage
export const getStoredAccountInfo = (): HiveAccount | null => {
  const data = localStorage.getItem('hiveAccount');
  return data ? JSON.parse(data) : null;
};

// Fetch account information using condenser_api.get_accounts
export const fetchAccountInfo = async (username: string): Promise<HiveAccount> => {
  try {
    const response = await fetch(`https://api.hive.blog/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'condenser_api.get_accounts',
        params: [[username]],
        id: 1
      })
    });

    const data = await response.json();
    
    if (data.result && data.result.length > 0) {
      const account = data.result[0];
      
      let profileImage = '';
      try {
        const metadata = JSON.parse(account.posting_json_metadata);
        profileImage = metadata?.profile?.profile_image || '';
      } catch (e) {
        // Ignore parsing errors
      }
      
      const accountInfo: HiveAccount = {
        name: account.name,
        balance: account.balance,
        hbd_balance: account.hbd_balance,
        vesting_shares: account.vesting_shares,
        reputation: account.reputation,
        profile_image: profileImage
      };
      
      localStorage.setItem('hiveAccount', JSON.stringify(accountInfo));
      
      return accountInfo;
    }
    throw new Error('Account not found');
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
};

// Check if a Hive username exists
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.hive.blog/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'condenser_api.get_accounts',
        params: [[username]],
        id: 1
      })
    });

    const data = await response.json();
    return data.result && data.result.length > 0;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};
