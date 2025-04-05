import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { useSealContext } from '../contexts/SealContext';
import suiService from '../services/suiService';

const AllowlistManager = () => {
  const { wallet, isConnected } = useWalletContext();
  const { createAllowlist, getAllAllowlists, loading, error } = useSealContext();
  
  const [allowlistName, setAllowlistName] = useState('');
  const [allowlists, setAllowlists] = useState([]);
  const [viewMode, setViewMode] = useState('create'); // 'create' or 'view'

  useEffect(() => {
    if (isConnected && viewMode === 'view') {
      fetchAllowlists();
    }
  }, [isConnected, viewMode]);

  const fetchAllowlists = async () => {
    try {
      const lists = await getAllAllowlists();
      setAllowlists(lists);
    } catch (error) {
      console.error('Error fetching allowlists:', error);
    }
  };

  const handleCreateAllowlist = async (e) => {
    e.preventDefault();
    if (!allowlistName.trim()) return;
    
    try {
      const success = await createAllowlist(allowlistName);
      if (success) {
        setAllowlistName('');
        // Optionally switch to view mode after creation
        setViewMode('view');
        fetchAllowlists();
      }
    } catch (error) {
      console.error('Error creating allowlist:', error);
    }
  };

  const handleViewAllowlists = () => {
    setViewMode('view');
    fetchAllowlists();
  };

  if (!isConnected) {
    return (
      <div className="allowlist-manager">
        <div className="card">
          <h2>Allowlist Manager</h2>
          <p>Please connect your wallet to manage allowlists.</p>
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
                />
                <button 
                  type="submit" 
                  className="btn primary"
                  disabled={loading || !allowlistName.trim()}
                >
                  {loading ? 'Creating...' : 'Create Allowlist'}
                </button>
              </div>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        )}

        {viewMode === 'view' && (
          <div className="allowlists-view">
            {loading ? (
              <p>Loading allowlists...</p>
            ) : allowlists.length > 0 ? (
              <ul className="allowlist-items">
                {allowlists.map((list) => (
                  <li key={list.id} className="allowlist-item">
                    <div className="allowlist-header">
                      <h3>{list.name}</h3>
                      <span className="member-count">
                        {list.members ? list.members.length : 0} members
                      </span>
                    </div>
                    <div className="allowlist-actions">
                      <button className="btn secondary">Manage Members</button>
                      <button className="btn outline">View Details</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No allowlists found. Create one to get started!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllowlistManager;
