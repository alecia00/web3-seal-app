import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { encryptContent, decryptContent } from '../services/encryptionService';
import { fetchKeyShares, verifyAccess } from '../services/sealService';

// Create the context
const SealContext = createContext(null);

// Hook for using Seal context
export const useSeal = () => useContext(SealContext);

export const SealProvider = ({ children }) => {
  // Get wallet context
  const { walletAddress, isConnected, signMessage, executeTransaction } = useWallet();
  
  // State
  const [encryptedContents, setEncryptedContents] = useState([]);
  const [allowlists, setAllowlists] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadData();
    }
  }, [isConnected, walletAddress]);

  // Load data from localStorage and blockchain
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load encrypted contents
      const storedContents = localStorage.getItem(`seal_contents_${walletAddress}`);
      if (storedContents) {
        setEncryptedContents(JSON.parse(storedContents));
      }
      
      // Load allowlists - in a real app, this would query the blockchain
      // For demo purposes, we'll use localStorage
      const storedAllowlists = localStorage.getItem(`seal_allowlists_${walletAddress}`);
      if (storedAllowlists) {
        setAllowlists(JSON.parse(storedAllowlists));
      }
      
      // Load subscriptions - in a real app, this would query the blockchain
      // For demo purposes, we'll use localStorage
      const storedSubscriptions = localStorage.getItem(`seal_subscriptions_${walletAddress}`);
      if (storedSubscriptions) {
        setSubscriptions(JSON.parse(storedSubscriptions));
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Upload and encrypt content
  const uploadContent = async (file, metadata, accessType) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      // Read file as ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      
      // Encrypt content
      const { encryptedData, keyShares } = await encryptContent(fileBuffer);
      
      // Create content object
      const contentId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const content = {
        id: contentId,
        name: file.name,
        type: file.type,
        size: file.size,
        encryptedData,
        accessType,
        metadata,
        createdAt: Date.now(),
        creator: walletAddress,
      };
      
      // Store key shares - in a real app, these would be stored on separate servers
      // For demo purposes, we'll use localStorage
      localStorage.setItem(`seal_keyshare1_${contentId}`, JSON.stringify(keyShares[0]));
      localStorage.setItem(`seal_keyshare2_${contentId}`, JSON.stringify(keyShares[1]));
      
      // Update contents
      const updatedContents = [...encryptedContents, content];
      setEncryptedContents(updatedContents);
      localStorage.setItem(`seal_contents_${walletAddress}`, JSON.stringify(updatedContents));
      
      return contentId;
    } catch (err) {
      console.error('Error uploading content:', err);
      setError('Failed to upload content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Access content
  const accessContent = async (contentId) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      // Get content
      const content = encryptedContents.find(c => c.id === contentId);
      if (!content) {
        throw new Error('Content not found');
      }
      
      // Sign message to verify identity
      const message = `Access content ${contentId}`;
      const signature = await signMessage(message);
      
      // Verify access - in a real app, this would be done on the servers
      // For demo purposes, we'll do it locally
      let hasAccess = false;
      
      if (content.accessType === 'allowlist') {
        // Check if user is in allowlist
        const allowlist = allowlists.find(a => a.id === content.metadata.allowlistId);
        if (allowlist && allowlist.members.includes(walletAddress)) {
          hasAccess = true;
        }
      } else if (content.accessType === 'subscription') {
        // Check if user has active subscription
        const subscription = subscriptions.find(s => 
          s.serviceId === content.metadata.serviceId && 
          s.expiresAt > Date.now()
        );
        if (subscription) {
          hasAccess = true;
        }
      }
      
      if (!hasAccess) {
        throw new Error('Access denied');
      }
      
      // Get key shares - in a real app, these would be fetched from separate servers
      // For demo purposes, we'll use localStorage
      const keyShare1 = JSON.parse(localStorage.getItem(`seal_keyshare1_${contentId}`));
      const keyShare2 = JSON.parse(localStorage.getItem(`seal_keyshare2_${contentId}`));
      
      if (!keyShare1 || !keyShare2) {
        throw new Error('Key shares not found');
      }
      
      // Decrypt content
      const decryptedContent = await decryptContent(content.encryptedData, [keyShare1, keyShare2]);
      
      return decryptedContent;
    } catch (err) {
      console.error('Error accessing content:', err);
      setError('Failed to access content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create allowlist
  const createAllowlist = async (name, members = []) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      // Create allowlist object
      const allowlistId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const allowlist = {
        id: allowlistId,
        name,
        members: [...members, walletAddress], // Always include creator
        creator: walletAddress,
        createdAt: Date.now(),
      };
      
      // Update allowlists
      const updatedAllowlists = [...allowlists, allowlist];
      setAllowlists(updatedAllowlists);
      localStorage.setItem(`seal_allowlists_${walletAddress}`, JSON.stringify(updatedAllowlists));
      
      return allowlistId;
    } catch (err) {
      console.error('Error creating allowlist:', err);
      setError('Failed to create allowlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update allowlist
  const updateAllowlist = async (allowlistId, updatedMembers) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      // Find allowlist
      const allowlistIndex = allowlists.findIndex(a => a.id === allowlistId);
      if (allowlistIndex === -1) {
        throw new Error('Allowlist not found');
      }
      
      // Check if user is creator
      if (allowlists[allowlistIndex].creator !== walletAddress) {
        throw new Error('Only the creator can update the allowlist');
      }
      
      // Update allowlist
      const updatedAllowlists = [...allowlists];
      updatedAllowlists[allowlistIndex] = {
        ...updatedAllowlists[allowlistIndex],
        members: updatedMembers,
      };
      
      // Save changes
      setAllowlists(updatedAllowlists);
      localStorage.setItem(`seal_allowlists_${walletAddress}`, JSON.stringify(updatedAllowlists));
      
      return true;
    } catch (err) {
      console.error('Error updating allowlist:', err);
      setError('Failed to update allowlist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create subscription service
  const createSubscriptionService = async (name, price, duration) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      // Create service object
      const serviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const service = {
        id: serviceId,
        name,
        price,
        duration,
        creator: walletAddress,
        createdAt: Date.now(),
      };
      
      // Save service - in a real app, this would be stored on-chain
      // For demo purposes, we'll use localStorage
      const storedServices = localStorage.getItem(`seal_services_${walletAddress}`);
      const services = storedServices ? JSON.parse(storedServices) : [];
      const updatedServices = [...services, service];
      localStorage.setItem(`seal_services_${walletAddress}`, JSON.stringify(updatedServices));
      
      return serviceId;
    } catch (err) {
      console.error('Error creating subscription service:', err);
      setError('Failed to create subscription service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Purchase subscription
  const purchaseSubscription = async (serviceId) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      // Get service
      const storedServices = localStorage.getItem(`seal_services_${walletAddress}`);
      const services = storedServices ? JSON.parse(storedServices) : [];
      const service = services.find(s => s.id === serviceId);
      
      if (!service) {
        throw new Error('Service not found');
      }
      
      // Create subscription object
      const subscriptionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const subscription = {
        id: subscriptionId,
        serviceId,
        user: walletAddress,
        purchasedAt: Date.now(),
        expiresAt: Date.now() + (service.duration * 60 * 1000), // Convert minutes to ms
      };
      
      // Update subscriptions
      const updatedSubscriptions = [...subscriptions, subscription];
      setSubscriptions(updatedSubscriptions);
      localStorage.setItem(`seal_subscriptions_${walletAddress}`, JSON.stringify(updatedSubscriptions));
      
      return subscriptionId;
    } catch (err) {
      console.error('Error purchasing subscription:', err);
      setError('Failed to purchase subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided by the context
  const value = {
    encryptedContents,
    allowlists,
    subscriptions,
    loading,
    error,
    uploadContent,
    accessContent,
    createAllowlist,
    updateAllowlist,
    createSubscriptionService,
    purchaseSubscription,
  };
  
  return (
    <SealContext.Provider value={value}>
      {children}
    </SealContext.Provider>
  );
};
