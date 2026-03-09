import React from 'react';

import { ShoppingCart, Timer, Salad, Refrigerator, User } from 'lucide-react';
import { useHouseholdDashboardInfo } from '@/hooks/useHouseholdData';

interface BottomNavigationProps {
  householdId?: string;
  activeTab: 'planner' | 'groceries' | 'pantry' | 'profile' | 'actions';
  onTabChange: (tab: 'planner' | 'groceries' | 'pantry' | 'profile' | 'actions') => void;
}

export default function BottomNavigation({ householdId, activeTab, onTabChange }: BottomNavigationProps) {
  const { data: dashboardInfo } = useHouseholdDashboardInfo(householdId || null);
  const canAccessAdvancedPages = dashboardInfo?.household?.type === 'pro' || dashboardInfo?.household?.type === 'advanced';

  const allNavigationItems = [
    {
      id: 'actions' as const,
      label: 'Actions',
      icon: Timer,
      activeColor: 'text-orange-500'
    },
    {
      id: 'planner' as const,
      label: 'Planner',
      icon: Salad,
      activeColor: 'text-orange-500'
    },
    {
      id: 'groceries' as const,
      label: 'Groceries',
      icon: ShoppingCart,
      activeColor: 'text-orange-500'
    },
    {
      id: 'pantry' as const,
      label: 'Pantry',
      icon: Refrigerator,
      activeColor: 'text-orange-500'
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      activeColor: 'text-orange-500'
    }
  ];

  // Filter items based on user type
  const navigationItems = allNavigationItems.filter(item => {
    if (item.id === 'actions' || item.id === 'pantry') {
      return canAccessAdvancedPages;
    }
    return true;
  });

  const handleTabClick = (tabId: string) => {
    // Direct mapping to the correct tabs
    onTabChange(tabId as 'planner' | 'groceries' | 'pantry' | 'profile' | 'actions');
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
            >
              <div className="relative">
                {/* Standard icon rendering */}
                <Icon
                  size={20}
                  className={isActive ? item.activeColor : 'text-gray-400'}
                />
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? item.activeColor : 'text-gray-400'
                }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
