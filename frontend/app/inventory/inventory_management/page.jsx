'use client';
import React, { useState, useEffect } from 'react';
import { InventoryChart, SalesChart } from '@/components/Charts.js';
import Link from 'next/link';
import { FaBell, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import InventoryModal from '@/components/inventory/InventoryModal';
import { useRouter } from 'next/navigation'; // Add this import

function StockStats({ stats }) {
  return (
    <>
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-[#fdc501] hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-gray-500 text-sm">{stat.title}</h3>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </>
  );
}

function QuickActions({ actions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Link href="/inventory/add_new" className={`p-4 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors duration-300 text-center font-semibold`}>
        Add New Item
      </Link>
      <Link 
        href="/inventory/inventory_report" 
        className={`p-4 bg-white border-2 border-yellow-500 text-black rounded-lg hover:bg-gray-50 transition-colors duration-300 text-center font-semibold`}
      >
        Inventory Report
      </Link>
      <Link 
        href="/inventory/inventory_analytics" 
        className={`p-4 bg-white border-2 border-yellow-500 text-black rounded-lg hover:bg-gray-50 transition-colors duration-300 text-center font-semibold`}
      >
        Analytics Chart
      </Link>
      <Link 
        href="/inventory/view_alerts" 
        className={`p-4 bg-white border-2 border-yellow-500 text-black rounded-lg hover:bg-gray-50 transition-colors duration-300 text-center font-semibold`}
      >
        View Alerts
      </Link>
    </div>
  );
}

function CategoryList({ categories }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-black">Product Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link 
            href={category.link} 
            key={category.name} 
            className="block"
          >
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-300">
              <img src={category.image} alt={category.name} className="w-full h-32 object-cover mb-2 rounded-lg" />
              <h3 className="text-lg font-bold text-black">{category.name}</h3>
              <p className="text-sm text-gray-500">In Stock: {category.inStock}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getInventoryChartData(categories) {
  return {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Current Stock',
        data: categories.map(cat => cat.inStock),
        backgroundColor: '#fdc501',
      }
    ]
  };
}

export default function InventoryManagementPage() {
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null);      // Add error state
  const [actions, setActions] = useState([
    { label: 'Add New Item', bgColor: 'bg-yellow-500 text-black', hoverColor: 'bg-yellow-400' },
    { label: 'Inventory Report', bgColor: 'bg-white border-2 border-yellow-500', hoverColor: 'bg-gray-50' },
    { label: 'Analytics Chart', bgColor: 'bg-white border-2 border-yellow-500', hoverColor: 'bg-gray-50', link: '/inventory_analytics' },
    { label: 'View Alerts', bgColor: 'bg-white border-2 border-yellow-500', hoverColor: 'bg-gray-50', link: '/view_alerts' },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchStats(), fetchCategories()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const fetchStats = async () => {
    try {
      // Simulate API call
      const data = [
        { title: 'Total Items', value: '1,234', color: 'text-black' },
        { title: 'Low Stock Items', value: '23', color: 'text-red-500' },
        { title: 'Categories', value: '8', color: 'text-black' },
        { title: 'Total Value', value: 'Rs52,234', color: 'text-black' },
      ];
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/inventory/categories');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      
      const data = await response.json();
      console.log('Fetched categories:', data);
      
      // If no categories returned, use fallback data
      if (!data || data.length === 0) {
        const fallbackCategories = [
          { name: 'Pipes', image: '/image/minimalist-construction-pvc-pipes-assortment.jpg', inStock: 0, link: '/category/pipes' },
          { name: 'Fittings', image: '/image/sanitary-equipment.jpg', inStock: 0, link: '/category/fittings' },
          // ...existing fallback categories...
        ];
        setCategories(fallbackCategories);
        return;
      }
      
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      // Set fallback data on error
      setCategories([
        { name: 'Pipes', image: '/image/minimalist-construction-pvc-pipes-assortment.jpg', inStock: 0, link: '/category/pipes' },
        { name: 'Fittings', image: '/image/sanitary-equipment.jpg', inStock: 0, link: '/category/fittings' },
        // ...existing fallback categories...
      ]);
    }
  };

  // Only show charts if categories have loaded
  const showCharts = categories.length > 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-pattern-plumbing p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero section with background image */}
        <div className="bg-hero rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Inventory Management</h1>
          <p className="text-gray-700 mb-4">Efficiently manage your plumbing supplies and track inventory levels</p>
          <div className="inline-flex items-center px-4 py-2 bg-[#fdc501] text-black rounded-lg">
            <span>Total items: {stats.length > 0 ? stats[0].value : 'Loading...'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StockStats stats={stats} />
        </div>

        <QuickActions actions={actions} />

        {/* Charts - only render if data is loaded */}
        {showCharts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-black">Inventory Levels</h2>
              <InventoryChart data={getInventoryChartData(categories)} />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-black">Sales Overview</h2>
              <SalesChart />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-black">Loading charts...</h2>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Please wait while we load your inventory data...</p>
            </div>
          </div>
        )}

        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
