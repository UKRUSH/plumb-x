export const sampleDashboardData = {
    overviewStats: {
        totalItems: 1250,
        totalValue: 750000,
        lowStockItems: 15,
        outOfStockItems: 5,
        expiringSoon: 8
    },
    categoryDistribution: [
        { category: 'Pipes', count: 450 },
        { category: 'Fittings', count: 320 },
        { category: 'Valves', count: 180 },
        { category: 'Tools', count: 150 },
        { category: 'Others', count: 150 }
    ],
    stockMovement: [
        { date: 'Jan', inflow: 120, outflow: 100 },
        { date: 'Feb', inflow: 140, outflow: 115 },
        { date: 'Mar', inflow: 160, outflow: 130 },
        { date: 'Apr', inflow: 180, outflow: 145 },
        { date: 'May', inflow: 200, outflow: 160 },
        { date: 'Jun', inflow: 220, outflow: 175 }
    ],
    topSellingItems: [
        { id: 1, name: 'PVC Pipe 1/2"', sold: 250, stock: 150 },
        { id: 2, name: 'Copper Fitting 3/4"', sold: 180, stock: 85 },
        { id: 3, name: 'Ball Valve 1"', sold: 150, stock: 45 },
        { id: 4, name: 'Pipe Wrench 14"', sold: 120, stock: 30 },
        { id: 5, name: 'PVC Elbow 1/2"', sold: 200, stock: 15 }
    ]
}; 