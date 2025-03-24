import React from 'react';
import StockStats from './StockStats';

export default function InventoryManagement() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Plumbing Inventory Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StockStats />
        </div>
      </div>
    </div>
  );
}
