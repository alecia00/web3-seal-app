import React, { useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import ConnectWallet from './ConnectWallet';

const SubscriptionManager = () => {
  const { connected } = useWalletContext();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [subscriptionName, setSubscriptionName] = useState('');
  const [subscriptionFee, setSubscriptionFee] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleCreateSubscription = (e) => {
    e.preventDefault();
    if (!subscriptionName.trim() || !subscriptionFee.trim()) return;
    
    setIsLoading(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      setActionMessage('Subscription plan created successfully!');
      setSubscriptionName('');
      setSubscriptionFee('');
      setDurationDays('30');
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage(''), 3000);
    }, 1500);
  };

  if (!connected) {
    return (
      <div className="subscription-manager">
        <div className="card">
          <h2>Subscription Manager</h2>
          <p>Connect your wallet to create and manage subscription plans on Sui Testnet.</p>
          <button 
            className="btn primary"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
          
          {showWalletModal && (
            <ConnectWallet onClose={() => setShowWalletModal(false)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-manager">
      <div className="card">
        <h2>Create Subscription Plan</h2>
        
        {actionMessage && (
          <div className={`action-message ${actionMessage.includes('Error') ? 'error' : 'success'}`}>
            {actionMessage}
          </div>
        )}
        
        <div className="subscription-form">
          <form onSubmit={handleCreateSubscription}>
            <div className="form-group">
              <label htmlFor="subscription-name">Subscription Name</label>
              <input
                id="subscription-name"
                type="text"
                value={subscriptionName}
                onChange={(e) => setSubscriptionName(e.target.value)}
                placeholder="Enter subscription plan name"
                className="input-field"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subscription-fee">Subscription Fee (SUI)</label>
              <input
                id="subscription-fee"
                type="number"
                step="0.01"
                min="0"
                value={subscriptionFee}
                onChange={(e) => setSubscriptionFee(e.target.value)}
                placeholder="Enter fee amount in SUI"
                className="input-field"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="duration">Duration (Days)</label>
              <select
                id="duration"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="input-field"
                disabled={isLoading}
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn primary"
              disabled={isLoading || !subscriptionName.trim() || !subscriptionFee.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Subscription Plan'}
            </button>
          </form>
          
          <div className="coming-soon-notice">
            <h3>Coming Soon</h3>
            <p>
              Soon you'll be able to view all your subscription plans, manage subscribers,
              and track revenue directly from this dashboard. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
