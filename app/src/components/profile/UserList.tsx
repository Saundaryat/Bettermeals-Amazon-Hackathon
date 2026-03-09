import React from "react";
import { profileStyles } from "@/pages/styles/Profile.styles";
import { User } from "./types";

interface UserListProps {
  users: User[];
  selectedUserId: string;
  onUserSelect: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUserId, onUserSelect }) => {
  return (
    <nav className={profileStyles.subNav}>
      {users.map((user) => (
        <div
          key={user.userId}
          onClick={() => onUserSelect(user.userId)}
          className={`${profileStyles.subNavItem} ${
            selectedUserId === user.userId ? profileStyles.subNavItemActive : ""
          }`}
        >
          {user.name}
        </div>
      ))}
    </nav>
  );
};

export default UserList; 