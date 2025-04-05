import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { useSealContext } from '../contexts/SealContext';

const AllowlistManager = () => {
  const { address, isConnected, connectWallet } = useWalletContext();
  const { 
    createAllowlist, 
    fetchAllowlists, 
    allowlists, 
    loading, 
    error,
    transactionInProgress,
    addMemberToAllowlist,
    removeMemberFromAllowlist
  } = useSealContext();
  
  const [allowlistName, setAllowlistName] = useState('');
  const [viewMode, setViewMode] = useState('create'); // 'create' or 'view'
  const [selectedAllowlist, setSelectedAllowlist] = useState(null);
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (isConnected) {
      fetchAllowlists();
    }
  }, [isConnected]);

  // Reset messages after display
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => {
        setActionMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  const handleCreateAllowlist = async (e) => {
    e.preventDefault();
    if (!allowlistName.trim()) return;
    
    try {
      const success = await createAllowlist(allowlistName);
      if (success) {
        setActionMessage('Allowlist created successfully!');
        setAllowlistName('');
      }
    } catch (error) {
      console.error('Error creating allowlist:', error);
      setActionMessage('Error creating allowlist: ' + error.message);
    }
  };

  const handleViewAllowlists = () => {
    setViewMode('view');
    fetchAllowlists();
  };

  const handleSelectAllowlist = (allowlist) => {
    setSelectedAllowlist(allowlist);
    setMemberAddresses(allowlist.members || []);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberAddress.trim() || !selectedAllowlist) return;
    
    try {
      const success = await addMemberToAllowlist(selectedAllowlist.id, newMemberAddress);
      if (success) {
        setActionMessage('Member added successfully!');
        setNewMemberAddress('');
        
        // Refresh member list
        const updatedAllowlists = await fetchAllowlists();
        const updated = updatedAllowlists.find(al => al.id === selectedAllowlist.id);
        if (updated) {
          setSelectedAllowlist(updated);
          setMemberAddresses(updated.members || []);
        }
      }
    } catch (error) {
      console.error('Error adding member:', error);
      setActionMessage('Error adding member: ' + error.message);
    }
  };

  const handleRemoveMember = async (memberAddress) => {
    if (!selectedAllowlist) return;
    
    try {
      const success = await removeMemberFromAllowlist(selectedAllowlist.id, memberAddress);
      if (success) {
        setActionMessage('Member removed successfully!');
        
        // Refresh member list
        const updatedAllowlists = await fetchAllowlists();
        const updated = updatedAllowlists.find(al => al.id === selectedAllowlist.id);
        if (updated) {
          setSelectedAllowlist(updated);
          setMemberAddresses(updated.members || []);
        }
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setActionMessage('Error removing member: ' + error.message);
    }
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
            onClick={handleViewAllowlists}
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
                  disabled={transactionInProgress}
                />
                <button 
                  type="submit" 
                  className="btn primary"
                  disabled={loading || transactionInProgress || !allowlistName.trim()}
                >
                  {transactionInProgress ? 'Creating...' : 'Create Allowlist'}
                </button>
              </div>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        )}

        {viewMode === 'view' && (
          <div className="allowlists-container">
            <div className="allowlists-list">
              {loading ? (
                <p>Loading allowlists...</p>
              ) : allowlists.length > 0 ? (
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
                          {list.members ? list.members.length : 0} members
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
                        disabled={transactionInProgress}
                      />
                      <button 
                        type="submit" 
                        className="btn secondary"
                        disabled={loading || transactionInProgress || !newMemberAddress.trim()}
                      >
                        {transactionInProgress ? 'Adding...' : 'Add Member'}
                      </button>
                    </div>
                  </form>
                  
                  <div className="members-list">
                    <h4>Current Members</h4>
                    {memberAddresses.length > 0 ? (
                      <ul>
                        {memberAddresses.map((address, index) => (
                          <li key={index} className="member-item">
                            <span className="member-address">{address}</span>
                            <button 
                              className="btn small danger"
                              onClick={() => handleRemoveMember(address)}
                              disabled={transactionInProgress}
                            >
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

export default AllowlistManager;
