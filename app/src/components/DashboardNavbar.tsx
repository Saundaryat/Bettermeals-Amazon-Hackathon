import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img 
              src="/app/images/icon2.png" 
              alt="BetterMeals Logo" 
              className="w-8 h-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-8 h-8 bg-[#51754f] rounded-lg flex items-center justify-center hidden">
              <span className="text-white font-bold text-sm">BM</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              better<span className="text-[#51754f]">meals</span>
            </span>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
