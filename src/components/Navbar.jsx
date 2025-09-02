import React, { useState } from 'react';
import { Menu, X, DollarSign, Settings, Download, Upload } from 'lucide-react';
import '../App.css';

const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = () => {
    // This will be implemented when we add the export functionality
    console.log('Export data');
    setShowExportMenu(false);
  };

  const handleImport = () => {
    // This will be implemented when we add the import functionality
    console.log('Import data');
    setShowExportMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-green-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu button and Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-xl backdrop-blur-sm shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">
                  Expense & Savings
                </h1>
                <p className="text-xs text-white/80">
                  Track Your Financial Journey
                </p>
              </div>
            </div>
          </div>

          {/* Center - Welcome message */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
              <p className="text-white font-medium">
                💰 Welcome to your financial dashboard! 
                <span className="ml-2 animate-pulse">✨</span>
              </p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Export/Import dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                aria-label="Data options"
              >
                <Download className="h-5 w-5" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-2xl border border-green-500 py-2 z-50">
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-green-900 hover:text-white flex items-center space-x-2 transition-all duration-200"
                  >
                    <Download className="h-4 w-4 text-green-400" />
                    <span>Export Data</span>
                  </button>
                  <button
                    onClick={handleImport}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-green-900 hover:text-white flex items-center space-x-2 transition-all duration-200"
                  >
                    <Upload className="h-4 w-4 text-green-400" />
                    <span>Import Data</span>
                  </button>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Current date */}
            <div className="hidden sm:block bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <p className="text-xs text-white/80">Today</p>
              <p className="text-sm font-semibold text-white">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile welcome message */}
      <div className="lg:hidden bg-white/10 backdrop-blur-sm mx-4 mb-4 rounded-lg px-4 py-2 border border-white/20">
        <p className="text-white text-sm text-center">
          💰 Welcome to your financial dashboard! ✨
        </p>
      </div>
    </nav>
  );
};

export default Navbar;

