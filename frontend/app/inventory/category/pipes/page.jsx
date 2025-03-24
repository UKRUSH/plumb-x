'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { samplePipesData } from '../../../data/sampleData';

// Helper function to load items from localStorage
const loadStoredItems = () => {
  try {
    if (typeof window !== 'undefined') {
      const storedItems = window.localStorage.getItem('recentlyAddedItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems)) {
          // Filter to only include pipe items
          const pipeItems = parsedItems.filter(item => 
            item.category === 'pipes' || 
            item.category === 'Pipes' ||
            (item.name && item.name.toLowerCase().includes('pipe'))
          );
          
          console.log(`Found ${pipeItems.length} pipe items in localStorage`);
          return pipeItems.map(item => ({
            id: item.id || item.itemCode,
            itemCode: item.itemCode || item.id, // Add this line to preserve the user-given code
            name: item.name || item.itemName,
            type: item.type || 'Schedule 40',
            material: item.material || 'PVC',
            size: item.size || 'Standard',
            length: '10 feet',
            stockLevel: Number(item.stockLevel) || 0,
            reorderLevel: 20, // Default value
            price: Number(item.price) || 0,
            value: Number(item.price * item.stockLevel) || 0,
            location: item.location || 'Storage',
            image: item.image || '/image/pvc-pipe-placeholder.jpg',
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

export default function PipesPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Category statistics
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    value: 0,
    types: 0
  });

  // Toggle dropdown menu
  const toggleDropdown = (itemId) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  // Handle updating items
  const handleUpdateItem = (item) => {
    // Store the item to be updated in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('itemToUpdate', JSON.stringify(item));
    }
    
    // Navigate to add_new page with edit mode flag
    router.push(`/add_new?edit=true&itemId=${item.id}`);
  };

  // Handle deleting items
  const handleDeleteItem = (itemId) => {
    if (confirm('Are you sure you want to delete this item?') && typeof window !== 'undefined') {
      // Get existing items
      const storedItems = window.localStorage.getItem('recentlyAddedItems');
      if (storedItems) {
        try {
          const items = JSON.parse(storedItems);
          // Filter out the item to delete
          const updatedItems = items.filter(item => item.id !== itemId);
          // Update localStorage
          window.localStorage.setItem('recentlyAddedItems', JSON.stringify(updatedItems));
          // Refresh the items list
          fetchItems();
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      }
    }
  };
  
  // Fetch items function that can be called after operations like delete
  const fetchItems = async () => {
    setLoading(true);
    
    // First try to load items from localStorage
    const storedPipeItems = loadStoredItems();
    
    // Use the imported sample data
    const data = samplePipesData;
    
    // Combine localStorage items with sample data
    let combinedData = [];
    
    if (storedPipeItems && storedPipeItems.length > 0) {
      // Start with stored items
      combinedData = [...storedPipeItems];
      
      // Add sample items that don't conflict with stored items
      const existingIds = new Set(storedPipeItems.map(item => item.id));
      const uniqueSampleItems = data.filter(item => !existingIds.has(item.id));
      
      combinedData = [...combinedData, ...uniqueSampleItems];
      console.log(`Showing ${storedPipeItems.length} stored items and ${uniqueSampleItems.length} sample items`);
    } else {
      combinedData = data;
      console.log("No stored items found, using sample data");
    }
    
    // Calculate statistics with safety checks
    const totalValue = Array.isArray(combinedData) ? combinedData.reduce((sum, item) => sum + (item.value || 0), 0) : 0;
    const lowStockItems = Array.isArray(combinedData) ? combinedData.filter(item => item.stockLevel < item.reorderLevel).length : 0;
    const uniqueTypes = Array.isArray(combinedData) ? new Set(combinedData.map(item => item.type)).size : 0;
    const totalItems = Array.isArray(combinedData) ? combinedData.length : 0;
    
    setStats({
      total: totalItems,
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

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle sorting (used in the filtered items sort function)
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
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
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Pipes</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PVC & Plumbing Pipes</h1>
            <p className="text-gray-600 mt-1">Browse our selection of high-quality PVC pipes and plumbing supplies</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link href="/add_new?category=pipes" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#fdc501] hover:bg-yellow-400">
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Add New Pipe
            </Link>
            <Link href="/inventory_report?category=pipes" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
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
                <p className="text-sm font-medium text-gray-600">Total Pipe Items</p>
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
                <p className="text-sm font-medium text-gray-600">Pipe Types</p>
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
                onClick={() => setFilter('Schedule 40')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'Schedule 40' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Schedule 40
              </button>
              <button
                onClick={() => setFilter('Schedule 80')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'Schedule 80' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Schedule 80
              </button>
              <button
                onClick={() => setFilter('CPVC')}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  filter === 'CPVC' ? 'bg-[#fdc501] text-black' : 'bg-gray-100 text-gray-700'
                }`}
              >
                CPVC
              </button>
            </div>
            
            {/* Search input */}
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search pipes..."
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No pipes found</h3>
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
                    src={item.image || '/image/pipe-placeholder.jpg'} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/pipe-placeholder.jpg';
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
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-md">{item.type}</span>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-md">Code: {item.itemCode || item.id}</span>
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
                      <span className="text-gray-500">Length:</span>
                      <span className="ml-1 text-gray-900">{item.length}</span>
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
                    
                    <div className="relative">
                      <button 
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        onClick={() => toggleDropdown(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200 origin-bottom-right">
                          <div className="py-1">
                            <button
                              onClick={() => handleUpdateItem(item)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Update Item
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Item
                            </button>
                          </div>
                        </div>
                      )}
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