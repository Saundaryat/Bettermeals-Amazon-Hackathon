import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import {
  ProfileHeader,
  ProfileTabs,
  UserSection,
  HouseholdSection,
  HouseholdDashboardInfo
} from "@/components/profile";

import { useAuth } from "@/hooks/useAuth";
import { useHouseholdDashboardInfo, QUERY_KEYS } from "@/hooks/useHouseholdData";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProfileProps {
  householdId?: string;
}

const Profile: React.FC<ProfileProps> = ({ householdId: propHouseholdId }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Use the prop if provided, otherwise fall back to the user's household ID
  const householdId = propHouseholdId || user?.household_id;
  const queryClient = useQueryClient();

  const { data: householdDashboardInfo, isLoading } = useHouseholdDashboardInfo(householdId || null);

  const [activeTab, setActiveTab] = React.useState<"users" | "household">("users");

  if (isLoading) {
    return <div className={profileStyles.container}>Loading profile...</div>;
  }

  if (!householdDashboardInfo) {
    return <div className={profileStyles.container}>No profile data available.</div>;
  }

  const { household, users } = householdDashboardInfo;

  const handleProfileUpdate = (updatedData: any) => {
    if (householdId) {
      // Optimistically update the cache or invalidate
      // Here we merge the update
      queryClient.setQueryData(QUERY_KEYS.dashboardInfo(householdId), (oldData: any) => ({
        ...oldData,
        ...updatedData
      }));
      // Also invalidate to be sure
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboardInfo(householdId) });
    }
  };

  const handleSignOut = async () => {
    await logout();
    localStorage.removeItem("weeklyMealPlan");
    localStorage.removeItem("householdDashboardInfo");
    navigate("/login");
  };

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.contentWrapper}>
        <ProfileHeader />

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className={profileStyles.content}>
          {activeTab === "users" ? (
            <UserSection
              users={users}
              onProfileUpdate={handleProfileUpdate}
            />
          ) : (
            <HouseholdSection
              household={household}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </main>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center pb-6">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all font-medium px-8"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
