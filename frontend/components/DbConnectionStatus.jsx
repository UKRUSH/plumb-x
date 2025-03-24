'use client';

import { useState, useEffect } from 'react';

const DbConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    status: 'loading',
    message: 'Checking connection...',
    connectionState: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/status');
        const data = await response.json();
        setConnectionStatus(data);
        setLoading(false);
      } catch (error) {
        setConnectionStatus({
          status: 'error',
          message: 'Failed to connect to the server',
          connectionState: 0
        });
        setLoading(false);
      }
    };

    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return 'bg-gray-300';
    
    switch (connectionStatus.status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <div>
          <p className="text-sm font-medium">Database: {connectionStatus.message}</p>
          {connectionStatus.connectionState !== null && (
            <p className="text-xs text-gray-500">
              State: {
                connectionStatus.connectionState === 1 ? 'Connected' :
                connectionStatus.connectionState === 2 ? 'Connecting' :
                connectionStatus.connectionState === 3 ? 'Disconnecting' : 'Disconnected'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DbConnectionStatus; 