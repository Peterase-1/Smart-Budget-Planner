import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  Settings,
  DollarSign,
  Calendar
} from 'lucide-react';
import { 
  getCategoryBreakdown, 
  getTotalsByType, 
  formatCurrency,
  getSettings,
  updateSettings
} from '../../utils/storage';
import '../../App.css';

const BudgetAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [budgetLimits, setBudgetLimits] = useState({});
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Helper function to get appropriate icon for alert type
  const getInsightIcon = (type) => {
    switch (type) {
      case 'danger':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  useEffect(() => {
    const loadBudgetData = () => {
      setIsLoading(true);
      
      const settings = getSettings();
      const limits = settings.budgetLimits || {};
      setBudgetLimits(limits);
      
      // Get current month data
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const monthlyDateRange = {
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0]
      };
      
      const monthlyExpenses = getTotalsByType('expense', monthlyDateRange);
      const categoryBreakdown = getCategoryBreakdown('expense', monthlyDateRange);
      
      const newAlerts = [];

      // Check overall monthly budget
      if (limits.monthly && monthlyExpenses > 0) {
        const percentage = (monthlyExpenses / limits.monthly) * 100;
        
        if (percentage >= 100) {
          newAlerts.push({
            id: 'monthly-exceeded',
            type: 'danger',
            icon: AlertTriangle,
            title: 'Monthly Budget Exceeded!',
            message: `You've spent ${formatCurrency(monthlyExpenses)} this month, which is ${percentage.toFixed(1)}% of your ${formatCurrency(limits.monthly)} budget.`,
            color: 'text-gray-300',
            bgColor: 'bg-gray-800',
            borderColor: 'border-gray-600',
            progress: Math.min(percentage, 100)
          });
        } else if (percentage >= 80) {
          newAlerts.push({
            id: 'monthly-warning',
            type: 'warning',
            icon: AlertTriangle,
            title: 'Approaching Budget Limit',
            message: `You've used ${percentage.toFixed(1)}% of your monthly budget. ${formatCurrency(limits.monthly - monthlyExpenses)} remaining.`,
            color: 'text-green-400',
            bgColor: 'bg-gray-800',
            borderColor: 'border-green-600',
            progress: percentage
          });
        } else if (percentage >= 50) {
          newAlerts.push({
            id: 'monthly-info',
            type: 'info',
            icon: Info,
            title: 'Budget Update',
            message: `You've used ${percentage.toFixed(1)}% of your monthly budget. You're on track!`,
            color: 'text-green-300',
            bgColor: 'bg-green-900',
            borderColor: 'border-green-500',
            progress: percentage
          });
        }
      }

      // Check category budgets
      categoryBreakdown.forEach(category => {
        const categoryLimit = limits[`category_${category.id}`];
        if (categoryLimit && category.amount > 0) {
          const percentage = (category.amount / categoryLimit) * 100;
          
          if (percentage >= 100) {
            newAlerts.push({
              id: `category-${category.id}-exceeded`,
              type: 'danger',
              icon: AlertTriangle,
              title: `${category.name} Budget Exceeded`,
              message: `You've spent ${formatCurrency(category.amount)} on ${category.name}, exceeding your ${formatCurrency(categoryLimit)} limit.`,
              color: 'text-gray-300',
              bgColor: 'bg-gray-800',
              borderColor: 'border-gray-600',
              progress: Math.min(percentage, 100),
              category: category
            });
          } else if (percentage >= 80) {
            newAlerts.push({
              id: `category-${category.id}-warning`,
              type: 'warning',
              icon: AlertTriangle,
              title: `${category.name} Budget Warning`,
              message: `You've used ${percentage.toFixed(1)}% of your ${category.name} budget. ${formatCurrency(categoryLimit - category.amount)} remaining.`,
              color: 'text-green-400',
              bgColor: 'bg-gray-800',
              borderColor: 'border-green-600',
              progress: percentage,
              category: category
            });
          }
        }
      });

      // Positive reinforcement
      if (newAlerts.length === 0 && monthlyExpenses > 0) {
        newAlerts.push({
          id: 'all-good',
          type: 'success',
          icon: CheckCircle,
          title: 'Budget on Track!',
          message: 'Great job! You\'re staying within your budget limits this month.',
          color: 'text-green-300',
          bgColor: 'bg-green-900',
          borderColor: 'border-green-500'
        });
      }

      setAlerts(newAlerts.filter(alert => !dismissedAlerts.has(alert.id)));
      setIsLoading(false);
    };

    loadBudgetData();
    
    // Listen for storage changes
    const handleStorageChange = () => loadBudgetData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dismissedAlerts]);

  const handleDismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleUpdateBudget = (field, value) => {
    const newLimits = { ...budgetLimits, [field]: parseFloat(value) || 0 };
    setBudgetLimits(newLimits);
    
    const settings = getSettings();
    updateSettings({ ...settings, budgetLimits: newLimits });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-600 rounded-lg"></div>
            <div className="h-16 bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-md">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Budget Alerts</h3>
            <p className="text-sm text-green-200">
              {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-green-200 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Budget Settings</span>
        </button>
      </div>

      {/* Budget Settings */}
      {showSettings && (
        <div className="mb-6 bg-gray-900 rounded-xl p-4 border border-green-500">
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider">Set Budget Limits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-green-300 mb-2 uppercase tracking-wider">
                Monthly Budget Limit
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetLimits.monthly || ''}
                  onChange={(e) => handleUpdateBudget('monthly', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Enter monthly limit..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div 
              key={alert.id}
              className={`${alert.bgColor} ${alert.borderColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-md`}
              style={{ 
                animation: `slideInUp 0.5s ease-out ${index * 100}ms both`
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-gray-700 p-2 rounded-lg shadow-sm flex-shrink-0">
                    <Icon className={`h-5 w-5 ${alert.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getInsightIcon(alert.type)}</span>
                      <h4 className={`font-bold uppercase tracking-wider ${alert.color}`}>
                        {alert.title}
                      </h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-3 font-medium">
                      {alert.message}
                    </p>
                    
                    {/* Progress bar for budget alerts */}
                    {alert.progress && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Usage</span>
                          <span className={`text-xs font-bold ${
                            alert.progress >= 100 ? 'text-gray-300' : 
                            alert.progress >= 80 ? 'text-green-400' : 'text-green-300'
                          }`}>
                            {alert.progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              alert.progress >= 100 ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 
                              alert.progress >= 80 ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-green-400 to-green-500'
                            }`}
                            style={{ width: `${Math.min(alert.progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Category info */}
                    {alert.category && (
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-400 font-medium">
                          {alert.category.icon} {alert.category.name} • {alert.category.count} transactions
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDismissAlert(alert.id)}
                  className="p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {alerts.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">All Good! 🎉</h4>
          <p className="text-green-200">
            No budget alerts at the moment. Keep up the great work!
          </p>
        </div>
      )}

      {/* Footer tip */}
      <div className="mt-6 bg-gradient-to-r from-green-800 to-green-900 rounded-lg p-4 border border-green-500">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-green-400" />
          <p className="text-sm text-green-200 font-medium">
            💡 Set budget limits in settings to get personalized spending alerts
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetAlert;

