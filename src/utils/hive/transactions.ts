
import { KeychainResponse } from './types';
import { isKeychainInstalled } from './auth';

// Send HIVE tokens to a recipient using hive_keychain.requestTransfer
export const sendHiveTokens = async (
  from: string,
  to: string,
  amount: string,
  memo: string = ''
): Promise<{ success: boolean; message: string; txId?: string }> => {
  if (!isKeychainInstalled()) {
    return { 
      success: false, 
      message: "Hive Keychain extension is not installed. Please install it to continue."
    };
  }

  return new Promise((resolve) => {
    // @ts-ignore - Hive Keychain is injected globally
    window.hive_keychain.requestTransfer(
      from,
      to,
      amount,
      memo,
      'HIVE',
      (response: KeychainResponse) => {
        if (response.success) {
          resolve({ 
            success: true, 
            message: `Successfully sent ${amount} HIVE to @${to}`,
            txId: response.result?.id || ''
          });
        } else {
          resolve({ 
            success: false, 
            message: response.error || "Failed to send HIVE"
          });
        }
      }
    );
  });
};

// Fetch recent transfers using account_history_api.get_account_history
export const fetchRecentTransfers = async (account: string, limit: number = 10): Promise<any[]> => {
  try {
    const response = await fetch(`https://api.hive.blog/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'account_history_api.get_account_history',
        params: { 
          account, 
          start: -1, 
          limit 
        },
        id: 1
      })
    });

    const data = await response.json();
    
    if (data.result && data.result.history) {
      const transfers = data.result.history
        .filter((item: any) => item[1].op[0] === 'transfer')
        .map((item: any) => {
          const [, { timestamp, trx_id, op }] = item;
          const [, { from, to, amount, memo }] = op;
          
          return {
            from,
            to,
            amount,
            memo,
            timestamp,
            transaction_id: trx_id
          };
        });
      
      return transfers;
    }
    return [];
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return [];
  }
};

// Get Hive blockchain explorer URL for a transaction
export const getHiveExplorerUrl = (txId: string): string => {
  return `https://hiveblocks.com/tx/${txId}`;
};

// Convert HIVE to USD (approximately)
export const convertHiveToUsd = async (hiveAmount: string): Promise<string> => {
  try {
    const amount = parseFloat(hiveAmount.replace(' HIVE', ''));
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd');
    const data = await response.json();
    
    if (data.hive && data.hive.usd) {
      const usdValue = amount * data.hive.usd;
      return `$${usdValue.toFixed(2)}`;
    }
    
    throw new Error('Could not fetch HIVE price');
  } catch (error) {
    console.error('Error converting HIVE to USD:', error);
    const amount = parseFloat(hiveAmount.replace(' HIVE', ''));
    return `~$${(amount * 0.20).toFixed(2)}`;
  }
};
