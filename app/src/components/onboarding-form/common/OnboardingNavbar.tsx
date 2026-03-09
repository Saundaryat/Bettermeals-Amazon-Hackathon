import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface OnboardingNavbarProps {
  username: string;
}

export default function OnboardingNavbar({ username }: OnboardingNavbarProps) {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close logout menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showLogoutMenu && !target.closest('.user-menu')) {
        setShowLogoutMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutMenu]);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src="/app/images/icon2.webp"
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

          {/* User Section with Logout */}
          <div className="relative user-menu">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            >
              <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getUserInitials(username)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{username}</span>
            </div>

            {/* Logout Menu */}
            {showLogoutMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
