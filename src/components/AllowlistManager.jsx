import React, { useState } from 'react';
import { useSeal } from '../contexts/SealContext';
import { useWallet } from '../contexts/WalletContext';

const AllowlistManager = () => {
  const { isConnected, walletAddress } = useWallet();
  const { 
    allowlists, 
    createAllowlist, 
    updateAllowlist, 
    loading, 
    error 
  } = useSeal();
  
  const [newAllowlistName, setNewAllowlistName] = useState('');
  const [selectedAllowlistId, setSelectedAllowlistId] = useState('');
  const [addressToAdd, setAddressToAdd] = useState('');
  const [addressesToAdd, setAddressesToAdd] = useState([]);
  const [addressToRemove, setAddressToRemove] = useState('');
  const [operationSuccess, setOperationSuccess] = useState(false);
  const [operationError, setOperationError] = useState('');
  
  // Get selected allowlist
  const selectedAllowlist = selectedAllowlistId 
    ? allowlists.find(a => a.id === selectedAllowlistId)
    : null;
  
  // Handle creating a new allowlist
  const handleCreateAllowlist = async (e) => {
    e.preventDefault();
    setOperationSuccess(false);
    setOperationError('');
    
    if (!newAllowlistName) {
      setOperationError('Please enter a name for the allowlist');
      return;
    }
    
    try {
      await createAllowlist(newAllowlistName);
      setNewAllowlistName('');
      setOperationSuccess(true);
    } catch (err) {
      console.error('Error creating allowlist:', err);
      setOperationError(err.message || 'Failed to create allowlist');
    }
  };
  
  // Handle adding address to list
  const handleAddToList = () => {
    if (!addressToAdd) {
      setOperationError('Please enter an address to add');
      return;
    }
    
    // Check if address is already in the list
    if (addressesToAdd.includes(addressToAdd)) {
      setOperationError('Address is already in the list');
      return;
    }
    
    setAddressesToAdd([...addressesToAdd, addressToAdd]);
    setAddressToAdd('');
    setOperationError('');
  };
  
  // Handle removing address from list
  const handleRemoveFromList = (address) => {
    setAddressesToAdd(addressesToAdd.filter(a => a !== address));
  };
  
  // Handle adding addresses to allowlist
  const handleAddToAllowlist = async () => {
    setOperationSuccess(false);
    setOperationError('');
    
    if (!selectedAllowlistId) {
      setOperationError('Please select an allowlist');
      return;
    }
    
    if (addressesToAdd.length === 0) {
      setOperationError('Please add at least one address');
      return;
    }
    
    try {
      // Get updated members list
      const updatedMembers = [
        ...selectedAllowlist.members,
        ...addressesToAdd
      ];
      
      // Update allowlist
      await updateAllowlist(selectedAllowlistId, updatedMembers);
      
      // Reset form
      setAddressesToAdd([]);
      setOperationSuccess(true);
    } catch (err) {
      console.error('Error updating allowlist:', err);
      setOperationError(err.message || 'Failed to update allowlist');
    }
  };
  
  // Handle removing address from allowlist
  const handleRemoveFromAllowlist = async () => {
    setOperationSuccess(false);
    setOperationError('');
    
    if (!selectedAllowlistId) {
      setOperationError('Please select an allowlist');
      return;
    }
    
    if (!addressToRemove) {
      setOperationError('Please enter an address to remove');
      return;
    }
    
    // Check if address is in allowlist
    if (!selectedAllowlist.members.includes(addressToRemove)) {
      setOperationError('Address is not in the allowlist');
      return;
    }
    
    // Prevent removing creator
    if (addressToRemove === selectedAllowlist.creator) {
      setOperationError('Cannot remove the creator from the allowlist');
      return;
    }
    
    try {
      // Get updated members list
      const updatedMembers = selectedAllowlist.members.filter(
        m => m !== addressToRemove
      );
      
      // Update allowlist
      await updateAllowlist(selectedAllowlistId, updatedMembers);
      
      // Reset form
      setAddressToRemove('');
      setOperationSuccess(true);
    } catch (err) {
      console.error('Error updating allowlist:', err);
      setOperationError(err.message || 'Failed to update allowlist');
    }
  };
  
  // If not connected, show message
  if (!isConnected) {
    return (
      <div className="allowlist-manager">
        <h2>Allowlist Manager</h2>
        <p>Please connect your wallet to manage allowlists.</p>
      </div>
    );
  }
  
  return (
    <div className="allowlist-manager">
      <h2>Allowlist Manager</h2>
      
      <div className="allowlist-create">
        <h3>Create New Allowlist</h3>
        <form onSubmit={handleCreateAllowlist}>
          <div className="form-group">
            <label htmlFor="allowlist-name">Allowlist Name</label>
            <input
              type="text"
              id="allowlist-name"
              value={newAllowlistName}
              onChange={(e) => setNewAllowlistName(e.target.value)}
              placeholder="Enter allowlist name"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="create-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Allowlist'}
          </button>
        </form>
      </div>
      
      <div className="allowlist-manage">
        <h3>Manage Existing Allowlists</h3>
        
        <div className="form-group">
          <label htmlFor="allowlist-select">Select Allowlist</label>
          <select
            id="allowlist-select"
            value={selectedAllowlistId}
            onChange={(e) => setSelectedAllowlistId(e.target.value)}
          >
            <option value="">Select an allowlist</option>
            {allowlists.map((allowlist) => (
              <option key={allowlist.id} value={allowlist.id}>
                {allowlist.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedAllowlist && (
          <>
            <div className="allowlist-info">
              <h4>{selectedAllowlist.name}</h4>
              <p>Created by: {selectedAllowlist.creator === walletAddress ? 'You' : selectedAllowlist.creator}</p>
              <p>Members: {selectedAllowlist.members.length}</p>
            </div>
            
            <div className="allowlist-members">
              <h4>Members</h4>
              <ul>
                {selectedAllowlist.members.map((member) => (
                  <li key={member}>
                    {member === walletAddress ? `${member} (You)` : member}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="allowlist-add">
              <h4>Add Members</h4>
              <div className="form-group">
                <label htmlFor="address-to-add">Address</label>
                <div className="address-input-group">
                  <input
                    type="text"
                    id="address-to-add"
                    value={addressToAdd}
                    onChange={(e) => setAddressToAdd(e.target.value)}
                    placeholder="Enter address to add"
                  />
                  <button 
                    type="button"
                    onClick={handleAddToList}
                  >
                    Add to List
                  </button>
                </div>
              </div>
              
              {addressesToAdd.length > 0 && (
                <div className="addresses-to-add">
                  <h5>Addresses to Add</h5>
                  <ul>
                    {addressesToAdd.map((address) => (
                      <li key={address}>
                        {address}
                        <button 
                          type="button"
                          className="remove-button"
                          onClick={() => handleRemoveFromList(address)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    type="button"
                    className="add-to-allowlist-button"
                    onClick={handleAddToAllowlist}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add to Allowlist'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="allowlist-remove">
              <h4>Remove Member</h4>
              <div className="form-group">
                <label htmlFor="address-to-remove">Address</label>
                <div className="address-input-group">
                  <input
                    type="text"
                    id="address-to-remove"
                    value={addressToRemove}
                    onChange={(e) => setAddressToRemove(e.target.value)}
                    placeholder="Enter address to remove"
                  />
                  <button 
                    type="button"
                    onClick={handleRemoveFromAllowlist}
                    disabled={loading}
                  >
                    {loading ? 'Removing...' : 'Remove from Allowlist'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {operationSuccess && (
        <div className="operation-success">
          Operation completed successfully!
        </div>
      )}
      
      {(operationError || error) && (
        <div className="operation-error">
          {operationError || error}
        </div>
      )}
    </div>
  );
};

export default AllowlistManager;
