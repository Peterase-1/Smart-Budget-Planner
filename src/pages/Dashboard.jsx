import React from 'react';
import TotalIncomeCard from '../components/cards/TotalIncomeCard';
import TotalExpenseCard from '../components/cards/TotalExpenseCard';
import SavingsCard from '../components/cards/SavingsCard';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import SavingsLineChart from '../components/charts/SavingsLineChart';
import InsightsPanel from '../components/insights/InsightsPanel';
import BudgetAlert from '../components/insights/BudgetAlert';
import GoalTracker from '../components/insights/GoalTracker';
import { BarChart3, PieChart, TrendingUp, Lightbulb } from 'lucide-react';
import '../App.css';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome to Your Financial Dashboard! 🎉
                </h1>
                <p className="text-green-100">
                  Track your income, expenses, and savings all in one place. Let's make your money work for you!
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl">
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TotalIncomeCard />
          <TotalExpenseCard />
          <SavingsCard />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Expense Breakdown */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Spending Analysis</h2>
            </div>
            <ExpensePieChart height={350} />
          </div>

          {/* Savings Trend */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Savings Trend</h2>
            </div>
            <SavingsLineChart height={350} />
          </div>
        </div>

        {/* Insights and Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Smart Insights */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-400 to-green-500 p-2 rounded-lg">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Smart Insights</h2>
            </div>
            <InsightsPanel />
          </div>

          {/* Budget Alerts */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-700 to-green-800 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Budget Alerts</h2>
            </div>
            <BudgetAlert />
          </div>
        </div>

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Financial Goals</h2>
          </div>
          <GoalTracker />
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 rounded-xl border border-green-500 transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-green-500 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Add Income</p>
                <p className="text-sm text-green-200">Record earnings</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl border border-gray-600 transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-green-600 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white rotate-180" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Add Expense</p>
                <p className="text-sm text-gray-300">Track spending</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-800 to-green-900 hover:from-green-700 hover:to-green-800 rounded-xl border border-green-500 transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-green-500 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">View Reports</p>
                <p className="text-sm text-green-200">Detailed analysis</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl border border-gray-600 transition-all duration-200 transform hover:-translate-y-1">
              <div className="bg-green-500 p-2 rounded-lg">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Get Insights</p>
                <p className="text-sm text-gray-300">Smart tips</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

