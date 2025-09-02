import React, { useState, useEffect } from 'react';
import { TrendingDown, CreditCard, Calendar, ArrowDownRight } from 'lucide-react';
import { getTotalsByType, formatCurrency, getMonthlyData } from '../../utils/storage';
import '../../App.css';

const TotalExpenseCard = ({ dateRange = null }) => {
  const [totalExpense, setTotalExpense] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateExpense = () => {
      setIsLoading(true);
      
      // Get total expense for the specified date range or all time
      const expense = getTotalsByType('expense', dateRange);
      setTotalExpense(expense);
      
      // Calculate monthly change
      const monthlyData = getMonthlyData();
      const currentMonth = new Date().getMonth() + 1;
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      
      const currentExpense = monthlyData[currentMonth]?.expense || 0;
      const previousExpense = monthlyData[previousMonth]?.expense || 0;
      
      if (previousExpense > 0) {
        const change = ((currentExpense - previousExpense) / previousExpense) * 100;
        setMonthlyChange(change);
      } else {
        setMonthlyChange(0);
      }
      
      setIsLoading(false);
    };

    calculateExpense();
    
    // Listen for storage changes
    const handleStorageChange = () => calculateExpense();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dateRange]);

  const isIncreased = monthlyChange > 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-green-600 shadow-2xl hover:shadow-green-600/20 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-500">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent rounded-2xl"></div>
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-xl shadow-lg">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Total Expenses</h3>
            <p className="text-sm text-green-200 font-medium">
              {dateRange ? 'Selected Period' : 'All Time'}
            </p>
          </div>
        </div>
        <div className="bg-green-600 p-2 rounded-lg shadow-lg">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Amount */}
      <div className="relative mb-4">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        ) : (
          <>
            <p className="text-4xl font-bold text-white mb-2 tracking-tight">
              {formatCurrency(totalExpense)}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isIncreased 
                  ? 'bg-gray-800 text-gray-300 border border-gray-600' 
                  : 'bg-green-900 text-green-300 border border-green-500'
              }`}>
                <ArrowDownRight className={`h-3 w-3 ${
                  isIncreased ? 'rotate-0 text-gray-400' : 'rotate-180 text-green-400'
                }`} />
                <span>{Math.abs(monthlyChange).toFixed(1)}%</span>
              </div>
              <span className="text-sm text-gray-400 font-medium">vs last month</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between pt-4 border-t border-green-800">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4 text-green-400" />
          <span className="font-medium">Updated just now</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>

      {/* Motivational message */}
      <div className="relative mt-4 bg-green-900/30 backdrop-blur-sm rounded-lg p-3 border border-green-700">
        <p className="text-sm text-green-300 font-bold text-center uppercase tracking-wider">
          {totalExpense > 0 
            ? isIncreased 
              ? '⚠️ Expenses increased this month. Consider reviewing your budget!'
              : '👍 Good job! Your expenses decreased this month!'
            : '🎯 Start tracking expenses to manage your budget better!'
          }
        </p>
      </div>
    </div>
  );
};

export default TotalExpenseCard;

