import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";

interface ProfileTabsProps {
  activeTab: "users" | "household";
  onTabChange: (tab: "users" | "household") => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={profileStyles.tabNavigation}>
      <button
        onClick={() => onTabChange("users")}
        className={`${profileStyles.tabItem} ${activeTab === "users" ? profileStyles.tabItemActive : ""}`}
      >
        Users
      </button>
      <button
        onClick={() => onTabChange("household")}
        className={`${profileStyles.tabItem} ${activeTab === "household" ? profileStyles.tabItemActive : ""}`}
      >
        Household Info
      </button>
    </div>
  );
};

export default ProfileTabs;