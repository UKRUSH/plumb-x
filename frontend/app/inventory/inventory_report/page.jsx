'use client';
import React, { useState, useEffect } from 'react';

function ReportFilter({ activeFilter, onFilterChange, dateRange, onDateRangeChange }) {
    return (
        <div className="space-y-4">
            <div className="flex gap-4 mb-6">
                {['Daily', 'Weekly', 'Monthly', 'Custom'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter.toLowerCase())}
                        className={`px-6 py-2 rounded-lg ${
                            activeFilter === filter.toLowerCase()
                                ? 'bg-yellow-500 text-black'
                                : 'bg-white border-2 border-yellow-500 text-black'
                        } hover:bg-yellow-400 transition-colors duration-300`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            {activeFilter === 'custom' && (
                <div className="flex gap-4 items-center">
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                        className="border-2 border-gray-300 rounded-lg px-4 py-2 text-black"
                    />
                    <span className="text-black">to</span>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                        className="border-2 border-gray-300 rounded-lg px-4 py-2 text-black"
                    />
                </div>
            )}
        </div>
    );
}

function ReportTable({ data, onSort, sortConfig }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        const results = data.filter(item =>
            item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
    }, [searchTerm, data]);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by item code, name, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border-2 border-gray-300 rounded-lg text-black focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <div className="absolute left-3 top-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <table className="min-w-full divide-y divide-">
                <thead className="bg-gray-300">
                    <tr>
                        {["Item Code", "Name", "Category", "Stock Level", "Distributed", "Restocked", "Value", "Last Updated"].map((header) => (
                            <th
                                key={header}
                                onClick={() => onSort(header.toLowerCase().replace(' ', '_'))}
                                className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-yellow-300"
                            >
                                {header}
                                {sortConfig.key === header.toLowerCase().replace(' ', '_') && (
                                    <span>{sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-black">
                    {filteredData.map((item) => (
                        <tr key={item.itemCode}>
                            <td className="px-6 py-4 whitespace-nowrap text-black">{item.itemCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">{item.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full ${
                                    item.stockLevel < 10 ? 'bg-red-100 text-black' : 'bg-green-100 text-black'
                                }`}>
                                    {item.stockLevel}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">
                                <span className="px-2 py-1 rounded-full bg-blue-100 text-black">
                                    {item.distributed}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">
                                <span className="px-2 py-1 rounded-full bg-green-100 text-black">
                                    +{item.restocked}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">Rs{item.value.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">{item.lastUpdated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-black">
                        Showing {filteredData.length} of {data.length} items
                        {searchTerm && ` (filtered from ${data.length} total)`}
                    </span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50">Previous</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReportSummary({ data }) {
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    const totalStocked = data.reduce((sum, item) => sum + item.stockLevel, 0);
    const totalDistributed = data.reduce((sum, item) => sum + item.distributed, 0);
    const totalRestocked = data.reduce((sum, item) => sum + item.restocked, 0);
    const lowStockItems = data.filter(item => item.stockLevel < 10).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                <h3 className="text-sm text-black">Current Stock</h3>
                <p className="text-2xl font-bold text-black">{totalStocked} units</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                <h3 className="text-sm text-black">Distributed</h3>
                <p className="text-2xl font-bold text-blue-600">{totalDistributed} units</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
                <h3 className="text-sm text-black">Restocked</h3>
                <p className="text-2xl font-bold text-green-600">+{totalRestocked} units</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                <h3 className="text-sm text-black">Total Value</h3>
                <p className="text-2xl font-bold text-black">Rs{totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                <h3 className="text-sm text-black">Low Stock Items</h3>
                <p className="text-2xl font-bold text-red-500">{lowStockItems}</p>
            </div>
        </div>
    );
}

export default function InventoryReportPage() {
    const [filter, setFilter] = useState('daily');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            let data = [];
            
            switch(filter) {
                case 'daily':
                    data = [
                        { itemCode: 'P001', name: 'PVC Pipe 1/2"', category: 'Pipes', stockLevel: 120, distributed: 15, restocked: 50, value: 2400, lastUpdated: new Date().toLocaleDateString() },
                        { itemCode: 'P002', name: 'PVC Pipe 3/4"', category: 'Pipes', stockLevel: 85, distributed: 10, restocked: 25, value: 1870, lastUpdated: new Date().toLocaleDateString() },
                        { itemCode: 'F001', name: 'Copper Fitting 1/2"', category: 'Fittings', stockLevel: 5, distributed: 8, restocked: 0, value: 150, lastUpdated: new Date().toLocaleDateString() },
                        { itemCode: 'F002', name: 'PVC Elbow 3/4"', category: 'Fittings', stockLevel: 200, distributed: 20, restocked: 100, value: 400, lastUpdated: new Date().toLocaleDateString() },
                        { itemCode: 'V001', name: 'Ball Valve 1/2"', category: 'Valves', stockLevel: 60, distributed: 5, restocked: 30, value: 1200, lastUpdated: new Date().toLocaleDateString() },
                        { itemCode: 'T001', name: 'Pipe Wrench 12"', category: 'Tools', stockLevel: 15, distributed: 2, restocked: 10, value: 450, lastUpdated: new Date().toLocaleDateString() }
                    ];
                    break;

                case 'weekly':
                    data = [
                        { itemCode: 'P001', name: 'PVC Pipe 1/2"', category: 'Pipes', stockLevel: 120, distributed: 95, restocked: 150, value: 2400, lastUpdated: '2024-01-20' },
                        { itemCode: 'P002', name: 'PVC Pipe 3/4"', category: 'Pipes', stockLevel: 85, distributed: 65, restocked: 100, value: 1870, lastUpdated: '2024-01-19' },
                        { itemCode: 'P003', name: 'Copper Pipe 1/2"', category: 'Pipes', stockLevel: 45, distributed: 30, restocked: 50, value: 3600, lastUpdated: '2024-01-18' },
                        { itemCode: 'F001', name: 'Copper Fitting 1/2"', category: 'Fittings', stockLevel: 5, distributed: 45, restocked: 30, value: 150, lastUpdated: '2024-01-17' },
                        { itemCode: 'F002', name: 'PVC Elbow 3/4"', category: 'Fittings', stockLevel: 200, distributed: 85, restocked: 100, value: 400, lastUpdated: '2024-01-16' },
                        { itemCode: 'F003', name: 'Brass Union 1"', category: 'Fittings', stockLevel: 8, distributed: 25, restocked: 20, value: 320, lastUpdated: '2024-01-15' },
                        { itemCode: 'V001', name: 'Ball Valve 1/2"', category: 'Valves', stockLevel: 60, distributed: 35, restocked: 40, value: 1200, lastUpdated: '2024-01-14' },
                        { itemCode: 'V002', name: 'Gate Valve 3/4"', category: 'Valves', stockLevel: 4, distributed: 15, restocked: 10, value: 280, lastUpdated: '2024-01-13' }
                    ];
                    break;

                case 'monthly':
                    data = [
                        { itemCode: 'P001', name: 'PVC Pipe 1/2"', category: 'Pipes', stockLevel: 120, distributed: 380, restocked: 500, value: 2400, lastUpdated: '2024-01-20' },
                        { itemCode: 'P002', name: 'PVC Pipe 3/4"', category: 'Pipes', stockLevel: 85, distributed: 250, restocked: 300, value: 1870, lastUpdated: '2024-01-15' },
                        { itemCode: 'P003', name: 'Copper Pipe 1/2"', category: 'Pipes', stockLevel: 45, distributed: 150, restocked: 200, value: 3600, lastUpdated: '2024-01-10' },
                        { itemCode: 'F001', name: 'Copper Fitting 1/2"', category: 'Fittings', stockLevel: 5, distributed: 195, restocked: 150, value: 150, lastUpdated: '2024-01-05' },
                        { itemCode: 'F002', name: 'PVC Elbow 3/4"', category: 'Fittings', stockLevel: 200, distributed: 320, restocked: 400, value: 400, lastUpdated: '2024-01-01' },
                        { itemCode: 'F003', name: 'Brass Union 1"', category: 'Fittings', stockLevel: 8, distributed: 110, restocked: 150, value: 320, lastUpdated: '2023-12-28' },
                        { itemCode: 'V001', name: 'Ball Valve 1/2"', category: 'Valves', stockLevel: 60, distributed: 145, restocked: 200, value: 1200, lastUpdated: '2023-12-25' },
                        { itemCode: 'V002', name: 'Gate Valve 3/4"', category: 'Valves', stockLevel: 4, distributed: 85, restocked: 100, value: 280, lastUpdated: '2023-12-22' },
                        { itemCode: 'T001', name: 'Pipe Wrench 12"', category: 'Tools', stockLevel: 15, distributed: 45, restocked: 50, value: 450, lastUpdated: '2023-12-20' },
                        { itemCode: 'T002', name: 'Plumber\'s Tape', category: 'Tools', stockLevel: 180, distributed: 420, restocked: 500, value: 360, lastUpdated: '2023-12-18' },
                        { itemCode: 'S001', name: 'Pipe Sealant', category: 'Sealants', stockLevel: 95, distributed: 250, restocked: 300, value: 475, lastUpdated: '2023-12-15' },
                        { itemCode: 'S002', name: 'Thread Compound', category: 'Sealants', stockLevel: 7, distributed: 95, restocked: 100, value: 140, lastUpdated: '2023-12-12' }
                    ];
                    break;

                case 'custom':
                    // Custom date range data
                    if (dateRange.start && dateRange.end) {
                        data = [
                            // Similar structure but filtered based on date range
                            // This would typically come from an API call with date parameters
                        ];
                    }
                    break;
            }
            
            setReportData(data);
            setLoading(false);
        };

        fetchReportData();
    }, [filter, dateRange]);

    const handlePrint = () => {
        setIsGenerating(true);
        
        try {
            const printWindow = window.open('', '_blank');
            
            if (!printWindow) {
                alert("Please allow popups to print this report");
                setIsGenerating(false);
                return;
            }
            
            const reportDate = new Date().toLocaleDateString();
            const reportPeriod = filter.charAt(0).toUpperCase() + filter.slice(1);
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Inventory Report - ${reportPeriod}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            max-width: 1100px; 
                            margin: 0 auto; 
                            padding: 20px; 
                            color: #333;
                        }
                        h1 { font-size: 24px; margin-bottom: 10px; }
                        h2 { font-size: 18px; margin-top: 20px; }
                        p.meta { color: #666; margin-bottom: 20px; font-size: 12px; }
                        .summary { 
                            display: grid; 
                            grid-template-columns: repeat(4, 1fr); 
                            gap: 10px; 
                            margin-bottom: 20px; 
                        }
                        .summary-item { 
                            border: 1px solid #ddd; 
                            padding: 10px; 
                            border-radius: 4px; 
                        }
                        .summary-label { font-size: 12px; color: #666; }
                        .summary-value { font-size: 18px; font-weight: bold; }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin: 20px 0; 
                        }
                        th { 
                            background-color: #fdc501; 
                            color: black; 
                            text-align: left; 
                            padding: 8px;
                            border: 1px solid #e5e5e5;
                        }
                        td { 
                            padding: 8px; 
                            border: 1px solid #e5e5e5; 
                        }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .no-print { display: none; }
                        .stock-low { color: #ef4444; }
                        .stock-ok { color: #22c55e; }
                        @media print {
                            body { padding: 0; margin: 15px; }
                            button { display: none; }
                            tr { page-break-inside: avoid; }
                            thead { display: table-header-group; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Inventory Report</h1>
                    <p class="meta">Period: ${reportPeriod} • Generated on: ${reportDate}</p>
                    
                    <div class="summary">
                        <div class="summary-item">
                            <div class="summary-label">Current Stock</div>
                            <div class="summary-value">${reportData.reduce((sum, item) => sum + item.stockLevel, 0)} units</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Distributed</div>
                            <div class="summary-value">${reportData.reduce((sum, item) => sum + item.distributed, 0)} units</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Restocked</div>
                            <div class="summary-value">+${reportData.reduce((sum, item) => sum + item.restocked, 0)} units</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Value</div>
                            <div class="summary-value">Rs${reportData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <h2>Inventory Items</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Stock Level</th>
                                <th>Distributed</th>
                                <th>Restocked</th>
                                <th>Value</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.map(item => `
                                <tr>
                                    <td>${item.itemCode}</td>
                                    <td>${item.name}</td>
                                    <td>${item.category}</td>
                                    <td class="${item.stockLevel < 10 ? 'stock-low' : 'stock-ok'}">${item.stockLevel}</td>
                                    <td>${item.distributed}</td>
                                    <td>+${item.restocked}</td>
                                    <td>Rs${item.value.toFixed(2)}</td>
                                    <td>${item.lastUpdated}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <h2>Category Breakdown</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Items</th>
                                <th>Total Stock</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(reportData.reduce((acc, item) => {
                                if (!acc[item.category]) {
                                    acc[item.category] = { count: 0, stock: 0, value: 0 };
                                }
                                acc[item.category].count++;
                                acc[item.category].stock += item.stockLevel;
                                acc[item.category].value += item.value;
                                return acc;
                            }, {})).map(([category, data]) => `
                                <tr>
                                    <td>${category}</td>
                                    <td>${data.count}</td>
                                    <td>${data.stock}</td>
                                    <td>Rs${data.value.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="no-print" style="margin-top: 30px; text-align: center;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #fdc501; border: none; border-radius: 4px; cursor: pointer;">
                            Print / Save as PDF
                        </button>
                    </div>
                    
                    <script>
                        // Auto-open print dialog after a short delay
                        setTimeout(() => {
                            window.print();
                        }, 1000);
                    </script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
        } catch (error) {
            console.error("Error generating printable report:", error);
            alert("There was an error generating the report. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    // CSV Export function
    const handleExportCSV = () => {
        setIsGenerating(true);
        
        try {
            // Create CSV content
            const csvHeader = '"Item Code","Name","Category","Stock Level","Distributed","Restocked","Value (Rs)","Last Updated"\n';
            const csvRows = reportData.map(item => 
                `"${item.itemCode}","${item.name}","${item.category}","${item.stockLevel}","${item.distributed}","${item.restocked}","${item.value.toFixed(2)}","${item.lastUpdated}"`
            ).join('\n');
            
            const csvString = csvHeader + csvRows;
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Set download attributes
            link.setAttribute('href', url);
            link.setAttribute('download', `inventory-report-${filter}-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            
            // Trigger download
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setIsGenerating(false);
            }, 100);
        } catch (error) {
            console.error("Error exporting CSV:", error);
            alert("There was an error exporting to CSV. Please try again.");
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Inventory Report</h1>
                        <p className="text-gray-600 mt-2">
                            {filter === 'daily' && 'Today\'s Inventory Summary'}
                            {filter === 'weekly' && 'Last 7 Days Summary'}
                            {filter === 'monthly' && 'Last 30 Days Summary'}
                            {filter === 'custom' && 'Custom Period Summary'}
                        </p>
                    </div>
                    
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            <div className="mr-2">
                                <select 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5"
                                    id="export-format"
                                    disabled={isGenerating}
                                >
                                    <option value="pdf">PDF (Print)</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>
                            
                            <button
                                onClick={() => {
                                    const format = document.getElementById('export-format').value;
                                    if (format === 'csv') {
                                        handleExportCSV();
                                    } else {
                                        handlePrint();
                                    }
                                }}
                                disabled={isGenerating}
                                className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300 flex items-center"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Exporting...
                                    </>
                                ) : (
                                    'Export Report'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <ReportFilter 
                    activeFilter={filter} 
                    onFilterChange={setFilter}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                />
                <ReportSummary data={reportData} />
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-black">Loading report data...</div>
                    </div>
                ) : (
                    <ReportTable 
                        data={reportData}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                    />
                )}
            </div>
        </div>
    );
}
