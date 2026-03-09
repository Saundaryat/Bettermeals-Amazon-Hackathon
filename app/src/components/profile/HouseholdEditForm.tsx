import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { Household } from "./types";

interface HouseholdEditFormProps {
  householdFormData: Partial<Household>;
  onFormChange: (field: keyof Household, value: any) => void;
  onArrayFieldChange: (field: 'kitchenEquipments', value: string) => void;
}

const HouseholdEditForm: React.FC<HouseholdEditFormProps> = ({
  householdFormData,
  onFormChange,
  onArrayFieldChange
}) => {
  return (
    <div className={profileStyles.formField}>
      <div>
        <label className={profileStyles.formLabel}>Address</label>
        <input
          type="text"
          value={householdFormData.address || ''}
          onChange={(e) => onFormChange('address', e.target.value)}
          className={profileStyles.formInput}
        />
      </div>
      <div>
        <label className={profileStyles.formLabel}>Number of Users</label>
        <input
          type="number"
          value={householdFormData.numberOfUsers || ''}
          onChange={(e) => onFormChange('numberOfUsers', parseInt(e.target.value))}
          className={profileStyles.formInput}
        />
      </div>
      <div>
        <label className={profileStyles.formLabel}>Cook Available</label>
        <select
          value={householdFormData.isCookAvailable?.toString() || ''}
          onChange={(e) => onFormChange('isCookAvailable', e.target.value === 'true')}
          className={profileStyles.formSelect}
        >
          <option value="">Select Option</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <div>
        <label className={profileStyles.formLabel}>Cook Contact</label>
        <input
          type="text"
          value={householdFormData.cookContact || ''}
          onChange={(e) => onFormChange('cookContact', e.target.value)}
          className={profileStyles.formInput}
        />
      </div>
      <div>
        <label className={profileStyles.formLabel}>Phone Number</label>
        <input
          type="text"
          value={householdFormData.authPhoneNumber || ''}
          disabled
          className={`${profileStyles.formInput} opacity-70 cursor-not-allowed`}
        />
      </div>
      <div>
        <label className={profileStyles.formLabel}>Email Address</label>
        <input
          type="text"
          value={householdFormData.authEmail || ''}
          disabled
          className={`${profileStyles.formInput} opacity-70 cursor-not-allowed`}
        />
      </div>

      <div>
        <label className={profileStyles.formLabel}>Kitchen Equipment (comma-separated)</label>
        <input
          type="text"
          value={householdFormData.kitchenEquipments?.join(', ') || ''}
          onChange={(e) => onArrayFieldChange('kitchenEquipments', e.target.value)}
          className={profileStyles.formInput}
          placeholder="e.g., Microwave, Oven, Blender, Air Fryer"
        />
      </div>
    </div>
  );
};

export default HouseholdEditForm; 