import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../avatarUser';
import MutualFriendsDisplay from '../mutualFriendsDisplay';
import "./style.scss";

// Helper function to get display name
const getDisplayName = (user) => {
  return user.fullName || user.full_name || user.user_name || user.userName || user.name || 'Người dùng';
};

// Helper function to get username for navigation (updated for backend commit)
const getUserNameForNavigation = (user) => {
  // Ưu tiên userAccount.user_name từ commit backend mới
  return user.userAccount?.user_name || user.user_name || user.userName;
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
  mutualFriendsData = [], // Array of mutual friends with details
  primaryButtonText = "Thêm bạn bè",
  secondaryButtonText = "Xóa",
  type = "suggestion", // suggestion, request
}) => {
  const navigate = useNavigate();

  // Handle click to navigate to profile
  const handleProfileClick = () => {
    const username = getUserNameForNavigation(user);
    console.log('UserCard navigation:', { user, username, navigating_to: `/${username}` });
    if (username) {
      navigate(`/${username}`);
    } else {
      console.warn('UserCard: No username found for navigation', user);
    }
  };

  // Debug log
  console.log(`UserCard: ${user?.full_name || user?.fullName || 'Unknown'} - mutualFriendsCount:`, mutualFriendsCount, 'mutualFriendsData:', mutualFriendsData);
  
  return (
    <div className="user-card facebook-style">
      <div className="user-avatar" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        <AvatarUser user={user} size="large" />
      </div>
      
      <div className="user-info" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        <div className="user-name">
          <h3>{getDisplayName(user)}</h3>
        </div>
        
        <div className="mutual-info">
          <MutualFriendsDisplay 
            mutualFriends={mutualFriendsData}
            count={mutualFriendsCount}
            maxAvatars={2}
          />
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
