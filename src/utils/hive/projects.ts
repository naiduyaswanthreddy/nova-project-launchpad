
import { HiveProject } from './types';
import { isKeychainInstalled } from './auth';
import { KeychainResponse } from './types';

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
      return data.result.filter((post: any) => {
        try {
          const metadata = JSON.parse(post.json_metadata);
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
  
  const permlink = `${title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}-${Date.now()}`;
  
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
    
    const pendingPayout = parseFloat(post.pending_payout_value.split(' ')[0]);
    const fundingGoal = projectData.fundingGoal || 100;
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
      contributors: [],
    };
  } catch (error) {
    console.error('Error formatting post to project:', error);
    return null;
  }
};
