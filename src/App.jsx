import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Simplified Header component with wallet connection button
const Header = () => {
  const location = useLocation();
  const [connected, setConnected] = React.useState(false);
  const [address, setAddress] = React.useState('');

  const connectWallet = () => {
    const mockAddress = "0x" + Math.random().toString(16).substring(2, 12);
    setAddress(mockAddress);
    setConnected(true);
  };

  const disconnectWallet = () => {
    setAddress('');
    setConnected(false);
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>Sui Seal Protocol</h1>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li className={location.pathname === '/allowlist' ? 'active' : ''}>
                <Link to="/allowlist">Allowlist</Link>
              </li>
              <li className={location.pathname === '/subscription' ? 'active' : ''}>
                <Link to="/subscription">Subscription</Link>
              </li>
              <li>
                <a 
                  href="https://faucet.sui.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="faucet-link"
                >
                  Faucet
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="wallet-section">
            {connected ? (
              <div className="wallet-info">
                <span className="wallet-address">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button 
                  className="btn disconnect"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="btn connect"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Homepage Component
const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Decentralized Access Control</h1>
          <p>Create, manage, and monetize content with blockchain-powered access control on Sui Testnet</p>
        </div>
      </section>

      <section className="features">
        <div className="feature-cards">
          <div className="card feature-card">
            <h2>Allowlist System</h2>
            <p>Create allowlists to control who can access your encrypted content based on wallet addresses. You maintain complete control over who can view your protected files.</p>
            <div className="feature-actions">
              <Link to="/allowlist" className="btn secondary">
                Manage Allowlists
              </Link>
            </div>
          </div>

          <div className="card feature-card">
            <h2>Subscription Service</h2>
            <p>Define subscription-based access to your published content. Set subscription fees and duration, and monetize your content with NFT subscriptions on Sui.</p>
            <div className="feature-actions">
              <Link to="/subscription" className="btn secondary">
                Manage Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Allowlist Manager Component
const AllowlistManager = () => {
  const [connected, setConnected] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('create');
  const [allowlistName, setAllowlistName] = React.useState('');
  const [allowlists, setAllowlists] = React.useState([]);
  const [selectedAllowlist, setSelectedAllowlist] = React.useState(null);
  const [newMemberAddress, setNewMemberAddress] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState('');

  React.useEffect(() => {
    // Simulate connected state
    setConnected(true);
    // Simulate fetching allowlists
    setAllowlists([
      {
        id: "0x1234567890abcdef1234567890abcdef12345678",
        name: "Premium Content",
        members: ["0x1234...5678", "0x8765...4321"],
        owner: "0xabcd...1234"
      },
      {
        id: "0xabcdef1234567890abcdef1234567890abcdef12",
        name: "VIP Access",
        members: [],
        owner: "0xabcd...1234"
      }
    ]);
  }, []);

  const handleCreateAllowlist = (e) => {
    e.preventDefault();
    if (!allowlistName.trim()) return;
    
    // Simulate allowlist creation
    const newAllowlist = {
      id: "0x" + Math.random().toString(16).substring(2, 42),
      name: allowlistName,
      members: [],
      owner: "0xabcd...1234"
    };
    
    setAllowlists([...allowlists, newAllowlist]);
    setActionMessage('Allowlist created successfully!');
    setAllowlistName('');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setActionMessage('');
    }, 3000);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberAddress.trim() || !selectedAllowlist) return;
    
    // Update the selected allowlist with the new member
    const updatedAllowlists = allowlists.map(list => {
      if (list.id === selectedAllowlist.id) {
        return {
          ...list,
          members: [...list.members, newMemberAddress]
        };
      }
      return list;
    });
    
    setAllowlists(updatedAllowlists);
    setActionMessage('Member added successfully!');
    setNewMemberAddress('');
    
    // Update selected allowlist
    const updated = updatedAllowlists.find(al => al.id === selectedAllowlist.id);
    setSelectedAllowlist(updated);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setActionMessage('');
    }, 3000);
  };

  const handleSelectAllowlist = (allowlist) => {
    setSelectedAllowlist(allowlist);
  };

  if (!connected) {
    return (
      <div className="allowlist-manager">
        <div className="card">
          <h2>Allowlist Manager</h2>
          <p>Connect your wallet to manage your allowlists on Sui Testnet.</p>
          <button className="btn primary">Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="allowlist-manager">
      <div className="card">
        <h2>Admin View: Allowlist</h2>
        
        {actionMessage && (
          <div className={`action-message ${actionMessage.includes('Error') ? 'error' : 'success'}`}>
            {actionMessage}
          </div>
        )}
        
        <div className="tabs">
          <button 
            className={`tab ${viewMode === 'create' ? 'active' : ''}`}
            onClick={() => setViewMode('create')}
          >
            Create Allowlist
          </button>
          <button 
            className={`tab ${viewMode === 'view' ? 'active' : ''}`}
            onClick={() => setViewMode('view')}
          >
            View All Created Allowlists
          </button>
        </div>

        {viewMode === 'create' && (
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
        )}

        {viewMode === 'view' && (
          <div className="allowlists-container">
            <div className="allowlists-list">
              {allowlists.length > 0 ? (
                <ul className="allowlist-items">
                  {allowlists.map((list) => (
                    <li 
                      key={list.id} 
                      className={`allowlist-item ${selectedAllowlist?.id === list.id ? 'selected' : ''}`}
                      onClick={() => handleSelectAllowlist(list)}
                    >
                      <div className="allowlist-header">
                        <h3>{list.name}</h3>
                        <span className="member-count">
                          {list.members.length} members
                        </span>
                      </div>
                      <div className="allowlist-id">
                        ID: {list.id.substring(0, 8)}...{list.id.substring(list.id.length - 4)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">No allowlists found. Create one to get started!</p>
              )}
            </div>
            
            {selectedAllowlist && (
              <div className="allowlist-details">
                <h3>Manage {selectedAllowlist.name}</h3>
                
                <div className="member-management">
                  <form onSubmit={handleAddMember}>
                    <div className="form-group">
                      <input
                        type="text"
                        value={newMemberAddress}
                        onChange={(e) => setNewMemberAddress(e.target.value)}
                        placeholder="Enter wallet address to add"
                        className="input-field"
                        required
                      />
                      <button 
                        type="submit" 
                        className="btn secondary"
                        disabled={!newMemberAddress.trim()}
                      >
                        Add Member
                      </button>
                    </div>
                  </form>
                  
                  <div className="members-list">
                    <h4>Current Members</h4>
                    {selectedAllowlist.members.length > 0 ? (
                      <ul>
                        {selectedAllowlist.members.map((address, index) => (
                          <li key={index} className="member-item">
                            <span className="member-address">{address}</span>
                            <button className="btn small danger">
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-state">No members in this allowlist yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Subscription Manager Component
const SubscriptionManager = () => {
  return (
    <div className="subscription-manager">
      <div className="card">
        <h2>Subscription Manager</h2>
        <p>
          Create and manage subscription-based access to your content. 
          Set subscription fees and durations to monetize your content with NFT subscriptions.
        </p>
        
        <div className="subscription-form">
          <h3>Create New Subscription</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="subscriptionName">Subscription Name</label>
              <input
                id="subscriptionName"
                type="text"
                placeholder="Premium Content Access"
                className="input-field"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subscriptionFee">Subscription Fee (SUI)</label>
              <input
                id="subscriptionFee"
                type="number"
                min="0.001"
                step="0.001"
                placeholder="0.1"
                className="input-field"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subscriptionDuration">Duration (days)</label>
              <select
                id="subscriptionDuration"
                className="input-field"
                required
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">365 days</option>
              </select>
            </div>
            
            <button type="submit" className="btn primary">
              Create Subscription
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

// Footer Component
const Footer = () => (
  <footer className="app-footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-info">
          <p>Built on Sui Testnet</p>
        </div>
        
        <div className="creator-info">
          <p>
            Created by <a 
              href="https://t.me/extrajossbos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="creator-link"
            >
              techzs
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/allowlist" element={<AllowlistManager />} />
              <Route path="/subscription" element={<SubscriptionManager />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
