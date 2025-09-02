import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-income':
        return <AddIncome onNavigate={handlePageChange} />;
      case 'add-expense':
        return <AddExpense onNavigate={handlePageChange} />;
      case 'reports':
        return <Reports onNavigate={handlePageChange} />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl shadow-xl mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Your Financial Dashboard
          </h2>
          <p className="text-green-100">
            Preparing your personalized expense tracker...
          </p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900">
      {/* Navbar */}
      <Navbar 
        onMenuToggle={handleMenuToggle}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onClose={handleSidebarClose}
        />

        {/* Main Content */}
        <div className="flex-1 ml-80 transition-all duration-300">
          <main className="min-h-[calc(100vh-4rem)]">
            {renderCurrentPage()}
          </main>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -10px, 0);
          }
          70% {
            transform: translate3d(0, -5px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default App;

