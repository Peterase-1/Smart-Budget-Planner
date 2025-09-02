import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { 
  getGoals, 
  saveGoal, 
  updateGoal, 
  getTotalsByType, 
  formatCurrency 
} from '../../utils/storage';
import '../../App.css';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [currentSavings, setCurrentSavings] = useState(0);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    targetDate: '',
    description: ''
  });

  useEffect(() => {
    const loadGoals = () => {
      setIsLoading(true);
      
      const savedGoals = getGoals();
      setGoals(savedGoals);
      
      // Calculate current total savings
      const income = getTotalsByType('income');
      const expenses = getTotalsByType('expense');
      setCurrentSavings(income - expenses);
      
      setIsLoading(false);
    };

    loadGoals();
    
    // Listen for storage changes
    const handleStorageChange = () => loadGoals();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddGoal = (e) => {
    e.preventDefault();
    
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) {
      return;
    }

    const goal = {
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      status: 'active'
    };

    saveGoal(goal);
    
    // Reset form
    setNewGoal({
      title: '',
      targetAmount: '',
      targetDate: '',
      description: ''
    });
    setShowAddForm(false);
    
    // Reload goals
    const updatedGoals = getGoals();
    setGoals(updatedGoals);
  };

  const handleUpdateGoal = (goalId, updates) => {
    updateGoal(goalId, updates);
    const updatedGoals = getGoals();
    setGoals(updatedGoals);
    setEditingGoal(null);
  };

  const calculateProgress = (goal) => {
    if (goal.targetAmount <= 0) return 0;
    return Math.min((currentSavings / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (goal) => {
    const progress = calculateProgress(goal);
    const daysRemaining = getDaysRemaining(goal.targetDate);
    
    if (progress >= 100) {
      return { status: 'completed', color: 'text-green-300', bgColor: 'bg-green-900', borderColor: 'border-green-500' };
    } else if (daysRemaining < 0) {
      return { status: 'overdue', color: 'text-gray-300', bgColor: 'bg-gray-800', borderColor: 'border-gray-600' };
    } else if (daysRemaining <= 30) {
      return { status: 'urgent', color: 'text-green-400', bgColor: 'bg-gray-800', borderColor: 'border-green-600' };
    } else {
      return { status: 'active', color: 'text-green-300', bgColor: 'bg-green-900', borderColor: 'border-green-500' };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-700 rounded-lg"></div>
            <div className="h-24 bg-gray-700 rounded-lg"></div>
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
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Financial Goals</h3>
            <p className="text-sm text-green-200">
              {goals.length} goal{goals.length !== 1 ? 's' : ''} • Current savings: {formatCurrency(currentSavings)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="mb-6 bg-gray-900 rounded-xl p-4 border border-green-500">
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-green-300 mb-2 uppercase tracking-wider">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="e.g., Emergency Fund, Vacation, New Car..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-green-300 mb-2 uppercase tracking-wider">
                  Target Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-green-300 mb-2 uppercase tracking-wider">
                  Target Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-green-300 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  placeholder="Optional description..."
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-bold uppercase tracking-wider"
              >
                <Save className="h-4 w-4" />
                <span>Save Goal</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors font-bold uppercase tracking-wider"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = calculateProgress(goal);
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const goalStatus = getGoalStatus(goal);
          const amountNeeded = Math.max(0, goal.targetAmount - currentSavings);
          
          return (
            <div 
              key={goal.id}
              className={`${goalStatus.bgColor} ${goalStatus.borderColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                      🎯 {goal.title}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${goalStatus.color} bg-gray-700 border border-gray-600`}>
                      {goalStatus.status === 'completed' ? 'Completed' :
                       goalStatus.status === 'overdue' ? 'Overdue' :
                       goalStatus.status === 'urgent' ? 'Urgent' : 'Active'}
                    </span>
                  </div>
                  
                  {goal.description && (
                    <p className="text-sm text-gray-300 mb-3 font-medium">{goal.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Target Amount</p>
                      <p className="font-bold text-white">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Current Savings</p>
                      <p className="font-bold text-green-400">{formatCurrency(currentSavings)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Amount Needed</p>
                      <p className={`font-bold ${amountNeeded > 0 ? 'text-gray-300' : 'text-green-400'}`}>
                        {formatCurrency(amountNeeded)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Days Remaining</p>
                      <p className={`font-bold ${
                        daysRemaining < 0 ? 'text-gray-300' : 
                        daysRemaining <= 30 ? 'text-green-400' : 'text-green-300'
                      }`}>
                        {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const updatedGoals = goals.filter(g => g.id !== goal.id);
                      setGoals(updatedGoals);
                      // Update storage
                      const allGoals = getGoals().filter(g => g.id !== goal.id);
                      localStorage.setItem('expense_tracker_goals', JSON.stringify(allGoals));
                    }}
                    className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                  <span className={`text-sm font-bold ${
                    progress >= 100 ? 'text-green-300' : 
                    progress >= 75 ? 'text-green-400' : 
                    progress >= 50 ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      progress >= 100 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                      progress >= 75 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      progress >= 50 ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Goal Status Message */}
              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center space-x-2">
                  {progress >= 100 ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : daysRemaining < 0 ? (
                    <Clock className="h-5 w-5 text-gray-400" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  )}
                  <p className={`text-sm font-bold ${goalStatus.color} uppercase tracking-wider`}>
                    {progress >= 100 
                      ? `🎉 Congratulations! You've reached your goal!`
                      : daysRemaining < 0
                      ? `⏰ This goal is ${Math.abs(daysRemaining)} days overdue`
                      : daysRemaining <= 30
                      ? `⚡ Only ${daysRemaining} days left! You need ${formatCurrency(amountNeeded)} more`
                      : `💪 Keep going! You need ${formatCurrency(amountNeeded)} more in ${daysRemaining} days`
                    }
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="bg-green-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">No Goals Yet</h4>
          <p className="text-gray-300 mb-4 font-medium">
            Set financial goals to stay motivated and track your progress!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg mx-auto font-bold uppercase tracking-wider"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your First Goal</span>
          </button>
        </div>
      )}

      {/* Motivational Footer */}
      {goals.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-green-800 to-green-900 rounded-lg p-4 border border-green-500">
          <div className="flex items-center justify-center space-x-2">
            <Target className="h-4 w-4 text-green-400" />
            <p className="text-sm text-green-300 font-bold uppercase tracking-wider">
              🌟 Every step towards your goals is progress worth celebrating!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;

