import React, { useState, useEffect } from 'react';
import { useSeal } from '../contexts/SealContext';
import { useWallet } from '../contexts/WalletContext';

const SubscriptionManager = () => {
  const { isConnected, walletAddress } = useWallet();
  const { 
    subscriptions, 
    createSubscriptionService, 
    purchaseSubscription, 
    loading, 
    error 
  } = useSeal();
  
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(1000); // Default price in MIST
  const [newServiceDuration, setNewServiceDuration] = useState(60); // Default duration in minutes
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [operationSuccess, setOperationSuccess] = useState(false);
  const [operationError, setOperationError] = useState('');
  
  // Load services from localStorage
  useEffect(() => {
    if (isConnected) {
      loadServices();
    }
  }, [isConnected]);
  
  // Load services
  const loadServices = () => {
    // Get all services from all users (in a real app, this would be a blockchain query)
    const allKeys = Object.keys(localStorage);
    const serviceKeys = allKeys.filter(key => key.startsWith('seal_services_'));
    
    const allServices = [];
    
    for (const key of serviceKeys) {
      const userServices = JSON.parse(localStorage.getItem(key) || '[]');
      allServices.push(...userServices);
    }
    
    setServices(allServices);
  };
  
  // Get user's active subscriptions
  const getActiveSubscriptions = () => {
    return subscriptions.filter(s => s.expiresAt > Date.now());
  };
  
  // Format datetime
  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days === 1 ? '' : 's'}`;
    }
  };
  
  // Format price
  const formatPrice = (mist) => {
    return `${mist} MIST`;
  };
  
  // Handle creating a new service
  const handleCreateService = async (e) => {
    e.preventDefault();
    setOperationSuccess(false);
    setOperationError('');
    
    if (!newServiceName) {
      setOperationError('Please enter a name for the service');
      return;
    }
    
    if (newServicePrice <= 0) {
      setOperationError('Price must be greater than 0');
      return;
    }
    
    if (newServiceDuration <= 0) {
      setOperationError('Duration must be greater than 0');
      return;
    }
    
    try {
      await createSubscriptionService(newServiceName, newServicePrice, newServiceDuration);
      
      // Reset form
      setNewServiceName('');
      setNewServicePrice(1000);
      setNewServiceDuration(60);
      setOperationSuccess(true);
      
      // Reload services
      loadServices();
    } catch (err) {
      console.error('Error creating service:', err);
      setOperationError(err.message || 'Failed to create service');
    }
  };
  
  // Handle purchasing a subscription
  const handlePurchaseSubscription = async () => {
    setOperationSuccess(false);
    setOperationError('');
    
    if (!selectedServiceId) {
      setOperationError('Please select a service');
      return;
    }
    
    try {
      await purchaseSubscription(selectedServiceId);
      
      // Reset form
      setSelectedServiceId('');
      setOperationSuccess(true);
    } catch (err) {
      console.error('Error purchasing subscription:', err);
      setOperationError(err.message || 'Failed to purchase subscription');
    }
  };
  
  // If not connected, show message
  if (!isConnected) {
    return (
      <div className="subscription-manager">
        <h2>Subscription Manager</h2>
        <p>Please connect your wallet to manage subscriptions.</p>
      </div>
    );
  }
  
  return (
    <div className="subscription-manager">
      <h2>Subscription Manager</h2>
      
      <div className="subscription-create">
        <h3>Create New Subscription Service</h3>
        <form onSubmit={handleCreateService}>
          <div className="form-group">
            <label htmlFor="service-name">Service Name</label>
            <input
              type="text"
              id="service-name"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Enter service name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="service-price">Price (MIST)</label>
            <input
              type="number"
              id="service-price"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(parseInt(e.target.value))}
              min={1}
              step={1}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="service-duration">Duration (minutes)</label>
            <input
              type="number"
              id="service-duration"
              value={newServiceDuration}
              onChange={(e) => setNewServiceDuration(parseInt(e.target.value))}
              min={1}
              step={1}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="create-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Service'}
          </button>
        </form>
      </div>
      
      <div className="subscription-purchase">
        <h3>Purchase Subscription</h3>
        
        <div className="form-group">
          <label htmlFor="service-select">Select Service</label>
          <select
            id="service-select"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {formatPrice(service.price)} for {formatDuration(service.duration)}
              </option>
            ))}
          </select>
        </div>
        
        {selectedServiceId && (
          <div className="service-info">
            <h4>Service Details</h4>
            {(() => {
              const service = services.find(s => s.id === selectedServiceId);
              if (!service) return null;
              
              return (
                <>
                  <p>Name: {service.name}</p>
                  <p>Price: {formatPrice(service.price)}</p>
                  <p>Duration: {formatDuration(service.duration)}</p>
                  <p>Created by: {service.creator === walletAddress ? 'You' : service.creator}</p>
                </>
              );
            })()}
            
            <button 
              type="button"
              className="purchase-button"
              onClick={handlePurchaseSubscription}
              disabled={loading}
            >
              {loading ? 'Purchasing...' : 'Purchase Subscription'}
            </button>
          </div>
        )}
      </div>
      
      <div className="subscription-active">
        <h3>Your Active Subscriptions</h3>
        
        {getActiveSubscriptions().length > 0 ? (
          <ul className="subscriptions-list">
            {getActiveSubscriptions().map((subscription) => {
              const service = services.find(s => s.id === subscription.serviceId);
              
              return (
                <li key={subscription.id} className="subscription-item">
                  <div className="subscription-details">
                    <h4>{service ? service.name : 'Unknown Service'}</h4>
                    <p>Purchased: {formatDateTime(subscription.purchasedAt)}</p>
                    <p>Expires: {formatDateTime(subscription.expiresAt)}</p>
                    {service && (
                      <p>Duration: {formatDuration(service.duration)}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>You don't have any active subscriptions.</p>
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

export default SubscriptionManager;
