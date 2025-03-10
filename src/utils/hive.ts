interface KeychainResponse {
  success: boolean;
  error?: string;
  result?: any;
}

interface HiveAccount {
  name: string;
  balance: string;
  hbd_balance: string;
  vesting_shares: string;
  reputation: number;
  profile_image?: string;
}

interface HiveProject {
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

// Check if Hive Keychain extension is installed
export const isKeychainInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.hive_keychain !== undefined;
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
            // Get account information from Hive blockchain
            const account = await fetchAccountInfo(username);
            
            // Store user info in localStorage
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
      
      // Try to get profile image from posting_json_metadata if available
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
      
      // Store account info in localStorage for quick access
      localStorage.setItem('hiveAccount', JSON.stringify(accountInfo));
      
      return accountInfo;
    }
    throw new Error('Account not found');
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
};

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

// Fetch latest projects using bridge.get_ranked_posts
export const fetchLatestProjects = async (
  tag: string = 'crowdhive',
  sort: string = 'created', 
  limit: number = 20, 
  observer: string = ''
): Promise<HiveProject[]> => {
  try {
    const response = await fetch('https://api.hive.blog/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'bridge.get_ranked_posts',
        params: { 
          tag, 
          sort, 
          limit, 
          observer
        },
        id: 1
      })
    });
    
    const data = await response.json();
    
    if (data.result) {
      // Filter and transform the posts to match our project structure
      return data.result.filter((post: any) => {
        try {
          const metadata = JSON.parse(post.json_metadata);
          // Only include posts with the crowdhive app tag and project type
          return metadata.app?.includes('crowdhive') && metadata.tags?.includes('crowdhive-project');
        } catch (e) {
          return false;
        }
      }).map((post: any) => {
        let projectData: any = {};
        try {
          const metadata = JSON.parse(post.json_metadata);
          projectData = metadata.project || {};
        } catch (e) {
          // Ignore parsing errors
        }
        
        return {
          author: post.author,
          permlink: post.permlink,
          title: post.title,
          body: post.body,
          category: projectData.category || 'Uncategorized',
          created: post.created,
          last_update: post.last_update,
          json_metadata: post.json_metadata,
          net_votes: post.net_votes,
          children: post.children,
          payout: parseFloat(post.pending_payout_value.split(' ')[0])
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Post a new project using broadcast.comment
export const postProject = async (
  username: string,
  title: string,
  body: string,
  category: string,
  fundingGoal: number,
  coverImage: string | null,
  socialLinks: any,
  parentAuthor: string = '',
  parentPermlink: string = 'crowdhive'
): Promise<{ success: boolean; message: string; permlink?: string }> => {
  if (!isKeychainInstalled()) {
    return { 
      success: false, 
      message: "Hive Keychain extension is not installed. Please install it to continue."
    };
  }
  
  // Create a permlink from the title
  const permlink = `${title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}-${Date.now()}`;
  
  // Build JSON metadata for the project
  const jsonMetadata = {
    app: 'crowdhive/1.0.0',
    tags: ['crowdhive', 'crowdhive-project', category.toLowerCase()],
    project: {
      type: 'project',
      category,
      fundingGoal,
      coverImage,
      socialLinks,
      version: '1.0.0'
    },
    format: 'markdown'
  };
  
  return new Promise((resolve) => {
    // @ts-ignore - Hive Keychain is injected globally
    window.hive_keychain.requestPost(
      username,
      title,
      body,
      parentAuthor,
      parentPermlink,
      permlink,
      JSON.stringify(jsonMetadata),
      '',
      'Posting',
      (response: KeychainResponse) => {
        if (response.success) {
          resolve({ 
            success: true, 
            message: 'Project successfully posted to Hive Blockchain',
            permlink
          });
        } else {
          resolve({ 
            success: false, 
            message: response.error || 'Failed to post project to Hive Blockchain'
          });
        }
      }
    );
  });
};

// Fetch project details by author and permlink
export const fetchProjectDetails = async (author: string, permlink: string): Promise<HiveProject | null> => {
  try {
    const response = await fetch('https://api.hive.blog/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'condenser_api.get_content',
        params: [author, permlink],
        id: 1
      })
    });
    
    const data = await response.json();
    
    if (data.result && data.result.author) {
      const post = data.result;
      let projectData: any = {};
      
      try {
        const metadata = JSON.parse(post.json_metadata);
        projectData = metadata.project || {};
      } catch (e) {
        // Ignore parsing errors
      }
      
      return {
        author: post.author,
        permlink: post.permlink,
        title: post.title,
        body: post.body,
        category: projectData.category || 'Uncategorized',
        created: post.created,
        last_update: post.last_update,
        json_metadata: post.json_metadata,
        net_votes: post.net_votes,
        children: post.children,
        payout: parseFloat(post.pending_payout_value.split(' ')[0])
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
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
      // Filter only transfer operations
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

// Convert HIVE to USD (approximately)
export const convertHiveToUsd = async (hiveAmount: string): Promise<string> => {
  try {
    // Remove 'HIVE' from the amount string if present
    const amount = parseFloat(hiveAmount.replace(' HIVE', ''));
    
    // Fetch current HIVE price from CoinGecko
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd');
    const data = await response.json();
    
    if (data.hive && data.hive.usd) {
      const usdValue = amount * data.hive.usd;
      return `$${usdValue.toFixed(2)}`;
    }
    
    throw new Error('Could not fetch HIVE price');
  } catch (error) {
    console.error('Error converting HIVE to USD:', error);
    // Fallback to an estimated value of $0.20 per HIVE
    const amount = parseFloat(hiveAmount.replace(' HIVE', ''));
    return `~$${(amount * 0.20).toFixed(2)}`;
  }
};

// Format a post to a project object for the frontend
export const formatPostToProject = (post: any) => {
  try {
    let projectData: any = {};
    let metadata: any = {};
    
    try {
      metadata = JSON.parse(post.json_metadata);
      projectData = metadata.project || {};
    } catch (e) {
      // Ignore parsing errors
    }
    
    // Calculate funding progress based on votes and payout
    const pendingPayout = parseFloat(post.pending_payout_value.split(' ')[0]);
    const fundingGoal = projectData.fundingGoal || 100; // Default if not specified
    const progress = Math.min(Math.round((pendingPayout / fundingGoal) * 100), 100);
    
    return {
      id: `${post.author}-${post.permlink}`,
      title: post.title,
      creator: post.author,
      description: post.body,
      image: projectData.coverImage || "https://placehold.co/600x400/3a206e/e8b4b6?text=Project+Image",
      category: projectData.category || "Uncategorized",
      target: `${fundingGoal} HIVE`,
      raised: `${pendingPayout.toFixed(3)} HIVE`,
      progress: progress,
      created_at: post.created,
      status: 'active',
      contributors: [], // We'll fetch contributors separately if needed
    };
  } catch (error) {
    console.error('Error formatting post to project:', error);
    return null;
  }
};
