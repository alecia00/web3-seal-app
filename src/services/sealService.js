/**
 * Fetches key shares from the key servers
 * 
 * In a real implementation, this would make API calls to separate servers
 * For this demo, we'll simulate it with localStorage
 * 
 * @param {string} contentId - ID of the content
 * @returns {Promise<Array<string>>} Array of key shares
 */
export const fetchKeyShares = async (contentId) => {
  try {
    // In a real implementation, fetch from separate servers
    // For demo purposes, we'll use localStorage
    const keyShare1 = localStorage.getItem(`seal_keyshare1_${contentId}`);
    const keyShare2 = localStorage.getItem(`seal_keyshare2_${contentId}`);
    
    if (!keyShare1 || !keyShare2) {
      throw new Error('Key shares not found');
    }
    
    return [JSON.parse(keyShare1), JSON.parse(keyShare2)];
  } catch (error) {
    console.error('Error fetching key shares:', error);
    throw new Error('Failed to fetch key shares');
  }
};

/**
 * Verifies user access to content
 * 
 * In a real implementation, this would be done by the key servers
 * For this demo, we'll simulate it with localStorage
 * 
 * @param {string} contentId - ID of the content
 * @param {string} walletAddress - User's wallet address
 * @param {Object} signature - Signature for verification
 * @param {string} accessType - Type of access (allowlist or subscription)
 * @param {Object} metadata - Additional metadata for verification
 * @returns {Promise<boolean>} Whether the user has access
 */
export const verifyAccess = async (
  contentId, 
  walletAddress, 
  signature, 
  accessType, 
  metadata
) => {
  try {
    // For demo purposes, we'll simulate verification
    // In a real implementation, this would be done by the key servers
    
    if (accessType === 'allowlist') {
      // Get allowlist
      const allowlistsString = localStorage.getItem(`seal_allowlists_${metadata.creator}`);
      if (!allowlistsString) {
        return false;
      }
      
      const allowlists = JSON.parse(allowlistsString);
      
      // Find the specific allowlist
      const allowlist = allowlists.find(a => a.id === metadata.allowlistId);
      if (!allowlist) {
        return false;
      }
      
      // Check if user is in allowlist
      return allowlist.members.includes(walletAddress);
    } else if (accessType === 'subscription') {
      // Get subscriptions
      const subscriptionsString = localStorage.getItem(`seal_subscriptions_${walletAddress}`);
      if (!subscriptionsString) {
        return false;
      }
      
      const subscriptions = JSON.parse(subscriptionsString);
      
      // Find active subscription for this service
      const subscription = subscriptions.find(s => 
        s.serviceId === metadata.serviceId && 
        s.expiresAt > Date.now()
      );
      
      return !!subscription;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying access:', error);
    throw new Error('Failed to verify access');
  }
};

/**
 * Verifies allowlist membership
 * 
 * @param {string} contentId - ID of the content
 * @param {string} walletAddress - User's wallet address
 * @param {Object} signature - Signature for verification
 * @param {string} allowlistId - ID of the allowlist
 * @returns {Promise<Array<string>>} Key shares if verification succeeds
 */
export const verifyAllowlist = async (
  contentId, 
  walletAddress, 
  signature, 
  allowlistId
) => {
  try {
    // Get content metadata
    const contentsString = localStorage.getItem(`seal_contents_${walletAddress}`);
    if (!contentsString) {
      throw new Error('Content not found');
    }
    
    const contents = JSON.parse(contentsString);
    const content = contents.find(c => c.id === contentId);
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    // Verify access
    const hasAccess = await verifyAccess(
      contentId, 
      walletAddress, 
      signature, 
      'allowlist', 
      { 
        allowlistId, 
        creator: content.creator 
      }
    );
    
    if (!hasAccess) {
      throw new Error('Access denied');
    }
    
    // Fetch key shares
    return await fetchKeyShares(contentId);
  } catch (error) {
    console.error('Error verifying allowlist:', error);
    throw new Error('Failed to verify allowlist membership');
  }
};

/**
 * Checks subscription validity
 * 
 * @param {string} contentId - ID of the content
 * @param {string} walletAddress - User's wallet address
 * @param {Object} signature - Signature for verification
 * @returns {Promise<Array<string>>} Key shares if verification succeeds
 */
export const checkSubscription = async (
  contentId, 
  walletAddress, 
  signature
) => {
  try {
    // Get content metadata
    const contentsString = localStorage.getItem(`seal_contents_${walletAddress}`);
    if (!contentsString) {
      throw new Error('Content not found');
    }
    
    const contents = JSON.parse(contentsString);
    const content = contents.find(c => c.id === contentId);
    
    if (!content) {
      throw new Error('Content not found');
    }
    
    // Verify access
    const hasAccess = await verifyAccess(
      contentId, 
      walletAddress, 
      signature, 
      'subscription', 
      { 
        serviceId: content.metadata.serviceId
      }
    );
    
    if (!hasAccess) {
      throw new Error('Access denied');
    }
    
    // Fetch key shares
    return await fetchKeyShares(contentId);
  } catch (error) {
    console.error('Error checking subscription:', error);
    throw new Error('Failed to verify subscription');
  }
};
