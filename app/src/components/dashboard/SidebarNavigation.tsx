import React from 'react';
import { Calendar, ShoppingCart, Search, User, Package, ClipboardList, Timer, Salad, Refrigerator } from 'lucide-react';
import { useHouseholdDashboardInfo } from '@/hooks/useHouseholdData';

interface SidebarNavigationProps {
  householdId?: string;
  activeTab: 'planner' | 'groceries' | 'pantry' | 'profile' | 'actions';
  onTabChange: (tab: 'planner' | 'groceries' | 'pantry' | 'profile' | 'actions') => void;
}

export default function SidebarNavigation({ householdId, activeTab, onTabChange }: SidebarNavigationProps) {
  const { data: dashboardInfo } = useHouseholdDashboardInfo(householdId || null);
  const canAccessAdvancedPages = dashboardInfo?.household?.type === 'pro' || dashboardInfo?.household?.type === 'advanced';

  const allNavigationItems = [
    {
      id: 'actions' as const,
      label: 'Actions',
      icon: Timer,
      description: 'Your weekly checklist'
    },
    {
      id: 'planner' as const,
      label: 'Meal Planner',
      icon: Salad,
      description: 'Plan your weekly meals'
    },
    {
      id: 'groceries' as const,
      label: 'Groceries',
      icon: ShoppingCart,
      description: 'View your shopping list'
    },
    {
      id: 'pantry' as const,
      label: 'Pantry',
      icon: Refrigerator,
      description: 'Setup your pantry'
    }
  ];

  // Filter items based on user type
  const mainNavigationItems = allNavigationItems.filter(item => {
    if (item.id === 'actions' || item.id === 'pantry') {
      return canAccessAdvancedPages;
    }
    return true;
  });

  const profileNavigationItem = {
    id: 'profile' as const,
    label: 'Profile',
    icon: User,
    description: 'Manage your account'
  };

  const handleTabChange = (tab: 'planner' | 'groceries' | 'pantry' | 'profile' | 'actions') => {
    onTabChange(tab);
  };

  return (
    <>
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-20 h-20 bg-[#f7e6cf] rounded-lg flex items-center justify-center">
              <img
                src="/app/images/icon2.png"
                alt="BetterMeals Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-black">BetterMeals</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {mainNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
                      ? 'bg-[#f7e6cf] text-black shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Section - Always visible at bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => handleTabChange(profileNavigationItem.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === profileNavigationItem.id
              ? 'bg-[#f7e6cf] text-black shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
          >
            <User className={`w-5 h-5 ${activeTab === profileNavigationItem.id ? 'text-black' : 'text-gray-500'}`} />
            <div className="flex-1">
              <div className="font-medium">{profileNavigationItem.label}</div>
              <div className="text-xs text-gray-500">{profileNavigationItem.description}</div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="text-xs text-gray-500 text-center">
            BetterMeals Dashboard v1.0
          </div>
        </div>
      </div>
    </>
  );
}
