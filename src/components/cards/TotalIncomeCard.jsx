import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import { getTotalsByType, formatCurrency, getMonthlyData } from '../../utils/storage';
import '../../App.css';

const TotalIncomeCard = ({ dateRange = null }) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateIncome = () => {
      setIsLoading(true);
      
      // Get total income for the specified date range or all time
      const income = getTotalsByType('income', dateRange);
      setTotalIncome(income);
      
      // Calculate monthly growth
      const monthlyData = getMonthlyData();
      const currentMonth = new Date().getMonth() + 1;
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      
      const currentIncome = monthlyData[currentMonth]?.income || 0;
      const previousIncome = monthlyData[previousMonth]?.income || 0;
      
      if (previousIncome > 0) {
        const growth = ((currentIncome - previousIncome) / previousIncome) * 100;
        setMonthlyGrowth(growth);
      } else {
        setMonthlyGrowth(0);
      }
      
      setIsLoading(false);
    };

    calculateIncome();
    
    // Listen for storage changes
    const handleStorageChange = () => calculateIncome();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dateRange]);

  const isPositiveGrowth = monthlyGrowth >= 0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-green-500 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-400">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-2xl"></div>
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Total Income</h3>
            <p className="text-sm text-green-200 font-medium">
              {dateRange ? 'Selected Period' : 'All Time'}
            </p>
          </div>
        </div>
        <div className="bg-green-500 p-2 rounded-lg shadow-lg">
          <DollarSign className="h-5 w-5 text-white" />
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
              {formatCurrency(totalIncome)}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPositiveGrowth 
                  ? 'bg-green-900 text-green-300 border border-green-500' 
                  : 'bg-gray-800 text-gray-300 border border-gray-600'
              }`}>
                <ArrowUpRight className={`h-3 w-3 ${
                  isPositiveGrowth ? 'rotate-0 text-green-400' : 'rotate-180 text-gray-400'
                }`} />
                <span>{Math.abs(monthlyGrowth).toFixed(1)}%</span>
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
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>

      {/* Motivational message */}
      <div className="relative mt-4 bg-green-900/30 backdrop-blur-sm rounded-lg p-3 border border-green-700">
        <p className="text-sm text-green-300 font-bold text-center uppercase tracking-wider">
          {totalIncome > 0 
            ? `🎉 Great job! You've earned ${formatCurrency(totalIncome)}!` 
            : '💪 Start tracking your income to see your progress!'
          }
        </p>
      </div>
    </div>
  );
};

export default TotalIncomeCard;

