'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { sampleToolsData } from '../../../data/sampleData';
import { useRouter } from 'next/navigation';

// Add this helper function to load items from localStorage
const loadStoredItems = () => {
  try {
    if (typeof window !== 'undefined') {
      const storedItems = window.localStorage.getItem('recentlyAddedItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems)) {
          // Filter to only include tool items
          const toolItems = parsedItems.filter(item => 
            item.category === 'tools' || 
            item.category === 'Tools'
          );
          
          console.log(`Found ${toolItems.length} tool items in localStorage`);
          return toolItems.map(item => ({
            id: item.id || item.itemCode,
            name: item.name || item.itemName,
            type: item.type || 'Tool',
            material: item.material || 'Steel',
            size: item.size || 'Standard',
            stockLevel: Number(item.stockLevel) || 0,
            reorderLevel: 10, // Default value
            price: Number(item.price) || 0,
            value: Number(item.price * item.stockLevel) || 0,
            location: item.location || 'Storage',
            image: item.image || '/image/tool-placeholder.jpg',
            lastRestocked: item.dateModified ? new Date(item.dateModified).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            description: item.description || 'No description available'
          }));
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error loading items from localStorage:", error);
    return null;
  }
};

export default function ToolsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const router = useRouter();
  
  // Category statistics
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    value: 0,
    types: 0
  });
  
  useEffect(() => {
    // Fetch category items
    const fetchItems = async () => {
      setLoading(true);
      
      // First try to load items from localStorage
      const storedToolItems = loadStoredItems();
      
      // Use the imported sample data
      const data = sampleToolsData;
      
      // Combine localStorage items with sample data
      let combinedData = [];
      
      if (storedToolItems && storedToolItems.length > 0) {
        // Start with stored items
        combinedData = [...storedToolItems];
        
        // Add sample items that don't conflict with stored items
        const existingIds = new Set(storedToolItems.map(item => item.id));
        const uniqueSampleItems = data.filter(item => !existingIds.has(item.id));
        
        combinedData = [...combinedData, ...uniqueSampleItems];
        console.log(`Showing ${storedToolItems.length} stored items and ${uniqueSampleItems.length} sample items`);
      } else {
        combinedData = data;
        console.log("No stored items found, using sample data");
      }
      
      // Calculate statistics
      const totalValue = combinedData.reduce((sum, item) => sum + item.value, 0);
      const lowStockItems = combinedData.filter(item => item.stockLevel < item.reorderLevel).length;
      const uniqueTypes = new Set(combinedData.map(item => item.type)).size;
      
      setStats({
          total: combinedData.length,
          lowStock: lowStockItems,
          value: totalValue,
          types: uniqueTypes
      });
      
      // Simulate network delay
      setTimeout(() => {
        setItems(combinedData);
        setLoading(false);
      }, 500);
    };
    
    fetchItems();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter items based on search, filter, and sort
  const filteredItems = items
    .filter(item => {
      // Filter by type if not 'all'
      if (filter !== 'all' && item.type.toLowerCase() !== filter.toLowerCase()) {
        return false;
      }
      
      // Search by name, type, or size
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.type.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.size.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Convert to lowercase if string
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Add edit handler
  const handleEdit = (item) => {
    router.push(`/inventory/add_new?edit=true&id=${item.id}`);
  };

  // Add delete handler
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-700 hover:text-[#fdc501]">
                <HomeIcon className="w-4 h-4 mr-2"/>
                Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
                <Link href="/inventory_management" className="ml-1 text-sm font-medium text-gray-700 hover:text-[#fdc501] md:ml-2">
                  Inventory
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Tools</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plumbing Tools</h1>
            <p className="text-gray-600 mt-1">Browse our selection of professional plumbing tools and equipment</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link href="/add_new?category=tools" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#fdc501] hover:bg-yellow-400">
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Add New Tool
            </Link>
            <Link href="/inventory_report?category=tools" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
              <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
              Export
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#fdc501]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tools</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">Rs{stats.value.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Tool Types</p>
                <p className="text-2xl font-bold text-gray-900">{stats.types}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-700 font-medium">Filter by:</span>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'all' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setFilter('Wrench')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'Wrench' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Wrenches
              </button>
              <button
                onClick={() => setFilter('Pliers')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'Pliers' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Pliers
              </button>
              <button
                onClick={() => setFilter('Cutter')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'Cutter' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Cutters
              </button>
              <button
                onClick={() => setFilter('Consumable')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'Consumable' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Consumables
              </button>
            </div>
            
            {/* Search input */}
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search tools..."
                className="w-full md:w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#fdc501] focus:border-[#fdc501] block p-2 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fdc501]"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tools found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <button
                onClick={() => {setSearchTerm(''); setFilter('all');}}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#fdc501] hover:bg-yellow-400"
              >
                <ArrowPathIcon className="mr-2 h-5 w-5" />
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={item.image || '/image/tool-placeholder.jpg'} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/tool-placeholder.jpg';
                    }}
                  />
                  <div 
                    className={`absolute top-2 right-2 py-1 px-2 rounded-md text-xs font-bold ${
                      item.stockLevel < item.reorderLevel 
                      ? 'bg-red-100 text-red-800 border border-red-300' 
                      : 'bg-green-100 text-green-800 border border-green-300'
                    }`}
                  >
                    {item.stockLevel < item.reorderLevel ? 'Low Stock' : 'In Stock'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-md">{item.type}</span>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md">{item.material}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">Rs{item.price}</div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <span className="ml-1 text-gray-900">{item.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span>
                      <span className={`ml-1 ${
                        item.stockLevel < item.reorderLevel 
                        ? 'text-red-600 font-medium' 
                        : 'text-gray-900'
                      }`}>{item.stockLevel}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-1 text-gray-900">{item.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Restocked:</span>
                      <span className="ml-1 text-gray-900">{item.lastRestocked}</span>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Link 
                      href={`/inventory/item/${item.id}`} 
                      className="text-[#fdc501] hover:text-yellow-600 font-medium text-sm inline-flex items-center"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
