import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, Eye, EyeOff } from 'lucide-react';
import { getCategoryBreakdown, formatCurrency } from '../../utils/storage';
import '../../App.css';

const ExpensePieChart = ({ dateRange = null, height = 400 }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      const breakdown = getCategoryBreakdown('expense', dateRange);
      
      // Sort by amount descending
      const sortedData = breakdown
        .sort((a, b) => b.amount - a.amount)
        .map((item, index) => ({
          ...item,
          percentage: 0 // Will be calculated after we have total
        }));

      // Calculate percentages
      const total = sortedData.reduce((sum, item) => sum + item.amount, 0);
      const dataWithPercentages = sortedData.map(item => ({
        ...item,
        percentage: total > 0 ? (item.amount / total) * 100 : 0
      }));

      setData(dataWithPercentages);
      setIsLoading(false);
    };

    loadData();
    
    // Listen for storage changes
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dateRange]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-2xl border-2 border-green-500">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-4 h-4 rounded-full border border-gray-600"
              style={{ backgroundColor: data.color }}
            ></div>
            <span className="font-bold text-white uppercase tracking-wider">
              {data.icon} {data.name}
            </span>
          </div>
          <p className="text-lg font-bold text-green-300">
            {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-gray-300 font-medium">
            {data.percentage.toFixed(1)}% of total expenses
          </p>
          <p className="text-xs text-gray-400 font-medium">
            {data.count} transaction{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, index }) => {
    if (!showValues || percentage < 5) return null; // Don't show labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-bold drop-shadow-lg"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <PieChartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Expense Breakdown</h3>
              <p className="text-sm text-green-200">By category</p>
            </div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-700 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <PieChartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Expense Breakdown</h3>
              <p className="text-sm text-green-200">By category</p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <PieChartIcon className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">No Expenses Yet</h4>
          <p className="text-gray-300 font-medium">
            Start adding expenses to see your spending breakdown
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-md">
            <PieChartIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Expense Breakdown</h3>
            <p className="text-sm text-green-200">
              {dateRange ? 'Selected Period' : 'All Time'} • {data.length} categories
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowValues(!showValues)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-green-200 hover:text-white hover:bg-gray-700 rounded-lg transition-colors font-bold uppercase tracking-wider"
        >
          {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showValues ? 'Hide' : 'Show'} Values</span>
        </button>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="amount"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={hoveredIndex === index ? '#10b981' : 'none'}
                  strokeWidth={hoveredIndex === index ? 3 : 0}
                  style={{
                    filter: hoveredIndex === index ? 'brightness(1.1)' : 'none',
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease-in-out'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div 
            key={item.id}
            className={`flex items-center space-x-3 p-3 bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer border border-gray-600 ${
              hoveredIndex === index ? 'bg-gray-600 transform scale-105 border-green-500' : 'hover:bg-gray-600'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-500"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-bold text-white truncate uppercase tracking-wider">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-green-300">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-gray-400 font-bold">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gradient-to-r from-green-800 to-green-900 rounded-lg p-4 border border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-green-300 uppercase tracking-wider">Total Expenses</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-300 uppercase tracking-wider">Top Category</p>
            <p className="text-sm text-white font-bold">
              {data[0]?.icon} {data[0]?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePieChart;

