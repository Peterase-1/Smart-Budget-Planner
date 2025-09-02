import React, { useState, useEffect } from 'react';
import { PiggyBank, Target, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { getTotalsByType, formatCurrency, getMonthlyData } from '../../utils/storage';
import '../../App.css';

const SavingsCard = ({ dateRange = null }) => {
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateSavings = () => {
      setIsLoading(true);
      
      // Get totals for the specified date range or all time
      const income = getTotalsByType('income', dateRange);
      const expense = getTotalsByType('expense', dateRange);
      const savings = income - expense;
      
      setTotalSavings(savings);
      
      // Calculate savings rate
      if (income > 0) {
        setSavingsRate((savings / income) * 100);
      } else {
        setSavingsRate(0);
      }
      
      // Calculate monthly change
      const monthlyData = getMonthlyData();
      const currentMonth = new Date().getMonth() + 1;
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      
      const currentSavings = monthlyData[currentMonth]?.savings || 0;
      const previousSavings = monthlyData[previousMonth]?.savings || 0;
      
      if (previousSavings !== 0) {
        const change = ((currentSavings - previousSavings) / Math.abs(previousSavings)) * 100;
        setMonthlyChange(change);
      } else {
        setMonthlyChange(0);
      }
      
      setIsLoading(false);
    };

    calculateSavings();
    
    // Listen for storage changes
    const handleStorageChange = () => calculateSavings();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dateRange]);

  const isPositiveSavings = totalSavings >= 0;
  const isImprovedSavings = monthlyChange >= 0;

  const getSavingsMessage = () => {
    if (totalSavings === 0) {
      return '🎯 Start your savings journey today!';
    } else if (totalSavings > 0) {
      if (savingsRate >= 20) {
        return '🌟 Excellent! You\'re a savings superstar!';
      } else if (savingsRate >= 10) {
        return '👍 Great job! Keep up the good work!';
      } else {
        return '💪 Good start! Try to save a bit more!';
      }
    } else {
      return '⚠️ You\'re spending more than earning. Time to budget!';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-green-400 shadow-2xl hover:shadow-green-400/20 transition-all duration-300 transform hover:-translate-y-1 hover:border-green-300">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent rounded-2xl"></div>
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-3 rounded-xl shadow-lg">
            <PiggyBank className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Net Savings</h3>
            <p className="text-sm text-green-200 font-medium">
              {dateRange ? 'Selected Period' : 'All Time'}
            </p>
          </div>
        </div>
        <div className="bg-green-400 p-2 rounded-lg shadow-lg">
          <Target className="h-5 w-5 text-white" />
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
            <p className={`text-4xl font-bold mb-2 tracking-tight ${
              isPositiveSavings ? 'text-white' : 'text-gray-300'
            }`}>
              {formatCurrency(totalSavings)}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isImprovedSavings 
                  ? 'bg-green-900 text-green-300 border border-green-500' 
                  : 'bg-gray-800 text-gray-300 border border-gray-600'
              }`}>
                {isImprovedSavings ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-gray-400" />
                )}
                <span>{Math.abs(monthlyChange).toFixed(1)}%</span>
              </div>
              <span className="text-sm text-gray-400 font-medium">vs last month</span>
            </div>
          </>
        )}
      </div>

      {/* Savings Rate */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Savings Rate</span>
          <span className={`text-sm font-bold ${
            savingsRate >= 20 ? 'text-green-300' : 
            savingsRate >= 10 ? 'text-green-400' : 
            savingsRate >= 0 ? 'text-green-500' : 'text-gray-400'
          }`}>
            {savingsRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              savingsRate >= 20 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
              savingsRate >= 10 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
              savingsRate >= 0 ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-gray-600 to-gray-700'
            }`}
            style={{ width: `${Math.min(Math.abs(savingsRate), 100)}%` }}
          ></div>
        </div>
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
          {getSavingsMessage()}
        </p>
      </div>
    </div>
  );
};

export default SavingsCard;

