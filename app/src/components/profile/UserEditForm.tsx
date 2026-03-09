import React, { useRef } from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { User } from "./types";
import AllergyAutocomplete from "../onboarding-form/common/AllergyAutocomplete";
import { X } from "lucide-react";

interface UserEditFormProps {
  userFormData: Partial<User>;
  onFormChange: (field: keyof User, value: any) => void;
  onArrayFieldChange: (field: 'goals' | 'allergies' | 'majorDislikes', value: string) => void;
  errors?: Record<string, string>;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ userFormData, onFormChange, onArrayFieldChange, errors }) => {
  // Upload state (mocking local state for now, in a real scenario you'd handle file state in parent or lifting it)
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      onFormChange('healthReport' as keyof User, file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      onFormChange('healthReport' as keyof User, file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className={profileStyles.editFormContainer}>
      {/* Basic Information */}
      <div className={profileStyles.formGrid}>
        <div>
          <label className={profileStyles.formLabel}>Name</label>
          <input
            type="text"
            value={userFormData.name || ''}
            onChange={(e) => onFormChange('name', e.target.value)}
            className={profileStyles.formInput}
          />
          {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={profileStyles.formLabel}>Email</label>
          <input
            type="email"
            value={userFormData.email || ''}
            onChange={(e) => onFormChange('email', e.target.value)}
            className={profileStyles.formInput}
          />
          {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className={profileStyles.formLabel}>Phone Number</label>
          <input
            type="tel"
            value={userFormData.whatsappNumber || ''}
            onChange={(e) => onFormChange('whatsappNumber', e.target.value)}
            maxLength={15}
            className={profileStyles.formInput}
          />
          {errors?.whatsappNumber && <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>}
        </div>
        <div>
          <label className={profileStyles.formLabel}>Age</label>
          <input
            type="number"
            value={userFormData.age || ''}
            onChange={(e) => onFormChange('age', parseInt(e.target.value))}
            className={profileStyles.formInput}
            min={1}
            max={120}
          />
          {errors?.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className={profileStyles.formLabel}>Height (cm)</label>
          <input
            type="number"
            value={userFormData.height || ''}
            onChange={(e) => onFormChange('height', parseFloat(e.target.value))}
            className={profileStyles.formInput}
            min={1}
            max={300}
          />
          {errors?.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>
        <div>
          <label className={profileStyles.formLabel}>Weight (kg)</label>
          <input
            type="number"
            value={userFormData.weight || ''}
            onChange={(e) => onFormChange('weight', parseFloat(e.target.value))}
            className={profileStyles.formInput}
            min={1}
            max={500}
          />
          {errors?.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label className={profileStyles.formLabel}>Gender</label>
          <select
            value={(userFormData.gender || '').toLowerCase()}
            onChange={(e) => onFormChange('gender', e.target.value)}
            className={profileStyles.formSelect}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
          </select>
        </div>
        <div>
          <label className={profileStyles.formLabel}>Activity Level</label>
          <select
            value={(userFormData.activityLevel || '').toLowerCase()}
            onChange={(e) => onFormChange('activityLevel', e.target.value)}
            className={profileStyles.formSelect}
          >
            <option value="">Select Activity Level</option>
            <option value="sedentary">Sedentary</option>
            <option value="lightly active">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="very active">Very Active</option>
            <option value="extremely active">Extremely Active</option>
          </select>
        </div>
      </div>

      {/* Array Fields */}
      <div className={profileStyles.formField}>
        <div>
          <label className={profileStyles.formLabel}>Goals (comma-separated)</label>
          <input
            type="text"
            value={userFormData.goals?.join(', ') || ''}
            onChange={(e) => onArrayFieldChange('goals', e.target.value)}
            className={profileStyles.formInput}
            placeholder="e.g., Weight Loss, Muscle Gain, Healthy Eating"
          />
        </div>
        <div>
          <label className={profileStyles.formLabel}>Allergies</label>
          <div className="mb-2 mt-1">
            <AllergyAutocomplete
              onAdd={(allergy) => {
                const current = userFormData.allergies || [];
                if (!current.includes(allergy)) onFormChange('allergies', [...current, allergy]);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(userFormData.allergies || []).map(allergy => (
              <div key={allergy} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <span>{allergy}</span>
                <button
                  type="button"
                  onClick={() => onFormChange('allergies', (userFormData.allergies || []).filter(a => a !== allergy))}
                  className="text-green-600 hover:text-green-800 font-bold"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className={profileStyles.formLabel}>Major Dislikes</label>
          <div className="mb-2 mt-1">
            <AllergyAutocomplete
              placeholder="Enter major dislike (e.g., Spicy Food, Seafood)"
              onAdd={(dislike) => {
                const current = userFormData.majorDislikes || [];
                if (!current.includes(dislike)) onFormChange('majorDislikes', [...current, dislike]);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(userFormData.majorDislikes || []).map(dislike => (
              <div key={dislike} className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                <span>{dislike}</span>
                <button
                  type="button"
                  onClick={() => onFormChange('majorDislikes', (userFormData.majorDislikes || []).filter(d => d !== dislike))}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Schedule */}
      <div>
        <label className={profileStyles.formLabel}>Meal Schedule</label>
        <div className={profileStyles.mealScheduleFormGrid}>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            const meals = userFormData.mealSchedule?.[day];
            if (!meals) return null;
            return (
              <div key={day} className={profileStyles.mealScheduleDayCard}>
                <div className={profileStyles.mealScheduleFormDayTitle}>{day}</div>
                <div className={profileStyles.mealScheduleOptions}>
                  <label className={profileStyles.mealScheduleOption}>
                    <input
                      type="checkbox"
                      checked={meals.breakfast}
                      onChange={(e) => onFormChange('mealSchedule', {
                        ...userFormData.mealSchedule,
                        [day]: { ...meals, breakfast: e.target.checked }
                      })}
                      className={profileStyles.mealScheduleCheckbox}
                    />
                    Breakfast
                  </label>
                  <label className={profileStyles.mealScheduleOption}>
                    <input
                      type="checkbox"
                      checked={meals.lunch}
                      onChange={(e) => onFormChange('mealSchedule', {
                        ...userFormData.mealSchedule,
                        [day]: { ...meals, lunch: e.target.checked }
                      })}
                      className={profileStyles.mealScheduleCheckbox}
                    />
                    Lunch
                  </label>
                  <label className={profileStyles.mealScheduleOption}>
                    <input
                      type="checkbox"
                      checked={meals.dinner}
                      onChange={(e) => onFormChange('mealSchedule', {
                        ...userFormData.mealSchedule,
                        [day]: { ...meals, dinner: e.target.checked }
                      })}
                      className={profileStyles.mealScheduleCheckbox}
                    />
                    Dinner
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Health Report Upload Panel */}
      <div className="pt-6 border-t border-gray-100">
        <label className={profileStyles.formLabel + " mb-3"}>Health Report</label>
        <div
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 ${isDragging
            ? "border-[#51754f] bg-[#51754f]/5"
            : "border-gray-200 bg-gray-50/50 hover:border-[#51754f]/50 hover:bg-[#51754f]/5"
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#51754f]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#51754f]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            {uploadedFile ? (
              <div>
                <p className="text-sm font-semibold text-[#51754f]">
                  ✓ {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Ready to upload — tap Save to confirm
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop your health report here
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, PNG or JPG supported</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={profileStyles.saveButton}
            >
              {uploadedFile ? "Replace file" : "Browse files"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditForm;