import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SidebarNavigation from './SidebarNavigation.tsx';
import BottomNavigation from './BottomNavigation';
import Planner from './meal_planner/Planner';
import Groceries from './groceries/Groceries.tsx';
import Profile from '../../pages/Profile';
import SetupPantry from './inventory/pantry/SetupPantry.tsx';
import { useHouseholdDashboardInfo } from '@/hooks/useHouseholdData';

import PendingActions from './actions/PendingActions';

interface DashboardLayoutProps {
  householdId?: string;
}

export default function DashboardLayout({
  householdId
}: DashboardLayoutProps) {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'planner' | 'groceries' | 'pantry' | 'profile' | 'actions') || 'planner';
  const [activeTab, setActiveTab] = useState<'planner' | 'groceries' | 'pantry' | 'profile' | 'actions'>(initialTab);

  const { data: dashboardInfo } = useHouseholdDashboardInfo(householdId || null);
  const canAccessAdvancedPages = dashboardInfo?.household?.type === 'pro' || dashboardInfo?.household?.type === 'advanced';

  // Fallback to planner if basic user tries to access advanced pages
  useEffect(() => {
    if (dashboardInfo && !canAccessAdvancedPages && (activeTab === 'actions' || activeTab === 'pantry')) {
      setActiveTab('planner');
    }
  }, [dashboardInfo, canAccessAdvancedPages, activeTab]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'actions':
        return canAccessAdvancedPages ? <PendingActions householdId={householdId} onNavigate={(tab) => setActiveTab(tab)} /> : <Planner householdId={householdId} />;
      case 'planner':
        return <Planner householdId={householdId} />;
      case 'groceries':
        return <Groceries householdId={householdId} />;
      case 'pantry':
        return canAccessAdvancedPages ? <SetupPantry householdId={householdId} /> : <Planner householdId={householdId} />;
      case 'profile':
        return <Profile householdId={householdId} />;
      default:
        return <Planner householdId={householdId} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar Navigation - Desktop Only */}
      <SidebarNavigation
        householdId={householdId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {renderActiveComponent()}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation
        householdId={householdId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
