import React, { useState } from 'react';
import { useWalletContext } from '../contexts/WalletContext';

const AllowlistManager = () => {
  const { isConnected, connectWallet } = useWalletContext();
  const [allowlistName, setAllowlistName] = useState('');
  
  const handleCreateAllowlist = (e) => {
    e.preventDefault();
    alert(`Creating allowlist: ${allowlistName}`);
    setAllowlistName('');
  };

  if (!isConnected) {
    return (
      <div className="allowlist-manager">
        <div className="card">
          <h2>Allowlist Manager</h2>
          <p>Connect your wallet to manage your allowlists on Sui Testnet.</p>
          <button 
            className="btn primary"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="allowlist-manager">
      <div className="card">
        <h2>Admin View: Allowlist</h2>
        
        <div className="tabs">
          <button 
            className="tab active"
          >
            Create Allowlist
          </button>
          <button 
            className="tab"
          >
            View All Created Allowlists
          </button>
        </div>

        <div className="create-form">
          <form onSubmit={handleCreateAllowlist}>
            <div className="form-group">
              <input
                type="text"
                value={allowlistName}
                onChange={(e) => setAllowlistName(e.target.value)}
                placeholder="Enter allowlist name"
                className="input-field"
                required
              />
              <button 
                type="submit" 
                className="btn primary"
                disabled={!allowlistName.trim()}
              >
                Create Allowlist
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AllowlistManager;
