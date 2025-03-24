'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  HomeIcon, 
  ChevronRightIcon, 
  CheckCircleIcon, 
  PlusCircleIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';  // Updated to v2 syntax

export default function AddedItemsPage() {
  const router = useRouter();
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch items');
      
      const items = await response.json();
      setAddedItems(items);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Update local state
      setAddedItems(prev => prev.filter(item => item._id !== itemId));

      // Also update localStorage if exists
      const storedItems = localStorage.getItem('recentlyAddedItems');
      if (storedItems) {
        const items = JSON.parse(storedItems);
        const updatedItems = items.filter(item => item._id !== itemId);
        localStorage.setItem('recentlyAddedItems', JSON.stringify(updatedItems));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    const editItemId = item._id || item.id;
    if (!editItemId) {
      console.error('No valid ID found for item:', item);
      return;
    }
    
    router.push(`/inventory/add_new?edit=true&id=${editItemId}`);
  };

  const ItemImage = ({ item }) => {
    const [error, setError] = useState(false);
    
    if (!item.imageUrl && !item.image) { // Check both imageUrl and image fields
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-200">
          <span className="text-xl font-medium text-gray-600">
            {item.itemName?.[0].toUpperCase() || 'I'}
          </span>
        </div>
      );
    }
    
    return (
      <img 
        src={item.imageUrl || item.image} // Try both image fields
        alt={item.itemName || 'Item'} 
        className="h-full w-full object-cover rounded-md"
        onError={() => setError(true)}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
            <Link
              href="/inventory/add_new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600"
            >
              <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
              Add New Item
            </Link>
          </div>

          {addedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found. Add some items to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {addedItems.map((item) => (
                <li key={item._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                        <ItemImage item={item} />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">{item.itemName}</h2>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>Category: {item.category}</span>
                          <span className="mx-2">•</span>
                          <span>Stock: {item.quantity}</span>
                          <span className="mx-2">•</span>
                          <span>Size: {item.size}</span>
                          <span className="mx-2">•</span>
                          <span>Price: Rs.{item.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
