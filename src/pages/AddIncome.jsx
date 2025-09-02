import React, { useState } from 'react';
import { TrendingUp, ArrowLeft, Lightbulb, DollarSign } from 'lucide-react';
import TransactionForm from '../components/forms/TransactionForm';
import TotalIncomeCard from '../components/cards/TotalIncomeCard';
import '../App.css';

const AddIncome = ({ onNavigate }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const incomeIdeas = [
    { icon: '💼', title: 'Salary', description: 'Regular monthly/weekly salary' },
    { icon: '💻', title: 'Freelance', description: 'Project-based work income' },
    { icon: '📈', title: 'Investments', description: 'Dividends, interest, capital gains' },
    { icon: '🎁', title: 'Gifts', description: 'Money received as gifts' },
    { icon: '💰', title: 'Side Hustle', description: 'Additional income sources' },
    { icon: '🏠', title: 'Rental', description: 'Property rental income' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl shadow-md">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Add Income 💰
                  </h1>
                  <p className="text-gray-600">
                    Record your earnings and watch your financial progress grow!
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Today's Date</p>
                  <p className="text-lg font-semibold text-gray-800">
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
              type="income" 
              onSuccess={handleSuccess}
            />

            {/* Income Ideas */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Income Ideas</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incomeIdeas.map((idea, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-green-50 hover:from-green-50 hover:to-emerald-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <span className="text-2xl">{idea.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{idea.title}</p>
                      <p className="text-sm text-gray-600">{idea.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            {/* Current Income Summary */}
            <TotalIncomeCard />

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg animate-bounce">
                <div className="text-center">
                  <div className="bg-green-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">
                    Income Added! 🎉
                  </h3>
                  <p className="text-green-700">
                    Great job tracking your earnings!
                  </p>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Pro Tips</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-lg">💡</span>
                  <div>
                    <p className="font-medium text-blue-800">Track Everything</p>
                    <p className="text-sm text-blue-700">
                      Record all income sources, even small amounts add up!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-lg">📊</span>
                  <div>
                    <p className="font-medium text-green-800">Regular Updates</p>
                    <p className="text-sm text-green-700">
                      Update your income regularly to see accurate trends
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="font-medium text-purple-800">Set Goals</p>
                    <p className="text-sm text-purple-700">
                      Use your income data to set realistic savings goals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border border-green-300 shadow-lg">
              <div className="text-center">
                <div className="bg-green-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  Every Dollar Counts! 💪
                </h3>
                <p className="text-green-700 text-sm">
                  You're building a stronger financial future with every income entry. Keep it up!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIncome;

