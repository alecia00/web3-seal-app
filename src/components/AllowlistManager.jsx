import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';

const AllowlistManager = () => {
  const { connected, connectWallet } = useWalletContext();
  
  const [viewMode, setViewMode] = useState('create');
  const [allowlistName, setAllowlistName] = useState('');
  const [allowlists, setAllowlists] = useState([]);
  const [selectedAllowlist, setSelectedAllowlist] = useState(null);
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load mock data when connected
  useEffect(() => {
    if (connected) {
      // Simulate loading allowlists
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
    }
  }, [connected]);

  const handleCreateAllowlist = (e) => {
    e.preventDefault();
    if (!allowlistName.trim()) return;
    
    setIsLoading(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      const newAllowlist = {
        id: "0x" + Math.random().toString(16).substring(2, 42),
        name: allowlistName,
        members: [],
        owner: "0xabcd...1234"
      };
      
      setAllowlists([...allowlists, newAllowlist]);
      setActionMessage('Allowlist created successfully!');
      setAllowlistName('');
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage(''), 3000);
    }, 1500);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberAddress.trim() || !selectedAllowlist) return;
    
    setIsLoading(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
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
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage(''), 3000);
    }, 1500);
  };

  const handleRemoveMember = (memberAddress) => {
    if (!selectedAllowlist) return;
    
    setIsLoading(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      const updatedAllowlists = allowlists.map(list => {
        if (list.id === selectedAllowlist.id) {
          return {
            ...list,
            members: list.members.filter(address => address !== memberAddress)
          };
        }
        return list;
      });
      
      setAllowlists(updatedAllowlists);
      setActionMessage('Member removed successfully!');
      
      // Update selected allowlist
      const updated = updatedAllowlists.find(al => al.id === selectedAllowlist.id);
      setSelectedAllowlist(updated);
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setActionMessage(''), 3000);
    }, 1500);
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
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="btn primary"
                  disabled={isLoading || !allowlistName.trim()}
                >
                  {isLoading ? 'Creating...' : 'Create Allowlist'}
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
                        disabled={isLoading}
                      />
                      <button 
                        type="submit" 
                        className="btn secondary"
                        disabled={isLoading || !newMemberAddress.trim()}
                      >
                        {isLoading ? 'Adding...' : 'Add Member'}
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
                            <button 
                              className="btn small danger"
                              onClick={() => handleRemoveMember(address)}
                              disabled={isLoading}
                            >
                              {isLoading ? '...' : 'Remove'}
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

export default AllowlistManager;
