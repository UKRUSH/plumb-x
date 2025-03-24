'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  HomeIcon, 
  ChevronRightIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { generateInventoryPDF, printReport } from '@/utils/pdfGenerator';

// Enhanced Line Chart with more features and better tooltips
function EnhancedLineChart({ 
  data, 
  color = "#fdc501", 
  height = 250, 
  showAverage = false,
  secondaryData = null, // For comparison with previous period
  compareLabel = "Previous Period"
}) {
  if (!data || data.length === 0) return null;
  const [hoverPoint, setHoverPoint] = useState(null);
  const [hoverComparisonPoint, setHoverComparisonPoint] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Calculate the min and max values for proper scaling, including secondary data if present
  const allValues = [...data.map(d => d.value)];
  if (secondaryData) {
    allValues.push(...secondaryData.map(d => d.value));
  }
  
  const minValue = Math.min(...allValues) * 0.9;
  const maxValue = Math.max(...allValues) * 1.1;
  const range = maxValue - minValue;
  
  // Generate points for the primary line
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (((point.value - minValue) / range) * 80);
    return { x, y, ...point };
  });
  
  // Generate points for secondary comparison line if provided
  const secondaryPoints = secondaryData ? secondaryData.map((point, i) => {
    const x = (i / (secondaryData.length - 1)) * 100;
    const y = 100 - (((point.value - minValue) / range) * 80);
    return { x, y, ...point };
  }) : [];
  
  const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${linePoints} 100,100 0,100`;
  const gradientId = `line-gradient-${Math.random().toString(36).substring(2, 9)}`;
  const secondaryGradientId = `sec-line-gradient-${Math.random().toString(36).substring(2, 9)}`;
  
  // Calculate average line if needed
  const averageValue = showAverage ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length : null;
  const averageY = showAverage ? 100 - (((averageValue - minValue) / range) * 80) : null;
  
  // Generate animation effects for line paths
  useEffect(() => {
    setAnimationComplete(false);
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [data, secondaryData]);

  return (
    <div className="relative">
      <svg 
        width="100%" 
        height={height} 
        className="overflow-visible"
        onMouseLeave={() => {
          setHoverPoint(null);
          setHoverComparisonPoint(null);
        }}
      >
        {/* Define gradients */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
          
          {secondaryData && (
            <linearGradient id={secondaryGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.05" />
            </linearGradient>
          )}
        </defs>
        
        {/* Background grid with value labels */}
        {[0, 20, 40, 60, 80, 100].map(y => (
          <g key={`grid-${y}`}>
            <line
              x1="0"
              y1={y * 0.8}
              x2="100%"
              y2={y * 0.8}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray={y === 0 ? '0' : '3,3'}
            />
            <text
              x="0"
              y={y * 0.8 - 5}
              fontSize="9"
              fill="#6b7280"
              textAnchor="start"
            >
              {Math.round(maxValue - (y / 100) * range)}
            </text>
          </g>
        ))}
        
        {/* Month/period markers along x-axis */}
        {data.map((point, i) => (
          <line 
            key={`xline-${i}`}
            x1={(i / (data.length - 1)) * 100}
            y1={0}
            x2={(i / (data.length - 1)) * 100}
            y2={80}
            stroke={i % 2 === 0 ? '#f3f4f6' : 'transparent'}
            strokeWidth="8"
            strokeOpacity="0.5"
          />
        ))}
        
        {/* Area fill under secondary line if present */}
        {secondaryData && (
          <polygon
            points={secondaryPoints.map(p => `${p.x},${p.y}`).join(' ') + ' 100,100 0,100'}
            fill={`url(#${secondaryGradientId})`}
            style={{
              opacity: animationComplete ? 0.4 : 0,
              transition: 'opacity 1s ease-in'
            }}
          />
        )}
        
        {/* Area fill under the primary line */}
        <polygon
          points={areaPoints}
          fill={`url(#${gradientId})`}
          style={{
            opacity: animationComplete ? 1 : 0, 
            transition: 'opacity 0.8s ease-in'
          }}
        />
        
        {/* Average line if needed */}
        {showAverage && (
          <>
            <line
              x1="0"
              y1={averageY}
              x2="100%"
              y2={averageY}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            />
            <text
              x="100%"
              y={averageY - 5}
              fontSize="9"
              fill="#f59e0b"
              fontWeight="bold"
              textAnchor="end"
            >
              Avg: {Math.round(averageValue)}
            </text>
          </>
        )}
        
        {/* Secondary comparison line */}
        {secondaryData && (
          <>
            <polyline
              points={secondaryPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,3"
              style={{
                strokeDashoffset: animationComplete ? 0 : 100,
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
            
            {/* Data points for secondary line */}
            {secondaryPoints.map((point, i) => (
              <g key={`secondary-${i}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoverComparisonPoint === i ? 5 : 3}
                  fill="white"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoverComparisonPoint(i)}
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    opacity: animationComplete ? 1 : 0,
                    transform: `scale(${animationComplete ? 1 : 0})`
                  }}
                />
              </g>
            ))}
          </>
        )}
        
        {/* Main line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: animationComplete ? 'none' : '1000',
            strokeDashoffset: animationComplete ? '0' : '1000',
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoverPoint === i ? 7 : 5}
              fill={hoverPoint === i ? color : "white"}
              stroke={color}
              strokeWidth="2"
              onMouseEnter={() => setHoverPoint(i)}
              style={{
                cursor: 'pointer', 
                transition: 'all 0.3s',
                opacity: animationComplete ? 1 : 0,
                transform: `scale(${animationComplete ? 1 : 0})`
              }}
            />
            
            {/* X-axis labels */}
            <text
              x={point.x}
              y={height - 10}
              fontSize="9"
              textAnchor="middle"
              fill="#6b7280"
              fontWeight={hoverPoint === i ? "bold" : "normal"}
            >
              {point.label}
            </text>
          </g>
        ))}
        
        {/* Enhanced tooltip for primary data */}
        {hoverPoint !== null && (
          <g>
            <rect
              x={points[hoverPoint].x - 50}
              y={points[hoverPoint].y - 48}
              width="100"
              height={secondaryData && hoverComparisonPoint === hoverPoint ? "40" : "25"}
              rx="4"
              fill="#1f2937"
              opacity="0.95"
            />
            <text
              x={points[hoverPoint].x}
              y={points[hoverPoint].y - 32}
              fontSize="11"
              textAnchor="middle"
              fill="white"
              fontWeight="bold"
            >
              {points[hoverPoint].label}: {points[hoverPoint].value}
            </text>
            
            {/* Show comparison if secondary data point is also hovered */}
            {secondaryData && hoverComparisonPoint === hoverPoint && (
              <text
                x={points[hoverPoint].x}
                y={points[hoverPoint].y - 18}
                fontSize="10"
                textAnchor="middle"
                fill="#d1d5db"
              >
                {compareLabel}: {secondaryPoints[hoverPoint].value}
              </text>
            )}
          </g>
        )}
        
        {/* Tooltip for secondary data */}
        {hoverComparisonPoint !== null && hoverComparisonPoint !== hoverPoint && (
          <g>
            <rect
              x={secondaryPoints[hoverComparisonPoint].x - 50}
              y={secondaryPoints[hoverComparisonPoint].y - 40}
              width="100"
              height="25"
              rx="4"
              fill="#1f2937"
              opacity="0.95"
            />
            <text
              x={secondaryPoints[hoverComparisonPoint].x}
              y={secondaryPoints[hoverComparisonPoint].y - 25}
              fontSize="10"
              textAnchor="middle"
              fill="white"
            >
              {compareLabel}: {secondaryPoints[hoverComparisonPoint].value}
            </text>
          </g>
        )}
      </svg>
      
      {/* Chart legend */}
      {secondaryData && (
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#fdc501] rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Current Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#94a3b8] rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">{compareLabel}</span>
          </div>
          {showAverage && (
            <div className="flex items-center">
              <div className="w-6 h-0.5 bg-[#f59e0b] mr-2"></div>
              <span className="text-sm text-gray-700">Average</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced Bar Chart with hover effects, clearer labels, and increased spacing between bars
function EnhancedBarChart({ data, color = "#fdc501", height = 250 }) {
  if (!data || data.length === 0) return null;
  const [hoverBar, setHoverBar] = useState(null);
  
  const maxValue = Math.max(...data.map(item => item.value)) * 1.1;
  const barWidth = 100 / data.length;
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };
  
  return (
    <div className="relative">
      <svg 
        width="100%" 
        height={height} 
        className="overflow-visible" 
        onMouseLeave={() => setHoverBar(null)}
      >
        {/* Y-axis value grid lines */}
        {[0, 25, 50, 75, 100].map(percent => {
          const y = height - (percent / 100) * height * 0.8;
          return (
            <g key={`grid-${percent}`}>
              <line
                x1="0"
                y1={y}
                x2="100%"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray={percent === 0 ? '0' : '2,2'}
              />
              <text
                x="0"
                y={y - 5}
                fontSize="9"
                fill="#6b7280"
                textAnchor="start"
              >
                {formatNumber(Math.round((percent / 100) * maxValue))}
              </text>
            </g>
          );
        })}
        
        {/* Bars with increased spacing */}
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * height * 0.8;
          const gradientId = `bar-gradient-${i}`;
          const isHovered = hoverBar === i;
          
          // Adjust bar positioning and width for more spacing
          // Using 0.4 instead of 0.6 for bar width ratio to increase spacing
          const barWidthRatio = 0.4; 
          const barX = barWidth * (i + (1 - barWidthRatio) / 2);
          const actualBarWidth = barWidth * barWidthRatio;
          
          return (
            <g 
              key={i}
              onMouseEnter={() => setHoverBar(i)}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="1"/>
                  <stop offset="100%" stopColor={color} stopOpacity="0.6"/>
                </linearGradient>
              </defs>
              
              {/* Bar */}
              <rect
                x={`${barX}%`}
                y={height - barHeight - 20}
                width={`${actualBarWidth}%`}
                height={barHeight}
                rx="4"
                fill={`url(#${gradientId})`}
                stroke={isHovered ? "#1f2937" : "transparent"}
                strokeWidth="1.5"
                className="transition-all duration-300"
                style={{
                  transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                  transformOrigin: 'bottom'
                }}
              />
              
              {/* Tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={`${barX - 0.15 * barWidth}%`}
                    y={height - barHeight - 45}
                    width={`${actualBarWidth + 0.3 * barWidth}%`}
                    height="24"
                    rx="4"
                    fill="#1f2937"
                    opacity="0.9"
                  />
                  <text
                    x={`${barX + actualBarWidth/2}%`}
                    y={height - barHeight - 30}
                    fontSize="11"
                    textAnchor="middle"
                    fill="white"
                    fontWeight="bold"
                  >
                    {formatNumber(item.value)}
                  </text>
                </g>
              )}
              
              {/* X-axis labels */}
              <text
                x={`${barX + actualBarWidth/2}%`}
                y={height - 5}
                fontSize="9"
                textAnchor="middle"
                fill="#374151"
                fontWeight={isHovered ? "bold" : "normal"}
                transform={data.length > 8 ? `rotate(-30, ${barX + actualBarWidth/2}, ${height - 5})` : ''}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Interactive Pie Chart with better labels and hover effects
function InteractivePieChart({ data, height = 250, width = 250 }) {
  if (!data || data.length === 0) return null;
  const [activeSlice, setActiveSlice] = useState(null);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  // Center points and radius
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 15; // Smaller for better view
  const innerRadius = radius * 0.6; // For donut chart effect
  
  // Colors palette
  const colors = ['#fdc501', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];
  
  // Generate slices with more information
  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const startAngle = currentAngle;
    const endAngle = currentAngle + (percentage * Math.PI * 2);
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    currentAngle = endAngle;
    
    // Calculate path for arc
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    // Determine if we need large arc flag
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    // Enhanced path with donut effect
    const outerPath = [
      `M ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${centerX + innerRadius * Math.cos(endAngle)} ${centerY + innerRadius * Math.sin(endAngle)}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)}`,
      'Z'
    ].join(' ');
    
    const color = colors[index % colors.length];
    
    // Label positioning outside the pie
    const labelRadius = radius * 1.1;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);
    const textAnchor = labelX > centerX ? 'start' : 'end';
    
    return {
      path: outerPath,
      color,
      percentage,
      label: item.label,
      value: item.value,
      midAngle,
      labelX,
      labelY,
      textAnchor,
      index
    };
  });
  
  return (
    <div className="relative">
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto"
      >
        {/* Slices */}
        {slices.map((slice, i) => (
          <g key={i}>
            <path
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="1.5"
              onMouseEnter={() => setActiveSlice(i)}
              onMouseLeave={() => setActiveSlice(null)}
              opacity={activeSlice === null || activeSlice === i ? 1 : 0.5}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: activeSlice === i ? 'scale(1.03)' : 'scale(1)',
                transformOrigin: `${centerX}px ${centerY}px`
              }}
            />
          </g>
        ))}
        
        {/* Center info */}
        <text
          x={centerX}
          y={centerY - 10}
          fontSize="12"
          textAnchor="middle"
          fill="#4b5563"
          fontWeight="bold"
        >
          {activeSlice !== null ? slices[activeSlice].label : 'Total'}
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          fontSize="14"
          textAnchor="middle"
          fill="#111827"
          fontWeight="bold"
        >
          {activeSlice !== null ? 
            `${slices[activeSlice].value} (${Math.round(slices[activeSlice].percentage * 100)}%)` : 
            total
          }
        </text>
      </svg>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {slices.map((slice, i) => (
          <div 
            key={i} 
            className={`flex items-center p-1 rounded-md ${activeSlice === i ? 'bg-gray-100' : ''}`}
            onMouseEnter={() => setActiveSlice(i)}
            onMouseLeave={() => setActiveSlice(null)}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="w-4 h-4 rounded-sm mr-2" 
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-gray-800 font-medium">
              {slice.label} ({Math.round(slice.percentage * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InventoryAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv'); // Track export format: 'csv' or 'pdf'
  const [exportLoading, setExportLoading] = useState(false); // Separate loading state for export
  
  // Define data for different time ranges
  const timeRangeData = {
    week: {
      stockTrend: [
        { label: 'Mon', value: 150 },
        { label: 'Tue', value: 165 },
        { label: 'Wed', value: 145 },
        { label: 'Thu', value: 175 },
        { label: 'Fri', value: 180 },
        { label: 'Sat', value: 160 },
        { label: 'Sun', value: 170 }
      ],
      previousStockTrend: [
        { label: 'Mon', value: 120 },
        { label: 'Tue', value: 135 },
        { label: 'Wed', value: 130 },
        { label: 'Thu', value: 145 },
        { label: 'Fri', value: 155 },
        { label: 'Sat', value: 140 },
        { label: 'Sun', value: 150 }
      ],
      monthlySales: [
        { label: 'Mon', value: 800 },
        { label: 'Tue', value: 950 },
        { label: 'Wed', value: 1100 },
        { label: 'Thu', value: 980 },
        { label: 'Fri', value: 1300 },
        { label: 'Sat', value: 850 },
        { label: 'Sun', value: 600 }
      ],
      header: 'Last 7 days'
    },
    month: {
      stockTrend: [
        { label: 'Week 1', value: 150 },
        { label: 'Week 2', value: 165 },
        { label: 'Week 3', value: 145 },
        { label: 'Week 4', value: 175 }
      ],
      previousStockTrend: [
        { label: 'Week 1', value: 120 },
        { label: 'Week 2', value: 135 },
        { label: 'Week 3', value: 130 },
        { label: 'Week 4', value: 145 }
      ],
      monthlySales: [
        { label: 'Week 1', value: 3200 },
        { label: 'Week 2', value: 4100 },
        { label: 'Week 3', value: 3700 },
        { label: 'Week 4', value: 5400 }
      ],
      header: 'Last 4 weeks'
    },
    quarter: {
      stockTrend: [
        { label: 'Jan', value: 450 },
        { label: 'Feb', value: 480 },
        { label: 'Mar', value: 520 }
      ],
      previousStockTrend: [
        { label: 'Jan', value: 410 },
        { label: 'Feb', value: 430 },
        { label: 'Mar', value: 460 }
      ],
      monthlySales: [
        { label: 'Jan', value: 12400 },
        { label: 'Feb', value: 11800 },
        { label: 'Mar', value: 14100 }
      ],
      header: 'Last Quarter'
    },
    year: {
      stockTrend: [
        { label: 'Q1', value: 520 },
        { label: 'Q2', value: 580 },
        { label: 'Q3', value: 610 },
        { label: 'Q4', value: 650 }
      ],
      previousStockTrend: [
        { label: 'Q1', value: 460 },
        { label: 'Q2', value: 510 },
        { label: 'Q3', value: 550 },
        { label: 'Q4', value: 590 }
      ],
      monthlySales: [
        { label: 'Q1', value: 38200 },
        { label: 'Q2', value: 42100 },
        { label: 'Q3', value: 44700 },
        { label: 'Q4', value: 51400 }
      ],
      header: 'This Year'
    }
  };
  
  // Get current data based on selected time range
  const currentData = timeRangeData[timeRange];

  // Sample persistent data that doesn't change with time range
  const categoryDistribution = [
    { label: 'Pipes', value: 35 },
    { label: 'Fittings', value: 25 },
    { label: 'Valves', value: 20 },
    { label: 'Tools', value: 15 },
    { label: 'Fixtures', value: 5 }
  ];
  
  const supplierPerformance = [
    { label: 'SupplierA', value: 92 },
    { label: 'SupplierB', value: 78 },
    { label: 'SupplierC', value: 85 },
    { label: 'SupplierD', value: 90 },
    { label: 'SupplierE', value: 76 }
  ];

  const metrics = [
    { title: 'Total Items', value: '1,234', icon: <ChartBarIcon className="h-6 w-6 text-blue-500" />, change: '+3.2%', bgColor: 'bg-blue-50' },
    { title: 'Inventory Value', value: 'Rs52,234', icon: <CurrencyDollarIcon className="h-6 w-6 text-green-500" />, change: '+5.4%', bgColor: 'bg-green-50' },
    { title: 'Low Stock Items', value: '23', icon: <ArrowTrendingDownIcon className="h-6 w-6 text-red-500" />, change: '+2.1%', bgColor: 'bg-red-50' },
    { title: 'Turnover Rate', value: '3.4x', icon: <ClockIcon className="h-6 w-6 text-yellow-500" />, change: '+0.3', bgColor: 'bg-yellow-50' }
  ];
  
  // Toggle for comparison data
  const [compareEnabled, setCompareEnabled] = useState(false);
  
  // Update time range with loading animation
  const updateTimeRange = (range) => {
    if (range === timeRange) return;
    
    setIsLoading(true);
    setTimeRange(range);
    
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Replace the handleExportReport function with this simpler version
  const handleExportReport = () => {
    setExportLoading(true);
    
    // Prepare report title and data
    const reportTitle = `Inventory Analytics Report - ${currentData.header}`;
    
    try {
      if (exportFormat === 'csv') {
        // Keep existing CSV functionality
        downloadAsCSV({
          title: reportTitle,
          generatedAt: new Date().toLocaleString(),
          timeRange: currentData.header,
          metrics: metrics,
          stockTrend: currentData.stockTrend,
          salesData: currentData.monthlySales,
          categoryDistribution: categoryDistribution,
          supplierPerformance: supplierPerformance
        }, `inventory-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}`);
        
        setTimeout(() => {
          setExportLoading(false);
          alert("CSV exported successfully!");
        }, 500);
      } else {
        // Use the utility function for PDF generation
        generateInventoryPDF(
          // Transform our analytics data into a format the PDF generator can use
          currentData.stockTrend.map((item, i) => ({
            itemCode: `ST-${i+1}`,
            name: `Stock Item ${item.label}`,
            category: 'Stock',
            stockLevel: item.value,
            value: item.value * 10, // Example calculation
            lastUpdated: new Date().toLocaleDateString()
          })),
          reportTitle,
          currentData.header
        ).then(success => {
          if (!success) {
            // Fall back to the print method if PDF generation fails
            printReport(
              currentData.stockTrend.map((item, i) => ({
                itemCode: `ST-${i+1}`,
                name: `Stock Item ${item.label}`,
                category: 'Stock',
                stockLevel: item.value,
                value: item.value * 10,
                lastUpdated: new Date().toLocaleDateString()
              })),
              reportTitle
            );
          }
          setExportLoading(false);
        });
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      alert(`Export error: ${error.message || 'Unknown error'}`);
      setExportLoading(false);
    }
  };

  // Function to download data as CSV
  const downloadAsCSV = (data, filename) => {
    // Create CSV content
    const csvRows = [];
    
    // Add title and metadata
    csvRows.push(data.title);
    csvRows.push(`Generated: ${data.generatedAt}`);
    csvRows.push(`Time Range: ${data.timeRange}`);
    csvRows.push('');
    
    // Add metrics section
    csvRows.push('METRICS');
    csvRows.push('Title,Value,Change');
    data.metrics.forEach(m => {
      csvRows.push(`${m.title},${m.value},${m.change}`);
    });
    csvRows.push('');
    
    // Add stock trend section
    csvRows.push('STOCK TREND');
    csvRows.push('Label,Value');
    data.stockTrend.forEach(item => {
      csvRows.push(`${item.label},${item.value}`);
    });
    csvRows.push('');
    
    // Add sales data section
    csvRows.push('SALES DATA');
    csvRows.push('Label,Value');
    data.salesData.forEach(item => {
      csvRows.push(`${item.label},${item.value}`);
    });
    csvRows.push('');
    
    // Add category distribution section
    csvRows.push('CATEGORY DISTRIBUTION');
    csvRows.push('Category,Value');
    data.categoryDistribution.forEach(item => {
      csvRows.push(`${item.label},${item.value}`);
    });
    csvRows.push('');
    
    // Add supplier performance section
    csvRows.push('SUPPLIER PERFORMANCE');
    csvRows.push('Supplier,Score');
    data.supplierPerformance.forEach(item => {
      csvRows.push(`${item.label},${item.value}`);
    });
    
    // Combine into CSV string
    const csvString = csvRows.join('\n');
    
    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create URL for download
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Trigger download and cleanup
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // New function to use the browser's print functionality
  const printReport = (data) => {
    // Create a new window for the printable report
    const printWindow = window.open('', '_blank');
    
    // Create the content for the print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 5px;
          }
          h2 {
            font-size: 18px;
            color: #444;
            margin-top: 25px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .meta {
            font-size: 12px;
            color: #666;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .metric-card {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
          }
          .metric-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .metric-value {
            font-size: 18px;
          }
          .metric-change {
            font-size: 12px;
            color: green;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            h1, h2, p, table {
              page-break-inside: avoid;
            }
            h2 {
              margin-top: 20px;
            }
          }
        </style>
      </head>
      <body>
        <h1>${data.title}</h1>
        <div class="meta">
          <div>Generated: ${data.generatedAt}</div>
          <div>Time Range: ${data.timeRange}</div>
        </div>
        
        <h2>Key Metrics</h2>
        <div class="metrics-grid">
          ${data.metrics.map(metric => `
            <div class="metric-card">
              <div class="metric-title">${metric.title}</div>
              <div class="metric-value">${metric.value}</div>
              <div class="metric-change">${metric.change}</div>
            </div>
          `).join('')}
        </div>
        
        <h2>Inventory Stock Trend</h2>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Stock Level</th>
            </tr>
          </thead>
          <tbody>
            ${data.stockTrend.map(item => `
              <tr>
                <td>${item.label}</td>
                <td>${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2>Sales Volume</h2>
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            ${data.salesData.map(item => `
              <tr>
                <td>${item.label}</td>
                <td>${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2>Category Distribution</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${data.categoryDistribution.map(item => `
              <tr>
                <td>${item.label}</td>
                <td>${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h2>Supplier Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            ${data.supplierPerformance.map(item => `
              <tr>
                <td>${item.label}</td>
                <td>${item.value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <script>
          // Auto-trigger print dialog when the page loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-tools-pattern p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
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
                  Inventory Management
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Inventory Analytics</span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <DocumentChartBarIcon className="h-7 w-7 text-[#fdc501]" />
                <h1 className="text-3xl font-bold text-gray-900">Inventory Analytics</h1>
              </div>
              <p className="text-gray-600 mt-1">Track performance, monitor trends, and optimize your inventory</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => updateTimeRange('week')}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                  timeRange === 'week' ? 'bg-[#fdc501] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                Week
              </button>
              <button
                onClick={() => updateTimeRange('month')}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                  timeRange === 'month' ? 'bg-[#fdc501] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                Month
              </button>
              <button
                onClick={() => updateTimeRange('quarter')}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                  timeRange === 'quarter' ? 'bg-[#fdc501] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                Quarter
              </button>
              <button
                onClick={() => updateTimeRange('year')}
                className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${
                  timeRange === 'year' ? 'bg-[#fdc501] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                Year
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`py-2 px-1 ${
                  selectedTab === 'overview'
                    ? 'border-b-2 border-[#fdc501] text-[#fdc501]'
                    : 'text-gray-500 hover:text-[#fdc501] hover:border-[#fdc501]/30 hover:border-b-2'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('sales')}
                className={`py-2 px-1 ${
                  selectedTab === 'sales'
                    ? 'border-b-2 border-[#fdc501] text-[#fdc501]'
                    : 'text-gray-500 hover:text-[#fdc501] hover:border-[#fdc501]/30 hover:border-b-2'
                }`}
              >
                Sales Analysis
              </button>
              <button
                onClick={() => setSelectedTab('products')}
                className={`py-2 px-1 ${
                  selectedTab === 'products'
                    ? 'border-b-2 border-[#fdc501] text-[#fdc501]'
                    : 'text-gray-500 hover:text-[#fdc501] hover:border-[#fdc501]/30 hover:border-b-2'
                }`}
              >
                Product Performance
              </button>
              <button
                onClick={() => setSelectedTab('forecast')}
                className={`py-2 px-1 ${
                  selectedTab === 'forecast'
                    ? 'border-b-2 border-[#fdc501] text-[#fdc501]'
                    : 'text-gray-500 hover:text-[#fdc501] hover:border-[#fdc501]/30 hover:border-b-2'
                }`}
              >
                Forecast
              </button>
            </nav>
          </div>
        </div>
        
        {/* Overview Tab Content */}
        {selectedTab === 'overview' && (
          <>
            {/* Time Period Indicator */}
            <div className="bg-white rounded-xl shadow-md p-3 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-[#fdc501] mr-2" />
                  <h3 className="text-base font-medium text-gray-900">
                    Showing data for: <span className="font-bold">{currentData.header}</span>
                  </h3>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {metrics.map((metric, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-5">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                      <p className="text-2xl font-bold mt-1 text-gray-900">{metric.value}</p>
                    </div>
                    <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center text-green-500 text-xs font-medium">
                      <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                      <span>{metric.change}</span>
                    </div>
                    <span className="mx-2 text-gray-400 text-xs">from last month</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Primary Charts Row - Line and Bar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Enhanced Stock Trend Chart with Comparison Option */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Inventory Stock Trend</h3>
                  <div className="flex items-center">
                    <div className="mr-2 text-sm text-gray-500">Compare with previous</div>
                    <button 
                      onClick={() => setCompareEnabled(!compareEnabled)}
                      className={`w-10 h-5 ${compareEnabled ? 'bg-[#fdc501]' : 'bg-gray-300'} rounded-full relative transition-colors duration-300 ease-in-out`}
                    >
                      <div 
                        className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transform ${compareEnabled ? 'translate-x-5' : ''} transition-transform duration-300 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="h-72 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fdc501]"></div>
                  </div>
                ) : (
                  <>
                    <div className="h-72 relative">
                      <EnhancedLineChart 
                        data={currentData.stockTrend} 
                        color="#fdc501" 
                        height={275}
                        showAverage={true}
                        secondaryData={compareEnabled ? currentData.previousStockTrend : null}
                        compareLabel="Previous Period"
                      />
                    </div>
                    <div className="mt-4 border-t pt-4 border-gray-100">
                      <div className="flex items-center text-xs text-gray-600">
                        <ChartBarIcon className="h-4 w-4 mr-1 text-[#fdc501]" />
                        <span className="font-medium mr-1">Chart explanation:</span> 
                        This chart shows inventory stock levels over time. {compareEnabled ? 
                          'Yellow line shows current period, gray line shows previous period.' : 
                          'Toggle comparison to see previous period data.'}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Enhanced Bar Chart - Monthly Sales */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Sales Volume</h3>
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                </div>
                
                {isLoading ? (
                  <div className="h-72 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
                  </div>
                ) : (
                  <>
                    <div className="h-72 relative">
                      <EnhancedBarChart 
                        data={currentData.monthlySales} 
                        color="#10b981" 
                        height={275}
                      />
                    </div>
                    <div className="mt-4 border-t pt-4 border-gray-100">
                      <div className="flex items-center text-xs text-gray-600">
                        <ShoppingCartIcon className="h-4 w-4 mr-1 text-[#10b981]" />
                        <span className="font-medium mr-1">Chart explanation:</span> 
                        This chart shows total sales volume for each {timeRange === 'week' ? 'day' : 
                          timeRange === 'month' ? 'week' : 
                          timeRange === 'quarter' ? 'month' : 'quarter'}.
                        Hover over bars for exact values.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Interactive Pie Chart - Category Distribution */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Distribution by Category</h3>
                <div className="flex justify-center">
                  <InteractivePieChart 
                    data={categoryDistribution} 
                    height={275} 
                    width={275}
                  />
                </div>
                <div className="mt-4 border-t pt-4 border-gray-100">
                  <div className="flex items-center text-xs text-gray-600">
                    <DocumentChartBarIcon className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="font-medium mr-1">Chart explanation:</span> 
                    This donut chart shows how your inventory is distributed across different product categories.
                    Click on a category to highlight its proportion.
                  </div>
                </div>
              </div>
              
              {/* Enhanced Bar Chart - Supplier Performance */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Supplier Performance Ratings</h3>
                <div className="h-72 relative">
                  <EnhancedBarChart 
                    data={supplierPerformance} 
                    color="#8b5cf6" 
                    height={275}
                  />
                </div>
                <div className="mt-4 border-t pt-4 border-gray-100">
                  <div className="flex items-center text-xs text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-1 text-purple-500" />
                    <span className="font-medium mr-1">Chart explanation:</span> 
                    This bar chart shows performance ratings for each supplier (out of 100).
                    Higher scores indicate better delivery times, quality, and reliability.
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Analytics Insights & Recommendations</h3>
                
                {/* Export dropdown button */}
                <div className="relative inline-block">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <select 
                        className="text-sm border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[#fdc501]"
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        disabled={exportLoading}
                      >
                        <option value="csv">CSV Format</option>
                        <option value="pdf">Print as PDF</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={handleExportReport} 
                      className="bg-[#fdc501] text-black px-3 py-1.5 text-sm rounded-lg hover:bg-[#e3b101] flex items-center"
                      disabled={exportLoading}
                    >
                      {exportLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {exportFormat === 'csv' ? 'Exporting...' : 'Preparing Print...'}
                        </>
                      ) : (
                        <>
                          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                          {exportFormat === 'csv' ? 'Export CSV' : 'Print Report'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-green-50/30">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-green-600" />
                    Inventory Turnover
                  </h4>
                  <p className="text-gray-600 text-sm">Turnover rate is <span className="font-medium text-green-600">up 8%</span> from last quarter, indicating improved efficiency in stock management.</p>
                  <div className="mt-3 text-xs text-green-600 font-medium">Recommendation: Continue current practices</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-blue-50/30">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <ChartBarIcon className="h-4 w-4 mr-1 text-blue-600" />
                    Top Selling Items
                  </h4>
                  <p className="text-gray-600 text-sm">PVC Pipes and Copper Fittings remain the highest selling categories this month.</p>
                  <div className="mt-3 text-xs text-blue-600 font-medium">Recommendation: Maintain optimal stock levels</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50/30">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-yellow-600" />
                    Seasonal Trend
                  </h4>
                  <p className="text-gray-600 text-sm">Prepare for the upcoming season by stocking up on Valves and Fixtures based on last year's trends.</p>
                  <div className="mt-3 text-xs text-yellow-600 font-medium">Recommendation: Increase inventory by 15%</div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Other tabs placeholder */}
        {selectedTab !== 'overview' && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Analytics
            </h3>
            <p className="text-gray-500 mb-6">This section is under development. Check back soon for detailed {selectedTab} analytics.</p>
            <button
              onClick={() => setSelectedTab('overview')}
              className="px-4 py-2 bg-[#fdc501] text-white rounded-lg hover:bg-[#e3b101]"
            >
              Back to Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
