import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  Calendar, 
  Download, 
  Filter,
  PieChart,
  TrendingUp,
  FileText
} from 'lucide-react';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import SavingsLineChart from '../components/charts/SavingsLineChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import TotalIncomeCard from '../components/cards/TotalIncomeCard';
import TotalExpenseCard from '../components/cards/TotalExpenseCard';
import SavingsCard from '../components/cards/SavingsCard';
import { exportData } from '../utils/storage';
import '../App.css';

const Reports = ({ onNavigate }) => {
  const [dateRange, setDateRange] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDateRangeChange = (range) => {
    if (range === 'all') {
      setDateRange(null);
    } else {
      const today = new Date();
      let startDate;
      
      switch (range) {
        case 'week':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'quarter':
          const quarterStart = Math.floor(today.getMonth() / 3) * 3;
          startDate = new Date(today.getFullYear(), quarterStart, 1);
          break;
        case 'year':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        setDateRange({
          start: startDate.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        });
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'spending', label: 'Spending Analysis', icon: PieChart },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'detailed', label: 'Detailed Reports', icon: FileText }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl shadow-md">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Financial Reports 📈
                  </h1>
                  <p className="text-gray-600">
                    Comprehensive analysis of your financial data
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Date Range Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {dateRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Export Button */}
                <button
                  onClick={handleExportData}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TotalIncomeCard dateRange={dateRange} />
              <TotalExpenseCard dateRange={dateRange} />
              <SavingsCard dateRange={dateRange} />
            </div>
            
            {/* Monthly Overview */}
            <MonthlyBarChart height={400} />
          </div>
        )}

        {activeTab === 'spending' && (
          <div className="space-y-6">
            <ExpensePieChart dateRange={dateRange} height={500} />
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <SavingsLineChart height={500} />
            <MonthlyBarChart height={400} />
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TotalIncomeCard dateRange={dateRange} />
              <TotalExpenseCard dateRange={dateRange} />
              <SavingsCard dateRange={dateRange} />
            </div>
            
            {/* All Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ExpensePieChart dateRange={dateRange} height={400} />
              <SavingsLineChart height={400} />
            </div>
            
            <MonthlyBarChart height={400} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                📊 Data-Driven Financial Success! 
              </h3>
              <p className="text-gray-600">
                Use these insights to make informed decisions about your money. 
                Knowledge is power when it comes to personal finance! 💪
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Updated in real-time</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

