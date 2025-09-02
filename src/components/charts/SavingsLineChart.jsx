import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { getMonthlyData, formatCurrency } from '../../utils/storage';
import '../../App.css';

const SavingsLineChart = ({ height = 400 }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState('line'); // 'line' or 'area'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      const monthlyData = getMonthlyData(selectedYear);
      
      // Convert to chart format
      const chartData = Object.keys(monthlyData).map(month => {
        const monthIndex = parseInt(month) - 1;
        const data = monthlyData[month];
        
        return {
          month: monthNames[monthIndex],
          monthNumber: parseInt(month),
          income: data.income,
          expense: data.expense,
          savings: data.savings,
          cumulativeSavings: 0 // Will be calculated below
        };
      });

      // Calculate cumulative savings
      let cumulative = 0;
      chartData.forEach(item => {
        cumulative += item.savings;
        item.cumulativeSavings = cumulative;
      });

      setData(chartData);
      setIsLoading(false);
    };

    loadData();
    
    // Listen for storage changes
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedYear]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-2xl border-2 border-green-500">
          <h4 className="font-bold text-white mb-2 uppercase tracking-wider">{label} {selectedYear}</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-green-400 flex items-center font-bold">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Income:
              </span>
              <span className="font-bold text-white">{formatCurrency(data.income)}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-green-600 flex items-center font-bold">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                Expenses:
              </span>
              <span className="font-bold text-white">{formatCurrency(data.expense)}</span>
            </div>
            <div className="flex items-center justify-between space-x-4 pt-2 border-t border-gray-700">
              <span className="text-green-300 flex items-center font-bold">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                Net Savings:
              </span>
              <span className={`font-bold ${data.savings >= 0 ? 'text-green-300' : 'text-gray-300'}`}>
                {formatCurrency(data.savings)}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-green-500 flex items-center font-bold">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Cumulative:
              </span>
              <span className={`font-bold ${data.cumulativeSavings >= 0 ? 'text-green-300' : 'text-gray-300'}`}>
                {formatCurrency(data.cumulativeSavings)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  const calculateStats = () => {
    const totalSavings = data.reduce((sum, item) => sum + item.savings, 0);
    const avgMonthlySavings = data.length > 0 ? totalSavings / data.length : 0;
    const bestMonth = data.reduce((best, current) => 
      current.savings > best.savings ? current : best, 
      { savings: -Infinity, month: '' }
    );
    const worstMonth = data.reduce((worst, current) => 
      current.savings < worst.savings ? current : worst, 
      { savings: Infinity, month: '' }
    );

    return {
      totalSavings,
      avgMonthlySavings,
      bestMonth: bestMonth.savings !== -Infinity ? bestMonth : null,
      worstMonth: worstMonth.savings !== Infinity ? worstMonth : null
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Savings Trend</h3>
              <p className="text-sm text-gray-600">Monthly overview</p>
            </div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Savings Trend</h3>
            <p className="text-sm text-gray-600">Monthly savings overview</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('line')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewType === 'line' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setViewType('area')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewType === 'area' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Area
            </button>
          </div>
          
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getAvailableYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeSavings" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="savings" 
                stroke="#3B82F6" 
                fill="url(#savingsGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Total {selectedYear}</span>
          </div>
          <p className={`text-lg font-bold ${stats.totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.totalSavings)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Avg Monthly</span>
          </div>
          <p className={`text-lg font-bold ${stats.avgMonthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.avgMonthlySavings)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Best Month</span>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {stats.bestMonth ? stats.bestMonth.month : 'N/A'}
          </p>
          <p className="text-sm font-bold text-emerald-600">
            {stats.bestMonth ? formatCurrency(stats.bestMonth.savings) : '$0'}
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-orange-600 rotate-180" />
            <span className="text-sm font-medium text-orange-700">Worst Month</span>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {stats.worstMonth ? stats.worstMonth.month : 'N/A'}
          </p>
          <p className="text-sm font-bold text-red-600">
            {stats.worstMonth ? formatCurrency(stats.worstMonth.savings) : '$0'}
          </p>
        </div>
      </div>

      {/* Motivational message */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-700 font-medium text-center">
          {stats.totalSavings > 0 
            ? `🎉 Great job! You saved ${formatCurrency(stats.totalSavings)} in ${selectedYear}!`
            : stats.totalSavings < 0
            ? `⚠️ You spent ${formatCurrency(Math.abs(stats.totalSavings))} more than you earned in ${selectedYear}. Time to budget!`
            : `📊 Start tracking your finances to see your savings trend!`
          }
        </p>
      </div>
    </div>
  );
};

export default SavingsLineChart;

