/**
 * API service for interacting with key servers
 * 
 * In a production environment, these would be actual API calls to separate servers.
 * For this demo, we'll simulate the API with localStorage.
 */

const BASE_URL_SERVER1 = 'https://keyserver1.seal.example.com';
const BASE_URL_SERVER2 = 'https://keyserver2.seal.example.com';

/**
 * Simulated API call to upload key share to server 1
 * 
 * @param {string} contentId - ID of the content
 * @param {string} keyShare - Key share to upload
 * @param {string} accessType - Type of access (allowlist or subscription)
 * @param {Object} metadata - Additional metadata for access control
 * @returns {Promise<boolean>} Success status
 */
export const uploadKeyShare1 = async (contentId, keyShare, accessType, metadata) => {
  // In a real app, this would be an actual API call
  // For demo purposes, we'll use localStorage
  localStorage.setItem(`seal_keyshare1_${contentId}`, JSON.stringify({
    keyShare,
    accessType,
    metadata
  }));
  
  return true;
};

/**
 * Simulated API call to upload key share to server 2
 * 
 * @param {string} contentId - ID of the content
 * @param {string} keyShare - Key share to upload
 * @param {string} accessType - Type of access (allowlist or subscription)
 * @param {Object} metadata - Additional metadata for access control
 * @returns {Promise<boolean>} Success status
 */
export const uploadKeyShare2 = async (contentId, keyShare, accessType, metadata) => {
  // In a real app, this would be an actual API call
  // For demo purposes, we'll use localStorage
  localStorage.setItem(`seal_keyshare2_${contentId}`, JSON.stringify({
    keyShare,
    accessType,
    metadata
  }));
  
  return true;
};

/**
 * Simulated API call to fetch key share from server 1
 * 
 * @param {string} contentId - ID of the content
 * @param {string} walletAddress - User's wallet address
 * @param {Object} signature - Signature for verification
 * @returns {Promise<string>} Key share
 */
export const fetchKeyShare1 = async (contentId, walletAddress, signature) => {
  // In a real app, this would be an actual API call with verification
  // For demo purposes, we'll use localStorage and perform simple verification
  
  const storedData = localStorage.getItem(`seal_keyshare1_${contentId}`);
  if (!storedData) {
    throw new Error('Key share not found');
  }
  
  const { keyShare, accessType, metadata } = JSON.parse(storedData);
  
  // Verify access based on access type
  let hasAccess = false;
  
  if (accessType === 'allowlist') {
    // Check allowlist membership
    const allowlistsString = localStorage.getItem(`seal_allowlists_${metadata.creator}`);
    if (allowlistsString) {
      const allowlists = JSON.parse(allowlistsString);
      const allowlist = allowlists.find(a => a.id === metadata.allowlistId);
      
      if (allowlist && allowlist.members.includes(walletAddress)) {
        hasAccess = true;
      }
    }
  } else if (accessType === 'subscription') {
    // Check subscription validity
    const subscriptionsString = localStorage.getItem(`seal_subscriptions_${walletAddress}`);
    if (subscriptionsString) {
      const subscriptions = JSON.parse(subscriptionsString);
      const subscription = subscriptions.find(s => 
        s.serviceId === metadata.serviceId && 
        s.expiresAt > Date.now()
      );
      
      if (subscription) {
        hasAccess = true;
      }
    }
  }
  
  if (!hasAccess) {
    throw new Error('Access denied');
  }
  
  return keyShare;
};

/**
 * Simulated API call to fetch key share from server 2
 * 
 * @param {string} contentId - ID of the content
 * @param {string} walletAddress - User's wallet address
 * @param {Object} signature - Signature for verification
 * @returns {Promise<string>} Key share
 */
export const fetchKeyShare2 = async (contentId, walletAddress, signature) => {
  // In a real app, this would be an actual API call with verification
  // For demo purposes, we'll use localStorage and perform simple verification
  
  const storedData = localStorage.getItem(`seal_keyshare2_${contentId}`);
  if (!storedData) {
    throw new Error('Key share not found');
  }
  
  const { keyShare, accessType, metadata } = JSON.parse(storedData);
  
  // Verify access based on access type
  let hasAccess = false;
  
  if (accessType === 'allowlist') {
    // Check allowlist membership
    const allowlistsString = localStorage.getItem(`seal_allowlists_${metadata.creator}`);
    if (allowlistsString) {
      const allowlists = JSON.parse(allowlistsString);
      const allowlist = allowlists.find(a => a.id === metadata.allowlistId);
      
      if (allowlist && allowlist.members.includes(walletAddress)) {
        hasAccess = true;
      }
    }
  } else if (accessType === 'subscription') {
    // Check subscription validity
    const subscriptionsString = localStorage.getItem(`seal_subscriptions_${walletAddress}`);
    if (subscriptionsString) {
      const subscriptions = JSON.parse(subscriptionsString);
      const subscription = subscriptions.find(s => 
        s.serviceId === metadata.serviceId && 
        s.expiresAt > Date.now()
      );
      
      if (subscription) {
        hasAccess = true;
      }
    }
  }
  
  if (!hasAccess) {
    throw new Error('Access denied');
  }
  
  return keyShare;
};

/**
 * Simulated API call to verify allowlist membership
 * 
 * @param {string} allowlistId - ID of the allowlist
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<boolean>} Membership status
 */
export const verifyAllowlistMembership = async (allowlistId, walletAddress) => {
  // In a real app, this would be an actual API call or blockchain query
  // For demo purposes, we'll use localStorage
  
  const allKeys = Object.keys(localStorage);
  const allowlistKeys = allKeys.filter(key => key.startsWith('seal_allowlists_'));
  
  for (const key of allowlistKeys) {
    const allowlists = JSON.parse(localStorage.getItem(key) || '[]');
    const allowlist = allowlists.find(a => a.id === allowlistId);
    
    if (allowlist && allowlist.members.includes(walletAddress)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Simulated API call to verify subscription validity
 * 
 * @param {string} serviceId - ID of the service
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<boolean>} Subscription validity
 */
export const verifySubscription = async (serviceId, walletAddress) => {
  // In a real app, this would be an actual API call or blockchain query
  // For demo purposes, we'll use localStorage
  
  const subscriptionsString = localStorage.getItem(`seal_subscriptions_${walletAddress}`);
  if (!subscriptionsString) {
    return false;
  }
  
  const subscriptions = JSON.parse(subscriptionsString);
  const subscription = subscriptions.find(s => 
    s.serviceId === serviceId && 
    s.expiresAt > Date.now()
  );
  
  return !!subscription;
};
