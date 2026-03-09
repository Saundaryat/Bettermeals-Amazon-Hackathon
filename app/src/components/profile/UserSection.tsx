import React from "react";
import { z } from "zod";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { updateUserProfile } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
import { User } from "./types";
import UserList from "./UserList";
import UserDetail from "./UserDetail";
import UserEditForm from "./UserEditForm";
import { useAuth } from "@/hooks/useAuth";
import { getChangedFields, USER_PROFILE_FIELD_CONFIGS } from "@/lib/formUtils";

// Define Zod schema for user profile validation
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  age: z.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120").optional().or(z.literal('')),
  weight: z.number().min(1, "Weight must be at least 1kg").max(500, "Weight must be less than 500kg").optional().or(z.literal('')),
  height: z.number().min(1, "Height must be at least 1cm").max(300, "Height must be less than 300cm").optional().or(z.literal('')),
  whatsappNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits").regex(/^\+?\d+$/, "Phone number must contain only digits").optional().or(z.literal('')),
});


interface UserSectionProps {
  users: User[];
  onProfileUpdate: (updatedData: any) => void;
}

const UserSection: React.FC<UserSectionProps> = ({ users, onProfileUpdate }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = React.useState<string>(users?.[0]?.userId || "");
  const [isEditingUser, setIsEditingUser] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [userFormData, setUserFormData] = React.useState<Partial<User>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Safety check for users array
  if (!users || users.length === 0) {
    return (
      <div className={profileStyles.mainLayout}>
        <div className="text-center py-8">
          <p className="text-gray-500">No users found in this household.</p>
        </div>
      </div>
    );
  }

  const selectedUser = React.useMemo(
    () => users.find((u) => u.userId === selectedUserId),
    [users, selectedUserId]
  );

  // Initialize form data when user changes or edit mode is activated
  React.useEffect(() => {
    if (selectedUser && isEditingUser) {
      setUserFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        whatsappNumber: selectedUser.whatsappNumber,
        age: selectedUser.age,
        height: selectedUser.height,
        weight: selectedUser.weight,
        gender: selectedUser.gender,
        goals: [...selectedUser.goals],
        allergies: [...selectedUser.allergies],
        majorDislikes: [...selectedUser.majorDislikes],
        activityLevel: selectedUser.activityLevel,
        mealSchedule: { ...selectedUser.mealSchedule }
      });
    }
  }, [selectedUser, isEditingUser]);

  const handleUserFormChange = (field: keyof User, value: any) => {
    setUserFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: 'goals' | 'allergies' | 'majorDislikes', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    handleUserFormChange(field, items);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);

    setErrors({}); // Clear previous errors

    try {
      // Validate form data
      const validationResult = userSchema.safeParse(userFormData);

      if (!validationResult.success) {
        const newErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Extract healthReport file before comparing fields (File objects can't be compared)
      const healthReportFile = userFormData.healthReport as File | undefined;
      const formDataWithoutFile = { ...userFormData };
      delete (formDataWithoutFile as any).healthReport;

      // Get only the fields that have changed
      const userData = getChangedFields(formDataWithoutFile, selectedUser, USER_PROFILE_FIELD_CONFIGS);

      // If no fields were modified AND no health report file, show a message and return
      if (Object.keys(userData).length === 0 && !healthReportFile) {
        toast({
          title: "No Changes",
          description: "No changes were made to save.",
        });
        setIsEditingUser(false);
        return;
      }

      // Update user profile using the new API
      const result = await updateUserProfile(selectedUser.userId, userData, healthReportFile);

      if (result.success) {
        // Update the local state with new data
        const updatedUsers = users.map(user =>
          user.userId === selectedUser.userId
            ? {
              ...user,
              ...userData,
            }
            : user
        );

        const updatedData = {
          users: updatedUsers
        };

        // Call the callback to update parent state
        onProfileUpdate(updatedData);

        toast({
          title: "Success",
          description: "User information updated successfully!",
        });
        setIsEditingUser(false);
      } else {
        throw new Error(result.error || "Failed to update user information");
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user information. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingUser(false);
    setUserFormData({});
    setErrors({});
  };

  return (
    <div className={profileStyles.mainLayout}>
      {/* Sub‑tabs: user list */}
      <UserList
        users={users}
        selectedUserId={selectedUserId}
        onUserSelect={setSelectedUserId}
      />

      {/* Selected user details */}
      {selectedUser && (
        <div className={profileStyles.userDetail}>
          {!isEditingUser ? (
            <div className="w-full">
              <UserDetail
                user={selectedUser}
                onEdit={() => setIsEditingUser(true)}
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <div className={profileStyles.buttonGroup}>
                  <button
                    onClick={handleSaveUser}
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
              </div>
              <UserEditForm
                userFormData={userFormData}
                onFormChange={handleUserFormChange}
                onArrayFieldChange={handleArrayFieldChange}
                errors={errors}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSection; 