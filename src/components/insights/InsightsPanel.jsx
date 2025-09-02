import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  getTransactions, 
  getCategoryBreakdown, 
  getMonthlyData, 
  formatCurrency,
  getTotalsByType 
} from '../../utils/storage';
import '../../App.css';

const InsightsPanel = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateInsights = () => {
      setIsLoading(true);
      
      const transactions = getTransactions();
      const monthlyData = getMonthlyData();
      const currentMonth = new Date().getMonth() + 1;
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      
      const currentMonthData = monthlyData[currentMonth];
      const previousMonthData = monthlyData[previousMonth];
      
      const totalIncome = getTotalsByType('income');
      const totalExpenses = getTotalsByType('expense');
      const expenseBreakdown = getCategoryBreakdown('expense');
      
      const newInsights = [];

      // Insight 1: Spending vs Income ratio
      if (totalIncome > 0) {
        const spendingRatio = (totalExpenses / totalIncome) * 100;
        if (spendingRatio > 90) {
          newInsights.push({
            id: 'high-spending',
            type: 'warning',
            icon: AlertTriangle,
            title: 'High Spending Alert',
            message: `You're spending ${spendingRatio.toFixed(1)}% of your income. Consider reducing expenses.`,
            color: 'text-gray-300',
            bgColor: 'bg-gray-800',
            borderColor: 'border-gray-600'
          });
        } else if (spendingRatio < 70) {
          newInsights.push({
            id: 'good-savings',
            type: 'success',
            icon: CheckCircle,
            title: 'Great Savings Rate!',
            message: `Excellent! You're only spending ${spendingRatio.toFixed(1)}% of your income.`,
            color: 'text-green-300',
            bgColor: 'bg-green-900',
            borderColor: 'border-green-500'
          });
        }
      }

      // Insight 2: Top spending category
      if (expenseBreakdown.length > 0) {
        const topCategory = expenseBreakdown[0];
        const totalExpenseAmount = expenseBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
        const categoryPercentage = (topCategory.amount / totalExpenseAmount) * 100;
        
        if (categoryPercentage > 40) {
          newInsights.push({
            id: 'top-category',
            type: 'info',
            icon: Target,
            title: 'Top Spending Category',
            message: `${categoryPercentage.toFixed(1)}% of your expenses go to ${topCategory.name} (${formatCurrency(topCategory.amount)})`,
            color: 'text-green-400',
            bgColor: 'bg-gray-800',
            borderColor: 'border-green-600'
          });
        }
      }

      // Insight 3: Monthly comparison
      if (currentMonthData && previousMonthData) {
        const savingsChange = currentMonthData.savings - previousMonthData.savings;
        const expenseChange = currentMonthData.expense - previousMonthData.expense;
        
        if (savingsChange > 0) {
          newInsights.push({
            id: 'savings-improvement',
            type: 'success',
            icon: TrendingUp,
            title: 'Savings Improved!',
            message: `Your savings increased by ${formatCurrency(savingsChange)} this month!`,
            color: 'text-green-300',
            bgColor: 'bg-green-900',
            borderColor: 'border-green-500'
          });
        } else if (savingsChange < -100) {
          newInsights.push({
            id: 'savings-decline',
            type: 'warning',
            icon: TrendingDown,
            title: 'Savings Declined',
            message: `Your savings decreased by ${formatCurrency(Math.abs(savingsChange))} this month.`,
            color: 'text-gray-300',
            bgColor: 'bg-gray-800',
            borderColor: 'border-gray-600'
          });
        }

        if (expenseChange > 200) {
          newInsights.push({
            id: 'expense-increase',
            type: 'warning',
            icon: TrendingUp,
            title: 'Expenses Increased',
            message: `Your expenses increased by ${formatCurrency(expenseChange)} compared to last month.`,
            color: 'text-gray-300',
            bgColor: 'bg-gray-800',
            borderColor: 'border-gray-600'
          });
        }
      }

      // Insight 4: Transaction frequency
      const thisMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const now = new Date();
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      });

      if (thisMonthTransactions.length > 50) {
        newInsights.push({
          id: 'frequent-transactions',
          type: 'info',
          icon: Calendar,
          title: 'Frequent Transactions',
          message: `You've made ${thisMonthTransactions.length} transactions this month. Consider consolidating similar expenses.`,
          color: 'text-green-400',
          bgColor: 'bg-gray-800',
          borderColor: 'border-green-600'
        });
      }

      // Insight 5: Savings goal suggestion
      if (totalIncome > 0 && totalExpenses > 0) {
        const currentSavingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
        if (currentSavingsRate < 20) {
          const recommendedSavings = totalIncome * 0.2;
          const currentSavings = totalIncome - totalExpenses;
          const additionalSavingsNeeded = recommendedSavings - currentSavings;
          
          if (additionalSavingsNeeded > 0) {
            newInsights.push({
              id: 'savings-goal',
              type: 'tip',
              icon: Target,
              title: 'Savings Goal Suggestion',
              message: `Try to save ${formatCurrency(additionalSavingsNeeded)} more to reach the recommended 20% savings rate.`,
              color: 'text-green-300',
              bgColor: 'bg-green-900',
              borderColor: 'border-green-500'
            });
          }
        }
      }

      // Default insight if no specific insights
      if (newInsights.length === 0) {
        newInsights.push({
          id: 'getting-started',
          type: 'tip',
          icon: Lightbulb,
          title: 'Getting Started',
          message: 'Add more transactions to get personalized insights about your spending patterns!',
          color: 'text-green-400',
          bgColor: 'bg-gray-800',
          borderColor: 'border-green-600'
        });
      }

      setInsights(newInsights);
      setIsLoading(false);
    };

    generateInsights();
    
    // Listen for storage changes
    const handleStorageChange = () => generateInsights();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return '🎉';
      case 'warning': return '⚠️';
      case 'info': return '📊';
      case 'tip': return '💡';
      default: return '📈';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Smart Insights</h3>
            <p className="text-sm text-green-200">AI-powered financial analysis</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-700 rounded-lg"></div>
          <div className="h-20 bg-gray-700 rounded-lg"></div>
          <div className="h-20 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-md">
          <Lightbulb className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Smart Insights</h3>
          <p className="text-sm text-green-200">
            AI-powered financial analysis • {insights.length} insight{insights.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div 
              key={insight.id}
              className={`${insight.bgColor} ${insight.borderColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gray-700 p-2 rounded-lg shadow-sm flex-shrink-0">
                  <Icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getInsightIcon(insight.type)}</span>
                    <h4 className={`font-bold uppercase tracking-wider ${insight.color}`}>
                      {insight.title}
                    </h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 bg-gradient-to-r from-green-800 to-green-900 rounded-lg p-4 border border-green-500">
        <div className="flex items-center justify-center space-x-2">
          <Lightbulb className="h-4 w-4 text-green-400" />
          <p className="text-sm text-green-200 font-medium">
            Insights update automatically as you add more transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;

