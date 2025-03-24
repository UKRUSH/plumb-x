'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaChartBar,
  FaExclamationTriangle,
  FaArrowUp,
  FaDollarSign,
  FaClock,
  FaPlus,
  FaChartPie,
  FaBoxOpen
} from 'react-icons/fa';
import { sampleDashboardData } from '@/app/data/sampleData';
// Import our custom modal instead of react-modal
import CustomModal from '@/components/CustomModal';
import dynamic from 'next/dynamic';

// Placeholder chart components
const PlaceholderChart = ({ type }) => (
  <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-gray-500 text-center">
      <p className="font-medium">{type} Chart</p>
      <p className="text-sm mt-2">Please install chart.js and react-chartjs-2</p>
    </div>
  </div>
);

// Dynamically import chart components with fallbacks
const Pie = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Pie).catch(() => PlaceholderChart),
  { ssr: false, loading: () => <PlaceholderChart type="Pie" /> }
);

const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line).catch(() => PlaceholderChart),
  { ssr: false, loading: () => <PlaceholderChart type="Line" /> }
);

// Register required chart.js components - wrapped in try/catch
try {
  const registerCharts = async () => {
    if (typeof window !== 'undefined') {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
    }
  };
  registerCharts();
} catch (error) {
  console.error('Failed to register Chart.js components:', error);
}

export default function DashboardPage() {
  // State for dashboard data
  const [overviewStats, setOverviewStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    expiringSoon: 0
  });
  
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [stockMovement, setStockMovement] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    // This would be an API call in a real application
    // Simulate fetching dashboard data
    setTimeout(() => {
      // Use the imported sample data
      setOverviewStats(sampleDashboardData.overviewStats);
      setCategoryDistribution(sampleDashboardData.categoryDistribution);
      setStockMovement(sampleDashboardData.stockMovement);
      setTopSellingItems(sampleDashboardData.topSellingItems);
      
      setLoading(false);
    }, 1000);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Function to render chart data or fallback
  const renderPieChart = () => {
    try {
      return (
        <Pie 
          data={{
            labels: categoryDistribution.map(cat => cat.category),
            datasets: [{
              data: categoryDistribution.map(cat => cat.count),
              backgroundColor: ['#fdc501', '#4c51bf', '#f56565', '#48bb78', '#ed64a6']
            }]
          }}
        />
      );
    } catch (error) {
      return <PlaceholderChart type="Pie" />;
    }
  };

  const renderLineChart = () => {
    try {
      return (
        <Line 
          data={{
            labels: stockMovement.map(mov => mov.date),
            datasets: [{
              label: 'Inflow',
              data: stockMovement.map(mov => mov.inflow),
              borderColor: '#48bb78',
              fill: false
            }, {
              label: 'Outflow',
              data: stockMovement.map(mov => mov.outflow),
              borderColor: '#f56565',
              fill: false
            }]
          }}
        />
      );
    } catch (error) {
      return <PlaceholderChart type="Line" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#fdc501]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time overview of your inventory management system</p>
          </div>
          <button 
            onClick={openModal} 
            className="bg-[#fdc501] text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaPlus className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#fdc501]">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.totalItems}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaChartBar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">Rs{overviewStats.totalValue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaDollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">{overviewStats.lowStockItems}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-purple-600">{overviewStats.outOfStockItems}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaClock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Inventory Turnover</p>
                <p className="text-2xl font-bold text-green-600">3.2x</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FaArrowUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory by Category</h2>
            <div className="h-64">
              {renderPieChart()}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Stock Movement</h2>
            <div className="h-64">
              {renderLineChart()}
            </div>
          </div>
        </div>

        {/* Recent Activity and Top Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topSellingItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sold}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${
                          item.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Placeholder for activity feed */}
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New stock arrived: PVC Pipes</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              {/* Add more activity items here */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding new items */}
      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        title="Add New Item"
      >
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
              Item Name
            </label>
            <input 
              type="text" 
              id="itemName" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCategory">
              Category
            </label>
            <input 
              type="text" 
              id="itemCategory" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemStock">
              Stock
            </label>
            <input 
              type="number" 
              id="itemStock" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemPrice">
              Price
            </label>
            <input 
              type="number" 
              id="itemPrice" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="flex items-center justify-between">
            <button 
              type="button" 
              className="bg-[#fdc501] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={closeModal}
            >
              Add Item
            </button>
            <button 
              type="button" 
              className="text-gray-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
}
