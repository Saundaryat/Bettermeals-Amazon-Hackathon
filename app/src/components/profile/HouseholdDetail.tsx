import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { Household } from "./types";

interface HouseholdDetailProps {
  household: Household;
}

const HouseholdDetail: React.FC<HouseholdDetailProps> = ({ household }) => {
  return (
    <div className="space-y-2 mt-4">
      <div className={profileStyles.detailRow}>
        <span className={profileStyles.detailKey}>Address</span>
        <span className={profileStyles.detailValue}>{household.address}</span>
      </div>
      <div className={profileStyles.detailRow}>
        <span className={profileStyles.detailKey}>Number of users</span>
        <span className={profileStyles.detailValue}>
          {household.numberOfUsers}
        </span>
      </div>
      <div className={profileStyles.detailRow}>
        <span className={profileStyles.detailKey}>Cook available</span>
        <span className={profileStyles.detailValue}>
          {household.isCookAvailable ? "Yes" : "No"}
        </span>
      </div>
      <div className={profileStyles.detailRow}>
        <span className={profileStyles.detailKey}>Cook contact</span>
        <span className={profileStyles.detailValue}>
          {household.cookContact}
        </span>
      </div>
      <div className={profileStyles.detailRow}>
        <span className={profileStyles.detailKey}>Phone Number</span>
        <span className={profileStyles.detailValue}>
          {household.authPhoneNumber || "Not provided"}
        </span>
      </div>
      <div className={profileStyles.detailRow}>
        <span className={profileStyles.detailKey}>Email Address</span>
        <span className={profileStyles.detailValue}>
          {household.authEmail || "Not provided"}
        </span>
      </div>
      <div className={profileStyles.detailRow}>
        <span className={profileStyles.detailKey}>Kitchen equipments</span>
        <span className={profileStyles.detailValue}>
          {household.kitchenEquipments.length
            ? household.kitchenEquipments.join(", ")
            : "None"}
        </span>
      </div>
    </div>
  );
};

export default HouseholdDetail; 