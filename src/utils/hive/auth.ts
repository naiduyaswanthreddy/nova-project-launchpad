
import { KeychainResponse, HiveAccount } from './types';
import { fetchAccountInfo } from './account';

// Check if Hive Keychain extension is installed
export const isKeychainInstalled = (): boolean => {
  return typeof window !== 'undefined' && 'hive_keychain' in window;
};

// Get Hive Keychain download link based on browser
export const getKeychainDownloadLink = (): string => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes("Chrome")) {
    return "https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep";
  } else if (userAgent.includes("Firefox")) {
    return "https://addons.mozilla.org/en-US/firefox/addon/hive-keychain/";
  } else if (userAgent.includes("Edge")) {
    return "https://microsoftedge.microsoft.com/addons/detail/hive-keychain/bfdapmceonidnlpjkcikejgkliccnjkp";
  } else {
    return "https://hive-keychain.com";
  }
};

// Connect to Hive Keychain and verify the user using requestSignBuffer
export const connectWithKeychain = async (username: string): Promise<{ success: boolean; message: string; account?: HiveAccount }> => {
  if (!isKeychainInstalled()) {
    return { 
      success: false, 
      message: "Hive Keychain extension is not installed. Please install it to continue."
    };
  }

  return new Promise((resolve) => {
    // @ts-ignore - Hive Keychain is injected globally
    window.hive_keychain.requestSignBuffer(
      username,
      `Login to CrowdHive at ${new Date().toISOString()}`,
      'Posting',
      async (response: KeychainResponse) => {
        if (response.success) {
          try {
            const account = await fetchAccountInfo(username);
            localStorage.setItem('hiveUsername', username);
            
            resolve({ 
              success: true, 
              message: `Successfully connected as @${username}`,
              account
            });
          } catch (error) {
            resolve({ 
              success: true, 
              message: `Connected as @${username}, but couldn't fetch account details.`
            });
          }
        } else {
          resolve({ 
            success: false, 
            message: response.error || "Failed to authenticate with Hive Keychain"
          });
        }
      }
    );
  });
};

// Disconnect from Hive Keychain
export const disconnectWallet = (): void => {
  localStorage.removeItem('hiveUsername');
  localStorage.removeItem('hiveAccount');
};

// Get connected username from localStorage
export const getConnectedUsername = (): string | null => {
  return localStorage.getItem('hiveUsername');
};
