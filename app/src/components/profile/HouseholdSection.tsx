import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { updateHousehold } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
import { Household } from "./types";
import HouseholdDetail from "./HouseholdDetail";
import HouseholdEditForm from "./HouseholdEditForm";
import { useAuth } from "@/hooks/useAuth";
import LocalStorageManager from "@/lib/localStorageManager";
import { getChangedFields, HOUSEHOLD_FIELD_CONFIGS } from "@/lib/formUtils";

interface HouseholdSectionProps {
  household: Household;
  onProfileUpdate: (updatedData: any) => void;
}

const HouseholdSection: React.FC<HouseholdSectionProps> = ({ household, onProfileUpdate }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditingHousehold, setIsEditingHousehold] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [householdFormData, setHouseholdFormData] = React.useState<Partial<Household>>({});

  // Initialize household form data when edit mode is activated
  React.useEffect(() => {
    if (isEditingHousehold) {
      setHouseholdFormData({
        address: household.address,
        numberOfUsers: household.numberOfUsers,
        isCookAvailable: household.isCookAvailable,
        cookContact: household.cookContact,
        authEmail: household.authEmail,
        authPhoneNumber: household.authPhoneNumber,
        kitchenEquipments: [...household.kitchenEquipments]
      });
    }
  }, [isEditingHousehold, household]);

  const handleHouseholdFormChange = (field: keyof Household, value: any) => {
    setHouseholdFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: 'kitchenEquipments', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    handleHouseholdFormChange(field, items);
  };

  const handleSaveHousehold = async () => {
    setIsLoading(true);
    try {
      // Get only the fields that have changed
      const householdData = getChangedFields(householdFormData, household, HOUSEHOLD_FIELD_CONFIGS);

      // If no fields were modified, show a message and return
      if (Object.keys(householdData).length === 0) {
        toast({
          title: "No Changes",
          description: "No changes were made to save.",
        });
        setIsEditingHousehold(false);
        return;
      }

      // Update household using the new API
      const result = await updateHousehold(household.householdId, householdData);

      if (result.success) {
        // Update the local state with new data
        const updatedHousehold = {
          ...household,
          ...householdData
        };

        const updatedData = {
          household: updatedHousehold
        };

        // Call the callback to update parent state
        onProfileUpdate(updatedData);

        toast({
          title: "Success",
          description: "Household information updated successfully!",
        });
        setIsEditingHousehold(false);
      } else {
        throw new Error(result.error || "Failed to update household information");
      }
    } catch (error: any) {
      let errorMsg = "Failed to update household information. Please try again.";
      if (error.message?.includes("403") || error.message?.toLowerCase().includes("forbidden")) {
        errorMsg = "You are not authorized to perform this action. Please log in again or contact support.";
      } else if (error.message?.includes("Authentication failed")) {
        errorMsg = error.message;
      }
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      console.error('Error updating household:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingHousehold(false);
    setHouseholdFormData({});
  };

  return (
    <section className={profileStyles.card}>
      {/* Edit button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={profileStyles.cardTitle}>Household details</h3>
        {!isEditingHousehold ? (
          <button
            onClick={() => setIsEditingHousehold(true)}
            className={profileStyles.editButton}
          >
            Edit
          </button>
        ) : (
          <div className={profileStyles.buttonGroup}>
            <button
              onClick={handleSaveHousehold}
              disabled={isLoading}
              className={profileStyles.saveButton}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className={profileStyles.cancelButton}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {!isEditingHousehold ? (
        <HouseholdDetail household={household} />
      ) : (
        <HouseholdEditForm
          householdFormData={householdFormData}
          onFormChange={handleHouseholdFormChange}
          onArrayFieldChange={handleArrayFieldChange}
        />
      )}
    </section>
  );
};

export default HouseholdSection; 