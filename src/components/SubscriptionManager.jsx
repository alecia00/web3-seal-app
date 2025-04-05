import React, { useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';

const SubscriptionManager = () => {
  const { connected, connectWallet, isLoading: walletLoading } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [subscriptionName, setSubscriptionName] = useState('');
  const [subscriptionFee, setSubscriptionFee] = useState('');
  const [subscriptionDuration, setSubscriptionDuration] = useState('30');
  const [actionMessage, setActionMessage] = useState('');

  const handleCreateSubscription = (e) => {
    e.preventDefault();
    if (!subscriptionName || !subscriptionFee) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setActionMessage(`Subscription "${subscriptionName}" created successfully!`);
      setSubscriptionName('');
      setSubscriptionFee('');
      setSubscriptionDuration('30');
      setLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setActionMessage('');
      }, 3000);
    }, 1500);
  };
  
  if (!connected) {
    return (
      <div className="subscription-manager">
        <div className="card">
          <h2>Subscription Manager</h2>
          <p>Connect your wallet to manage subscriptions on Sui Testnet.</p>
          <button 
            className="btn primary"
            onClick={connectWallet}
            disabled={walletLoading}
          >
            {walletLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-manager">
      <div className="card">
        <h2>Subscription Manager</h2>
        <p>
          Create and manage subscription-based access to your content. 
          Set subscription fees and durations to monetize your content with NFT subscriptions.
        </p>
        
        {actionMessage && (
          <div className="action-message success">
            {actionMessage}
          </div>
        )}
        
        <div className="subscription-form">
          <h3>Create New Subscription</h3>
          <form onSubmit={handleCreateSubscription}>
            <div className="form-group">
              <label htmlFor="subscriptionName">Subscription Name</label>
              <input
                id="subscriptionName"
                type="text"
                value={subscriptionName}
                onChange={(e) => setSubscriptionName(e.target.value)}
                placeholder="Premium Content Access"
                className="input-field"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subscriptionFee">Subscription Fee (SUI)</label>
              <input
                id="subscriptionFee"
                type="number"
                min="0.001"
                step="0.001"
                value={subscriptionFee}
                onChange={(e) => setSubscriptionFee(e.target.value)}
                placeholder="0.1"
                className="input-field"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subscriptionDuration">Duration (days)</label>
              <select
                id="subscriptionDuration"
                value={subscriptionDuration}
                onChange={(e) => setSubscriptionDuration(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">365 days</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn primary" 
              disabled={loading || !subscriptionName || !subscriptionFee}
            >
              {loading ? 'Creating...' : 'Create Subscription'}
            </button>
          </form>
          
          <div className="coming-soon-notice">
            <p><strong>Note:</strong> This feature is currently under development. Full subscription functionality will be available soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
