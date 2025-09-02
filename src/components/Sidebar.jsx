import React from 'react';
import { 
  Home, 
  PlusCircle, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  Target,
  Wallet,
  Calendar,
  PieChart
} from 'lucide-react';
import '../App.css';

const Sidebar = ({ isOpen, currentPage, onPageChange, onClose }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'text-green-400',
      bgColor: 'bg-green-900',
      description: 'Overview & insights'
    },
    {
      id: 'add-income',
      label: 'Add Income',
      icon: TrendingUp,
      color: 'text-green-300',
      bgColor: 'bg-green-800',
      description: 'Record earnings'
    },
    {
      id: 'add-expense',
      label: 'Add Expense',
      icon: TrendingDown,
      color: 'text-green-500',
      bgColor: 'bg-gray-800',
      description: 'Track spending'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-900',
      description: 'Detailed analytics'
    }
  ];

  const quickStats = [
    {
      label: 'This Month',
      icon: Calendar,
      color: 'text-green-400'
    },
    {
      label: 'Categories',
      icon: PieChart,
      color: 'text-green-300'
    },
    {
      label: 'Goals',
      icon: Target,
      color: 'text-green-500'
    }
  ];

  const handleItemClick = (pageId) => {
    onPageChange(pageId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-gradient-to-b from-gray-900 via-black to-gray-900 shadow-2xl z-50 border-r-2 border-green-500">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Financial Hub
                </h2>
                <p className="text-sm text-green-200">
                  Manage your money smartly
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider px-3 mb-3">
                Navigation
              </h3>
              
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? `${item.bgColor} ${item.color} shadow-md transform scale-105 border border-green-400` 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-green-500 shadow-sm' 
                        : 'bg-gray-700 group-hover:bg-gray-600'
                      }
                    `}>
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${isActive ? 'font-semibold text-white' : 'text-gray-300'}`}>
                        {item.label}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-green-200' : 'text-gray-400'}`}>
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider px-3 mb-3">
                Quick Access
              </h3>
              <div className="space-y-2">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                    >
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-sm text-gray-300">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-xl p-4 border border-green-500">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    Stay on track! 🎯
                  </p>
                  <p className="text-xs text-green-200">
                    You're doing great with your finances
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

