import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { User } from "./types";
import HealthReportSection from "./HealthReportSection";

interface UserDetailProps {
  user: User;
  onEdit?: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onEdit }) => {
  return (
    <>
      {/* Top row: avatar + name/age/gender (left), email/phone (right) */}
      <div className={profileStyles.userInfoContainer}>
        <div className={profileStyles.userInfoLeft}>
          <div className={profileStyles.avatarLg}>
            {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '👤'}
          </div>
          <div className="min-w-0">
            <div className={profileStyles.userName}>{user.name}</div>
            <div className={profileStyles.userDetails}>Age {user.age}, {user.gender}</div>
          </div>
        </div>
        <div className={profileStyles.userInfoRight}>
          {onEdit && (
            <button
              onClick={onEdit}
              className={profileStyles.editButton + " mb-2"}
            >
              Edit
            </button>
          )}
          <div className={profileStyles.userContact}>{user.email || <span className={profileStyles.userContactEmpty}>No email</span>}</div>
          <div className={profileStyles.userContact}>{user.whatsappNumber || <span className={profileStyles.userContactEmpty}>No phone</span>}</div>
        </div>
      </div>

      {/* Existing user info row */}
      <div className={profileStyles.userInfoRow + " mt-4"}>
        <span>
          <span className={profileStyles.fieldLabel}>Height:</span> {user.height} cm
        </span>
        <span>
          <span className={profileStyles.fieldLabel}>Weight:</span> {user.weight} kg
        </span>
        <span>
          <span className={profileStyles.fieldLabel}>Activity:</span> {
            ({
              'sedentary': 'Sedentary',
              'lightly active': 'Lightly Active',
              'moderate': 'Moderately Active',
              'very active': 'Very Active',
              'extremely active': 'Extremely Active',
            } as Record<string, string>)[(user.activityLevel || '').toLowerCase()] || user.activityLevel
          }
        </span>
      </div>

      {/* Goals, Allergies, Dislikes */}
      <div className="mt-4 space-y-2">
        <div className={profileStyles.detailRow}>
          <span className={profileStyles.detailKey}>Goals</span>
          <span className={profileStyles.detailValue}>
            {user.goals.length ? (
              <span className="flex flex-wrap">
                {user.goals.map((goal, i) => (
                  <span key={i} className={profileStyles.tag}>{goal}</span>
                ))}
              </span>
            ) : "None"}
          </span>
        </div>
        <div className={profileStyles.detailRow}>
          <span className={profileStyles.detailKey}>Allergies</span>
          <span className={profileStyles.detailValue}>
            {user.allergies.length ? (
              <span className="flex flex-wrap">
                {user.allergies.map((allergy, i) => (
                  <span key={i} className={profileStyles.tag}>{allergy}</span>
                ))}
              </span>
            ) : "None"}
          </span>
        </div>
        <div className={profileStyles.detailRow}>
          <span className={profileStyles.detailKey}>Major Dislikes</span>
          <span className={profileStyles.detailValue}>
            {user.majorDislikes.length ? (
              <span className="flex flex-wrap">
                {user.majorDislikes.map((dislike, i) => (
                  <span key={i} className={profileStyles.tag}>{dislike}</span>
                ))}
              </span>
            ) : "None"}
          </span>
        </div>
      </div>

      {/* Meal Schedule */}
      <div className="mt-8">
        <div className={profileStyles.detailKey + " mb-2"}>Meal Schedule</div>
        <div className={profileStyles.tableContainer}>
          <table className={profileStyles.table}>
            <thead>
              <tr>
                <th className={profileStyles.th}>Day</th>
                <th className={profileStyles.th + " text-center"}>Breakfast</th>
                <th className={profileStyles.th + " text-center"}>Lunch</th>
                <th className={profileStyles.th + " text-center"}>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                const meals = user.mealSchedule[day];
                const hasBreakfast = meals?.breakfast;
                const hasLunch = meals?.lunch;
                const hasDinner = meals?.dinner;

                return (
                  <tr key={day} className="hover:bg-gray-50/50 transition-colors">
                    <td className={profileStyles.td + " " + profileStyles.dayCell}>{day}</td>
                    <td className={profileStyles.td + " " + profileStyles.checkCell}>
                      {hasBreakfast ? (
                        <svg className={profileStyles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={profileStyles.dashIcon}>-</span>
                      )}
                    </td>
                    <td className={profileStyles.td + " " + profileStyles.checkCell}>
                      {hasLunch ? (
                        <svg className={profileStyles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={profileStyles.dashIcon}>-</span>
                      )}
                    </td>
                    <td className={profileStyles.td + " " + profileStyles.checkCell}>
                      {hasDinner ? (
                        <svg className={profileStyles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={profileStyles.dashIcon}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Report — per-user section */}
      <div className="mt-8">
        <HealthReportSection
          userId={user.userId}
          userName={user.name}
          healthReportSummary={user.healthReportSummary}
          healthReportUrl={user.healthReportUrl}
        />
      </div>
    </>
  );
};

export default UserDetail;