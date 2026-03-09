import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";

const ProfileHeader: React.FC = () => {
  return (
    <div className="mb-6 lg:mb-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">
        User Dashboard
      </h1>
      <p className="text-black/70 text-sm lg:text-base">Manage your account and household settings.</p>
    </div>
  );
};

export default ProfileHeader;