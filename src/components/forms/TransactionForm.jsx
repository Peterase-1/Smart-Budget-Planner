import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Tag, 
  Save, 
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { saveTransaction, getCategories } from '../../utils/storage';
import '../../App.css';

const TransactionForm = ({ type, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadCategories = () => {
      const allCategories = getCategories();
      setCategories(allCategories[type] || []);
    };
    loadCategories();
  }, [type]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        type
      };

      saveTransaction(transaction);
      
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors({ submit: 'Failed to save transaction. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  if (showSuccess) {
    return (
      <div className="bg-gray-900 rounded-3xl p-10 shadow-2xl border-2 border-green-500 backdrop-blur-sm">
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {type === 'income' ? 'Income Added!' : 'Expense Added!'}
          </h3>
          <p className="text-green-200 mb-6">
            Your transaction has been successfully recorded.
          </p>
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500">
            <p className="text-2xl font-bold text-green-400 mb-2">
              ${parseFloat(formData.amount || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-300">{formData.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl border-2 border-green-500 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl shadow-xl">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Add {type === 'income' ? 'Income' : 'Expense'}
            </h2>
            <p className="text-green-200">
              Track your {type === 'income' ? 'earnings' : 'spending'}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Amount */}
        <div className="group">
          <label className="block text-sm font-semibold text-green-400 mb-3 uppercase tracking-wide">
            Amount *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`block w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-white text-lg placeholder-gray-500 ${
                errors.amount ? 'border-gray-600' : 'border-gray-700'
              } hover:border-green-500`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-2 text-sm text-gray-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="group">
          <label className="block text-sm font-semibold text-green-400 mb-3 uppercase tracking-wide">
            Description *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`block w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-white text-lg placeholder-gray-500 ${
                errors.description ? 'border-gray-600' : 'border-gray-700'
              } hover:border-green-500`}
              placeholder={`Enter ${type} description...`}
            />
          </div>
          {errors.description && (
            <p className="mt-2 text-sm text-gray-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="group">
          <label className="block text-sm font-semibold text-green-400 mb-3 uppercase tracking-wide">
            Category *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Tag className="h-6 w-6 text-green-500" />
            </div>
            <select
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              className={`block w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-white text-lg appearance-none ${
                errors.categoryId ? 'border-gray-600' : 'border-gray-700'
              } hover:border-green-500`}
            >
              <option value="" className="bg-gray-800 text-gray-400">Select a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          {errors.categoryId && (
            <p className="mt-2 text-sm text-gray-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.categoryId}
            </p>
          )}
          {selectedCategory && (
            <div className="mt-3 flex items-center space-x-3 bg-gray-800 rounded-xl p-3 border border-gray-700">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-200">
                {selectedCategory.icon} {selectedCategory.name}
              </span>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="group">
          <label className="block text-sm font-semibold text-green-400 mb-3 uppercase tracking-wide">
            Date *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`block w-full pl-12 pr-4 py-4 bg-gray-800 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-white text-lg ${
                errors.date ? 'border-gray-600' : 'border-gray-700'
              } hover:border-green-500`}
            />
          </div>
          {errors.date && (
            <p className="mt-2 text-sm text-gray-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.date}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-4">
            <p className="text-sm text-gray-300 flex items-center">
              <AlertCircle className="h-5 w-5 mr-3" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center space-x-3 py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
            isSubmitting
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 hover:scale-105'
          }`}
        >
          <Save className="h-6 w-6" />
          <span>
            {isSubmitting 
              ? 'Saving...' 
              : `Add ${type === 'income' ? 'Income' : 'Expense'}`
            }
          </span>
        </button>
      </form>

      {/* Motivational footer */}
      <div className="mt-8 bg-gradient-to-r from-gray-800 to-green-900 rounded-2xl p-6 border-2 border-green-500">
        <p className="text-sm text-center font-medium text-green-200">
          {type === 'income' 
            ? '💰 Every dollar earned brings you closer to financial freedom!'
            : '📊 Smart tracking leads to smarter spending decisions!'
          }
        </p>
      </div>
    </div>
  );
};

export default TransactionForm;

