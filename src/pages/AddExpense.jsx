import React, { useState } from 'react';
import { TrendingDown, ArrowLeft, Lightbulb, CreditCard } from 'lucide-react';
import TransactionForm from '../components/forms/TransactionForm';
import TotalExpenseCard from '../components/cards/TotalExpenseCard';
import '../App.css';

const AddExpense = ({ onNavigate }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const expenseCategories = [
    { icon: '🍽️', title: 'Food & Dining', description: 'Restaurants, groceries, takeout' },
    { icon: '🚗', title: 'Transportation', description: 'Gas, public transport, rideshare' },
    { icon: '🛍️', title: 'Shopping', description: 'Clothes, electronics, personal items' },
    { icon: '🎬', title: 'Entertainment', description: 'Movies, games, subscriptions' },
    { icon: '💡', title: 'Bills & Utilities', description: 'Electricity, water, internet, phone' },
    { icon: '🏥', title: 'Healthcare', description: 'Medical, dental, pharmacy' }
  ];

  const budgetTips = [
    {
      icon: '📝',
      title: 'Track Every Expense',
      description: 'Even small purchases matter for your budget',
      color: 'blue'
    },
    {
      icon: '🎯',
      title: 'Categorize Wisely',
      description: 'Proper categorization helps identify spending patterns',
      color: 'purple'
    },
    {
      icon: '⏰',
      title: 'Record Immediately',
      description: 'Add expenses right after making them',
      color: 'green'
    },
    {
      icon: '📊',
      title: 'Review Regularly',
      description: 'Check your spending patterns weekly',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-green-100 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl shadow-md">
                  <TrendingDown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Add Expense 📊
                  </h1>
                  <p className="text-green-100">
                    Track your spending to make smarter financial decisions!
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-green-200 mb-1">Today's Date</p>
                  <p className="text-lg font-semibold text-white">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <TransactionForm 
              type="expense" 
              onSuccess={handleSuccess}
            />

            {/* Common Expense Categories */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Common Categories</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {expenseCategories.map((category, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-red-50 hover:from-red-50 hover:to-orange-50 rounded-lg border border-gray-200 hover:border-red-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{category.title}</p>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Tips */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Smart Spending Tips</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {budgetTips.map((tip, index) => (
                  <div 
                    key={index}
                    className={`flex items-start space-x-3 p-3 bg-gradient-to-r from-${tip.color}-50 to-${tip.color}-100 rounded-lg border border-${tip.color}-200 transition-all duration-200 hover:shadow-md`}
                  >
                    <span className="text-lg">{tip.icon}</span>
                    <div>
                      <p className={`font-medium text-${tip.color}-800`}>{tip.title}</p>
                      <p className={`text-sm text-${tip.color}-700`}>{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            {/* Current Expense Summary */}
            <TotalExpenseCard />

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200 shadow-lg animate-bounce">
                <div className="text-center">
                  <div className="bg-red-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    Expense Recorded! 📊
                  </h3>
                  <p className="text-red-700">
                    Good job staying on top of your spending!
                  </p>
                </div>
              </div>
            )}

            {/* Spending Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Spending Insights</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">💡 Did you know?</p>
                  <p className="text-sm text-blue-700">
                    The average person spends 40% of their income on necessities like food and housing.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-1">🎯 Goal</p>
                  <p className="text-sm text-green-700">
                    Try to keep discretionary spending under 30% of your income.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm font-medium text-purple-800 mb-1">📈 Tip</p>
                  <p className="text-sm text-purple-700">
                    Review your expenses weekly to identify areas for improvement.
                  </p>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 border border-orange-300 shadow-lg">
              <div className="text-center">
                <div className="bg-orange-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-orange-800 mb-2">
                  Smart Spending! 🧠
                </h3>
                <p className="text-orange-700 text-sm">
                  Tracking expenses is the first step to financial freedom. You're on the right path!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;

