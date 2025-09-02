import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { getMonthlyData, formatCurrency } from '../../utils/storage';
import '../../App.css';

const MonthlyBarChart = ({ height = 400 }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('comparison'); // 'comparison' or 'net'

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
          // For better visualization, show expenses as positive values
          expenseDisplay: Math.abs(data.expense)
        };
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
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">{label} {selectedYear}</h4>
          <div className="space-y-2">
            {viewMode === 'comparison' ? (
              <>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-green-600 flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Income:
                  </span>
                  <span className="font-bold text-green-600">{formatCurrency(data.income)}</span>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-red-600 flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Expenses:
                  </span>
                  <span className="font-bold text-red-600">{formatCurrency(data.expense)}</span>
                </div>
                <div className="flex items-center justify-between space-x-4 pt-2 border-t">
                  <span className="text-blue-600 flex items-center font-semibold">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Net Savings:
                  </span>
                  <span className={`font-bold ${data.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.savings)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between space-x-4">
                <span className="text-blue-600 flex items-center font-semibold">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Net Savings:
                </span>
                <span className={`font-bold ${data.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(data.savings)}
                </span>
              </div>
            )}
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

  const calculateYearlyStats = () => {
    const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expense, 0);
    const totalSavings = totalIncome - totalExpenses;
    const avgMonthlySavings = data.length > 0 ? totalSavings / 12 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      avgMonthlySavings,
      savingsRate: totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const yearlyStats = calculateYearlyStats();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-md">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3>
            <p className="text-sm text-gray-600">Income vs Expenses</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'comparison' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => setViewMode('net')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'net' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Net
            </button>
          </div>
          
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Legend />
            
            {viewMode === 'comparison' ? (
              <>
                <Bar 
                  dataKey="income" 
                  fill="#10B981" 
                  name="Income"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expenseDisplay" 
                  fill="#EF4444" 
                  name="Expenses"
                  radius={[4, 4, 0, 0]}
                />
              </>
            ) : (
              <Bar 
                dataKey="savings" 
                fill="#3B82F6" 
                name="Net Savings"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Total Income</span>
          </div>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(yearlyStats.totalIncome)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Total Expenses</span>
          </div>
          <p className="text-lg font-bold text-red-600">
            {formatCurrency(yearlyStats.totalExpenses)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Net Savings</span>
          </div>
          <p className={`text-lg font-bold ${yearlyStats.totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(yearlyStats.totalSavings)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Avg Monthly</span>
          </div>
          <p className={`text-lg font-bold ${yearlyStats.avgMonthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(yearlyStats.avgMonthlySavings)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Savings Rate</span>
          </div>
          <p className={`text-lg font-bold ${yearlyStats.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {yearlyStats.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
        <p className="text-sm text-indigo-700 font-medium text-center">
          {yearlyStats.savingsRate >= 20 
            ? `🌟 Excellent! You're saving ${yearlyStats.savingsRate.toFixed(1)}% of your income!`
            : yearlyStats.savingsRate >= 10
            ? `👍 Good job! You're saving ${yearlyStats.savingsRate.toFixed(1)}% of your income!`
            : yearlyStats.savingsRate >= 0
            ? `💪 You're saving ${yearlyStats.savingsRate.toFixed(1)}% - try to reach 10% or more!`
            : `⚠️ You're spending more than you earn. Time to create a budget plan!`
          }
        </p>
      </div>
    </div>
  );
};

export default MonthlyBarChart;

