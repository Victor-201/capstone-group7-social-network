import React from 'react';
import { FaSpinner, FaUserPlus } from 'react-icons/fa';
import AvatarUser from '../avatarUser';
import "./style.scss";

// Helper function to get display name
const getDisplayName = (user) => {
  return user.fullName || user.full_name || user.user_name || user.userName || user.name || 'Người dùng';
};

// Themed icon component for UserCard
const UserCardIcon = ({ icon: Icon, className }) => {
  const themeClass = `user-card-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const UserCard = ({ 
  user, 
  onPrimaryAction,
  onSecondaryAction,
  loading = {},
  mutualFriendsCount = 0,
  primaryButtonText = "Thêm bạn bè",
  secondaryButtonText = "Xóa",
  type = "suggestion", // suggestion, request
}) => {
  return (
    <div className="user-card facebook-style">
      <div className="user-avatar">
        <AvatarUser user={user} size="large" />
      </div>
      
      <div className="user-info">
        <div className="user-name">
          <h3>{getDisplayName(user)}</h3>
        </div>
        
        <div className="mutual-info">
          {mutualFriendsCount > 0 ? (
            <div className="mutual-friends">
              <UserCardIcon icon={FaUserPlus} />
              <span className="mutual-count">
                {mutualFriendsCount} bạn chung
              </span>
            </div>
          ) : (
            <div className="mutual-friends">
              <span className="mutual-count">
                Chưa có bạn chung
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="user-actions">
        <button 
          className="action-button primary-button"
          onClick={onPrimaryAction}
          disabled={loading.primary}
        >
          {loading.primary ? (
            <UserCardIcon icon={FaSpinner} className="spinner" />
          ) : null}
          {primaryButtonText}
        </button>
        
        <button 
          className="action-button secondary-button"
          onClick={onSecondaryAction}
          disabled={loading.secondary}
        >
          {loading.secondary ? (
            <UserCardIcon icon={FaSpinner} className="spinner" />
          ) : null}
          {secondaryButtonText}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
