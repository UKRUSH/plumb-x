'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function FixturesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    averagePrice: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory/category/fixtures');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch items');
      }

      const result = await response.json();
      console.log('Fetched fixtures:', result); // Debug log
      
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format received');
      }

      setItems(result.data);

      // Calculate stats
      if (result.data.length > 0) {
        const totalValue = result.data.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        setStats({
          totalItems: result.data.length,
          totalValue: totalValue,
          averagePrice: totalValue / result.data.length
        });
      }
    } catch (err) {
      console.error('Error fetching fixtures:', err);
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg p-6">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-700 hover:text-yellow-500">
                <HomeIcon className="w-4 h-4 mr-2"/>
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
                <Link href="/inventory/inventory_management" className="ml-1 text-sm font-medium text-gray-700 hover:text-yellow-500 md:ml-2">
                  Inventory
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Fixtures</span>
              </div>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Fixtures Inventory</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-500">Total Items</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-500">Total Value</h3>
            <p className="text-3xl font-bold text-gray-900">Rs.{stats.totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-500">Average Price</h3>
            <p className="text-3xl font-bold text-gray-900">Rs.{stats.averagePrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs.{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs.{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
