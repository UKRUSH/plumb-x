'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
    FaExclamationTriangle, 
    FaClock,
    FaCheckCircle, 
    FaEye, 
    FaTimes,
    FaSliders,
    FaEnvelope,
    FaArrowDown,
    FaChevronRight,
    FaFilter,
    FaTag,
    FaPlusCircle,
    FaStore,
    FaHome
} from 'react-icons/fa';

export default function LowStockAlertsDashboard() {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            title: 'Low Stock Alert',
            message: 'PVC Pipe 1/2" is below minimum stock level (5 remaining)',
            priority: 'high',
            timestamp: '2024-01-25T09:30:00',
            isRead: false,
            category: 'Pipes',
            actionRequired: true,
            relatedItems: ['P001'],
            suggestedAction: 'Order 50 units'
        },
        {
            id: 5,
            title: 'Critical Stock Alert',
            message: 'Metal Valves 3/4" out of stock',
            priority: 'critical',
            timestamp: '2024-01-22T10:45:00',
            isRead: false,
            category: 'Valves',
            actionRequired: true,
            relatedItems: ['V005'],
            suggestedAction: 'Expedite previous order #54321'
        },
        {
            id: 6,
            title: 'Low Stock Warning',
            message: 'Copper Pipe 1" below threshold (8 remaining)',
            priority: 'medium',
            timestamp: '2024-01-21T14:10:00',
            isRead: true,
            category: 'Pipes',
            actionRequired: true,
            relatedItems: ['P015'],
            suggestedAction: 'Place order for 25 units'
        },
        {
            id: 7,
            title: 'Running Low',
            message: 'Brass fittings 3/4" quantity low (12 remaining)',
            priority: 'low',
            timestamp: '2024-01-20T09:45:00',
            isRead: false,
            category: 'Fittings',
            actionRequired: true,
            relatedItems: ['F022'],
            suggestedAction: 'Add to next order'
        },
        {
            id: 8,
            title: 'Critical Inventory',
            message: 'PEX tubing 1/2" completely out of stock',
            priority: 'critical',
            timestamp: '2024-01-19T11:30:00',
            isRead: true,
            category: 'Pipes',
            actionRequired: true,
            relatedItems: ['P045'],
            suggestedAction: 'Place emergency order'
        }
    ]);
    
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [filterPriority, setFilterPriority] = useState('all');

    // Get counts
    const alertCounts = {
        total: alerts.length,
        critical: alerts.filter(a => a.priority === 'critical').length,
        high: alerts.filter(a => a.priority === 'high').length,
        unread: alerts.filter(a => !a.isRead).length
    };

    // Mark an alert as read
    const markAsRead = (id) => {
        setAlerts(alerts.map(alert => 
            alert.id === id ? { ...alert, isRead: true } : alert
        ));
    };

    // Dismiss an alert
    const dismissAlert = (id) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };
    
    // Filter alerts based on priority
    const filteredAlerts = filterPriority === 'all' 
        ? alerts 
        : alerts.filter(alert => alert.priority === filterPriority);

    // Group alerts by category for visualization
    const alertsByCategory = {};
    alerts.forEach(alert => {
        if (!alertsByCategory[alert.category]) {
            alertsByCategory[alert.category] = [];
        }
        alertsByCategory[alert.category].push(alert);
    });

    // Alert priority colors
    const priorityColors = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800'
    };

    return (
        <div className="min-h-screen bg-tools-pattern p-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb Navigation */}
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-700 hover:text-[#fdc501]">
                                <FaHome className="w-4 h-4 mr-2"/>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <FaChevronRight className="w-5 h-5 text-gray-400"/>
                                <Link href="/inventory_management" className="ml-1 text-sm font-medium text-gray-700 hover:text-[#fdc501] md:ml-2">
                                    Inventory Management
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <FaChevronRight className="w-5 h-5 text-gray-400"/>
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Low Stock Alerts</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                
                {/* Header - with updated design */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <FaArrowDown className="h-7 w-7 text-[#fdc501]" />
                                <h1 className="text-3xl font-bold text-gray-900">Low Stock Monitor</h1>
                            </div>
                            <p className="text-gray-600 mt-1">Stay ahead of inventory shortages with real-time alerts</p>
                        </div>
                        <div className="flex gap-3">
                            {/* Keep view toggle and other buttons, but remove theme toggle */}
                            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                                <button 
                                    onClick={() => setView('grid')}
                                    className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${
                                        view === 'grid' ? 'bg-white shadow-sm' : 'text-black'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7z"/>
                                    </svg>
                                    <span className="hidden md:inline">Grid</span>
                                </button>
                                <button 
                                    onClick={() => setView('list')}
                                    className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${
                                        view === 'list' ? 'bg-white shadow-sm' : 'text-black'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
                                        <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"/>
                                        <path fillRule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
                                    </svg>
                                    <span className="hidden md:inline">List</span>
                                </button>
                            </div>
                            <Link href="/inventory_management" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                                <FaHome className="h-5 w-5" />
                                <span className="hidden md:inline">Back to Inventory</span>
                            </Link>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#fdc501] text-white rounded-lg hover:bg-[#e3b101]">
                                <FaPlusCircle className="h-5 w-5" />
                                <span className="hidden md:inline">Create Order</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Visualization and Filtering Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Overview Card */}
                                        <div className="bg-white rounded-xl shadow-md p-6">
                                            <h3 className="text-lg font-medium mb-4 text-black">Stock Alert Summary</h3>
                                            <div className="space-y-4">
                                                {Object.entries(alertsByCategory).map(([category, items]) => (
                                                    <div key={category} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                                            <span className="text-black">{category}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-black">{items.length}</span>
                                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-[#fdc501]" 
                                                                    style={{width: `${(items.length / alerts.length) * 100}%`}}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <span className="text-black">Total Alerts</span>
                                                    <span className="font-medium text-gray-900">{alerts.length}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Filter Card */}
                                                            <div className="bg-white rounded-xl shadow-md p-6">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <h3 className="text-lg font-medium text-black">Filter Alerts</h3>
                                                                    <FaFilter className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-black mb-1">Priority</label>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            <button 
                                                                                onClick={() => setFilterPriority('all')}
                                                                                className={`px-3 py-1 text-xs rounded-full ${
                                                                                    filterPriority === 'all' 
                                                                                        ? 'bg-gray-800 text-white' 
                                                                                        : 'bg-gray-100 text-gray-800'
                                                                                }`}
                                                                            >
                                                                                All
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => setFilterPriority('critical')}
                                                                                className={`px-3 py-1 text-xs rounded-full ${
                                                                                    filterPriority === 'critical' 
                                                                                        ? 'bg-red-600 text-white' 
                                                                                        : 'bg-red-100 text-red-800'
                                                                                }`}
                                                                            >
                                                                                Critical
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => setFilterPriority('high')}
                                                                                className={`px-3 py-1 text-xs rounded-full ${
                                                                                    filterPriority === 'high' 
                                                                                        ? 'bg-orange-500 text-white' 
                                                                                        : 'bg-orange-100 text-orange-800'
                                                                                }`}
                                                                            >
                                                                                High
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => setFilterPriority('medium')}
                                                                                className={`px-3 py-1 text-xs rounded-full ${
                                                                                    filterPriority === 'medium' 
                                                                                        ? 'bg-yellow-500 text-white' 
                                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                                }`}
                                                                            >
                                                                                Medium
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => setFilterPriority('low')}
                                                                                className={`px-3 py-1 text-xs rounded-full ${
                                                                                    filterPriority === 'low' 
                                                                                        ? 'bg-blue-500 text-white' 
                                                                                        : 'bg-blue-100 text-blue-800'
                                                                                }`}
                                                                            >
                                                                                Low
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Stats Card */}
                                                                                <div className="bg-white rounded-xl shadow-md p-6">
                                                                                    <h3 className="text-lg font-medium mb-4 text-black">Alert Statistics</h3>
                                                                                    <div className="grid grid-cols-2 gap-4">
                                                                                        <div className="bg-red-50 rounded-lg p-3">
                                                                                            <div className="flex justify-between items-start">
                                                                                                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                                                                                                <span className="text-xs font-medium text-red-700">Critical</span>
                                                                                            </div>
                                                                                            <div className="mt-2">
                                                                                                <span className="text-2xl font-bold text-black">{alertCounts.critical}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="bg-orange-50 rounded-lg p-3">
                                                                                            <div className="flex justify-between items-start">
                                                                                                <FaArrowDown className="h-5 w-5 text-orange-500" />
                                                                                                <span className="text-xs font-medium text-orange-700">High</span>
                                                                                            </div>
                                                                                            <div className="mt-2">
                                                                                                <span className="text-2xl font-bold text-black">{alertCounts.high}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="bg-blue-50 rounded-lg p-3">
                                                                                            <div className="flex justify-between items-start">
                                                                                                <FaEye className="h-5 w-5 text-blue-500" />
                                                                                                <span className="text-xs font-medium text-blue-700">Unread</span>
                                                                                            </div>
                                                                                            <div className="mt-2">
                                                                                                <span className="text-2xl font-bold text-black">{alertCounts.unread}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="bg-green-50 rounded-lg p-3">
                                                                                            <div className="flex justify-between items-start">
                                                                                                <FaStore className="h-5 w-5 text-green-500" />
                                                                                                <span className="text-xs font-medium text-green-700">Categories</span>
                                                                                            </div>
                                                                                            <div className="mt-2">
                                                                                                <span className="text-2xl font-bold text-black">{Object.keys(alertsByCategory).length}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Alert List - with grid/list toggle */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Low Stock Items ({filteredAlerts.length})</h2>
                        <span className="text-sm text-gray-500">
                            {filterPriority !== 'all' ? `Filtered by ${filterPriority}` : 'Showing all priorities'}
                        </span>
                    </div>
                    
                    {filteredAlerts.length === 0 ? (
                        <div className="p-8 text-center">
                            <FaCheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No alerts found</h3>
                            <p className="text-gray-500 mt-2">There are no inventory items matching your current filters.</p>
                        </div>
                    ) : view === 'grid' ? (
                        // Grid View
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {filteredAlerts.map(alert => (
                                <div 
                                    key={alert.id} 
                                    className={`rounded-lg border ${
                                        alert.priority === 'critical' ? 'border-red-200' :
                                        alert.priority === 'high' ? 'border-orange-200' :
                                        alert.priority === 'medium' ? 'border-yellow-200' : 'border-blue-200'
                                    } overflow-hidden shadow-sm`}
                                >
                                    <div className={`p-3 ${
                                        alert.priority === 'critical' ? 'bg-red-50' :
                                        alert.priority === 'high' ? 'bg-orange-50' :
                                        alert.priority === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
                                    } border-b ${
                                        alert.priority === 'critical' ? 'border-red-200' :
                                        alert.priority === 'high' ? 'border-orange-200' :
                                        alert.priority === 'medium' ? 'border-yellow-200' : 'border-blue-200'
                                    }`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FaTag className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-700">{alert.category}</span>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                                alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            {alert.title}
                                            {!alert.isRead && (
                                                <span className="ml-2 relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-500 line-clamp-2">{alert.message}</p>
                                        <div className="mt-3 text-xs text-gray-500">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                            <div className="flex space-x-2">
                                                {!alert.isRead && (
                                                    <button 
                                                        onClick={() => markAsRead(alert.id)} 
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                    >
                                                        <FaEye className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => dismissAlert(alert.id)} 
                                                    className="text-gray-400 hover:text-gray-600 p-1"
                                                >
                                                    <FaTimes className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {alert.actionRequired && (
                                                <button className="bg-[#fdc501] text-white px-3 py-1 text-xs rounded-md hover:bg-[#e3b101]">
                                                    Place Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // List View (your existing list view code)
                        <div className="divide-y divide-gray-200">
                            {filteredAlerts.map(alert => (
                                <div key={alert.id} className={`p-4 ${!alert.isRead ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                alert.priority === 'critical' ? 'bg-red-100' :
                                                alert.priority === 'high' ? 'bg-orange-100' :
                                                alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                                            }`}>
                                                <FaArrowDown className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[alert.priority]}`}>
                                                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                                                    </span>
                                                    {!alert.isRead && (
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                                                <div className="mt-2 flex items-center gap-4">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(alert.timestamp).toLocaleString()}
                                                    </span>
                                                    {alert.category && (
                                                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                                            {alert.category}
                                                        </span>
                                                    )}
                                                </div>
                                                {alert.suggestedAction && (
                                                    <div className="mt-2 text-sm text-gray-700">
                                                        <span className="font-medium">Suggested Action:</span> {alert.suggestedAction}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {!alert.isRead && (
                                                <button 
                                                    onClick={() => markAsRead(alert.id)} 
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                >
                                                    <FaEye className="h-5 w-5" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => dismissAlert(alert.id)} 
                                                className="text-gray-400 hover:text-gray-600 p-1"
                                            >
                                                <FaTimes className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    {alert.actionRequired && (
                                        <div className="mt-3 flex justify-end">
                                            <button className="bg-[#fdc501] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#e3b101]">
                                                Place Order
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
