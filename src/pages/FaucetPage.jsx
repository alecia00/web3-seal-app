import React, { useState, useContext, useEffect } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import '../styles/faucet.css';

const FaucetPage = () => {
  const { isConnected, walletAddress, connectWallet } = useContext(WalletContext);
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, success, error
  const [returnTokensAddress, setReturnTokensAddress] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [inputAddress, setInputAddress] = useState('');

  // Update input address when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      setInputAddress(walletAddress);
    }
  }, [isConnected, walletAddress]);

  const handleRequestTokens = async () => {
    if (!inputAddress.trim()) {
      alert('Please enter a wallet address or connect your wallet.');
      return;
    }
    
    setRequestStatus('loading');
    
    // Simulasi request token
    setTimeout(() => {
      // 90% chance of success
      if (Math.random() > 0.1) {
        setRequestStatus('success');
      } else {
        setRequestStatus('error');
      }
    }, 1500);
  };
  
  const handleReturnTokens = async () => {
    if (!returnTokensAddress.trim()) {
      alert('Please enter an address to return tokens to.');
      return;
    }
    
    // Simulasi return token
    alert(`Tokens would be returned to: ${returnTokensAddress}`);
  };
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(returnTokensAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  return (
    <div className="faucet-container">
      <div className="faucet-header">
        <div className="faucet-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 14.5L12 12M12 12L14.5 9.5M12 12L9.5 9.5M12 12L14.5 14.5" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1>Testnet Token Request</h1>
      </div>
      
      <div className="network-selector">
        <span className="network-label">Network:</span>
        <div className="network-dropdown">
          <span className="selected-network">Testnet</span>
          <span className="dropdown-arrow">▼</span>
        </div>
        
        {!isConnected && (
          <button 
            className="header-connect-wallet"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
      
      <div className="request-section">
        <div className="input-group">
          <label htmlFor="wallet-address">Your Wallet Address</label>
          <input 
            type="text"
            id="wallet-address"
            placeholder="Enter your wallet address (0x...)"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
        </div>
        
        {requestStatus === 'success' && (
          <div className="success-message">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Success!</span>
          </div>
        )}
        
        <button 
          className={`request-button ${requestStatus === 'loading' ? 'loading' : ''}`}
          onClick={handleRequestTokens}
          disabled={requestStatus === 'loading'}
        >
          {requestStatus === 'loading' ? (
            <>
              <span className="spinner"></span>
              Requesting...
            </>
          ) : 'Request Testnet SUI'}
        </button>
      </div>
      
      <div className="return-section">
        <h2>Unused Testnet SUI?</h2>
        <p>Return your unused tokens to help other developers!</p>
        
        <div className="return-input-group">
          <label>Return tokens to address:</label>
          <div className="return-input-with-button">
            <input 
              type="text"
              value={returnTokensAddress || '0x7a9d19d4c21066392eeb549da59a54e25777ef631616fccda08277b58b4212e'}
              onChange={(e) => setReturnTokensAddress(e.target.value)}
              readOnly={!returnTokensAddress}
            />
            <button 
              className="copy-button"
              onClick={handleCopyAddress}
            >
              {copySuccess ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaucetPage;