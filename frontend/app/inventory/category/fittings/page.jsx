'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function FittingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    averagePrice: 0
  });
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory/category/fittings');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch items');
      }

      const result = await response.json();
      console.log('Fetched fittings:', result);
      
      const itemsData = result.data || [];
      setItems(itemsData);

      if (itemsData.length > 0) {
        const totalValue = itemsData.reduce((sum, item) => 
          sum + (Number(item.price) * Number(item.quantity)), 0
        );
        setStats({
          totalItems: itemsData.length,
          totalValue: totalValue,
          averagePrice: totalValue / itemsData.length
        });
      }
    } catch (err) {
      console.error('Error fetching fittings:', err);
      setError(err.message);
      setItems([]);
      setStats({
        totalItems: 0,
        totalValue: 0,
        averagePrice: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    router.push(`/inventory/add_new?edit=true&id=${item.id}`);
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fittings Inventory</h1>
          <Link
            href="/inventory/add_new"
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Fitting
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Total Items</h3>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Total Value</h3>
            <p className="text-2xl font-bold">Rs.{stats.totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Average Price</h3>
            <p className="text-2xl font-bold">Rs.{stats.averagePrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id || item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Rs.{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Rs.{(item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
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
