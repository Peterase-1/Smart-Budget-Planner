// localStorage utility functions for Expense & Savings Visualizer

const STORAGE_KEYS = {
  TRANSACTIONS: 'expense_tracker_transactions',
  CATEGORIES: 'expense_tracker_categories',
  GOALS: 'expense_tracker_goals',
  SETTINGS: 'expense_tracker_settings'
};

// Default categories for expenses and income
const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#FF6B6B', icon: '🍽️' },
  { id: 'transport', name: 'Transportation', color: '#4ECDC4', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', color: '#45B7D1', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', color: '#96CEB4', icon: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', color: '#FFEAA7', icon: '💡' },
  { id: 'healthcare', name: 'Healthcare', color: '#DDA0DD', icon: '🏥' },
  { id: 'education', name: 'Education', color: '#98D8C8', icon: '📚' },
  { id: 'other', name: 'Other', color: '#F7DC6F', icon: '📦' }
];

const DEFAULT_INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', color: '#2ECC71', icon: '💼' },
  { id: 'freelance', name: 'Freelance', color: '#3498DB', icon: '💻' },
  { id: 'investment', name: 'Investment', color: '#9B59B6', icon: '📈' },
  { id: 'gift', name: 'Gift', color: '#E74C3C', icon: '🎁' },
  { id: 'other_income', name: 'Other Income', color: '#F39C12', icon: '💰' }
];

// Utility functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

// Storage functions
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return null;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
    return false;
  }
};

// Transaction functions
export const getTransactions = () => {
  return getFromStorage(STORAGE_KEYS.TRANSACTIONS) || [];
};

export const saveTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    id: generateId(),
    ...transaction,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  transactions.push(newTransaction);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  return newTransaction;
};

export const updateTransaction = (id, updates) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    return transactions[index];
  }
  return null;
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, filteredTransactions);
  return true;
};

// Category functions
export const getCategories = () => {
  const stored = getFromStorage(STORAGE_KEYS.CATEGORIES);
  if (!stored) {
    const defaultCategories = {
      expense: DEFAULT_EXPENSE_CATEGORIES,
      income: DEFAULT_INCOME_CATEGORIES
    };
    saveToStorage(STORAGE_KEYS.CATEGORIES, defaultCategories);
    return defaultCategories;
  }
  return stored;
};

export const addCategory = (type, category) => {
  const categories = getCategories();
  const newCategory = {
    id: generateId(),
    ...category
  };
  categories[type].push(newCategory);
  saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  return newCategory;
};

// Analytics functions
export const getTransactionsByDateRange = (startDate, endDate) => {
  const transactions = getTransactions();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
};

export const getTransactionsByCategory = (categoryId) => {
  const transactions = getTransactions();
  return transactions.filter(transaction => transaction.categoryId === categoryId);
};

export const getTotalsByType = (type, dateRange = null) => {
  let transactions = getTransactions();
  
  if (dateRange) {
    transactions = getTransactionsByDateRange(dateRange.start, dateRange.end);
  }
  
  return transactions
    .filter(transaction => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const getMonthlyData = (year = new Date().getFullYear()) => {
  const transactions = getTransactions();
  const monthlyData = {};
  
  // Initialize all months
  for (let i = 0; i < 12; i++) {
    const month = i + 1;
    monthlyData[month] = {
      income: 0,
      expense: 0,
      savings: 0
    };
  }
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    if (date.getFullYear() === year) {
      const month = date.getMonth() + 1;
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }
    }
  });
  
  // Calculate savings for each month
  Object.keys(monthlyData).forEach(month => {
    monthlyData[month].savings = monthlyData[month].income - monthlyData[month].expense;
  });
  
  return monthlyData;
};

export const getCategoryBreakdown = (type, dateRange = null) => {
  let transactions = getTransactions();
  const categories = getCategories();
  
  if (dateRange) {
    transactions = getTransactionsByDateRange(dateRange.start, dateRange.end);
  }
  
  const breakdown = {};
  const categoryMap = {};
  
  // Create category map for easy lookup
  categories[type].forEach(cat => {
    categoryMap[cat.id] = cat;
    breakdown[cat.id] = {
      ...cat,
      amount: 0,
      count: 0
    };
  });
  
  transactions
    .filter(transaction => transaction.type === type)
    .forEach(transaction => {
      if (breakdown[transaction.categoryId]) {
        breakdown[transaction.categoryId].amount += transaction.amount;
        breakdown[transaction.categoryId].count += 1;
      }
    });
  
  return Object.values(breakdown).filter(item => item.amount > 0);
};

// Goals functions
export const getGoals = () => {
  return getFromStorage(STORAGE_KEYS.GOALS) || [];
};

export const saveGoal = (goal) => {
  const goals = getGoals();
  const newGoal = {
    id: generateId(),
    ...goal,
    createdAt: new Date().toISOString()
  };
  goals.push(newGoal);
  saveToStorage(STORAGE_KEYS.GOALS, goals);
  return newGoal;
};

export const updateGoal = (id, updates) => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates };
    saveToStorage(STORAGE_KEYS.GOALS, goals);
    return goals[index];
  }
  return null;
};

// Settings functions
export const getSettings = () => {
  const defaultSettings = {
    currency: 'USD',
    theme: 'light',
    notifications: true,
    budgetAlerts: true
  };
  return getFromStorage(STORAGE_KEYS.SETTINGS) || defaultSettings;
};

export const updateSettings = (newSettings) => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...newSettings };
  saveToStorage(STORAGE_KEYS.SETTINGS, updatedSettings);
  return updatedSettings;
};

// Data export/import functions
export const exportData = () => {
  const data = {
    transactions: getTransactions(),
    categories: getCategories(),
    goals: getGoals(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.transactions) saveToStorage(STORAGE_KEYS.TRANSACTIONS, data.transactions);
    if (data.categories) saveToStorage(STORAGE_KEYS.CATEGORIES, data.categories);
    if (data.goals) saveToStorage(STORAGE_KEYS.GOALS, data.goals);
    if (data.settings) saveToStorage(STORAGE_KEYS.SETTINGS, data.settings);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Clear all data
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

