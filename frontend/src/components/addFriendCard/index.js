import React from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../avatarUser';
import MutualFriendsDisplay from '../mutualFriendsDisplay';
import "./style.scss";

// Themed icon component for AddFriendCard
const AddFriendCardIcon = ({ icon: Icon, className }) => {
  const themeClass = `add-friend-card-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const AddFriendCard = ({ 
  user, 
  onAdd,
  onRemove,
  loading = {},
  mutualFriendsCount = 0,
  mutualFriendsData = [],
  showRemove = false,
  type = 'suggestion', // suggestion, compact
}) => {
  const navigate = useNavigate();

  // Helper function to get username for navigation (updated for backend commit)
  const getUserNameForNavigation = (user) => {
    // Ưu tiên userAccount.user_name từ commit backend mới
    return user.userAccount?.user_name || user.user_name || user.userName;
  };

  // Handle click to navigate to profile
  const handleProfileClick = () => {
    const username = getUserNameForNavigation(user);
    console.log('AddFriendCard navigation:', { user, username, navigating_to: `/${username}` });
    if (username) {
      navigate(`/${username}`);
    } else {
      console.warn('AddFriendCard: No username found for navigation', user);
    }
  };

  // Debug log để kiểm tra mutualFriendsCount
  console.log(`AddFriendCard - User: ${user?.full_name || user?.fullName}, MutualCount: ${mutualFriendsCount}`);

  // Helper function to get display name
  const getDisplayName = (user) => {
    return user.fullName || user.full_name || user.user_name || user.userName || user.name || 'Người dùng';
  };

  // Helper function to get username
  const getUserName = (user) => {
    const displayName = getDisplayName(user);
    const username = user.user_name || user.userName;
    
    // Only show username if it's different from display name
    if (username && username !== displayName && !displayName.toLowerCase().includes(username.toLowerCase())) {
      return username;
    }
    return null;
  };

  return (
    <div className={`add-friend-card ${type === 'compact' ? 'compact' : 'horizontal'}`}>
      <div className="friend-avatar" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        <AvatarUser user={user} size={type === 'compact' ? 'large' : 'medium'} />
      </div>
      
      <div className="friend-info" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
        <div className="friend-name">
          <h3>{getDisplayName(user)}</h3>
          {getUserName(user) && (
            <span className="username">@{getUserName(user)}</span>
          )}
        </div>
        
        <div className="mutual-info">
          <MutualFriendsDisplay
            mutualFriends={mutualFriendsData}
            count={mutualFriendsCount}
          />
        </div>
      </div>

      <div className="friend-actions">
        <div className="action-buttons">
          <button 
            className="action-button add-button"
            onClick={onAdd}
            disabled={loading.add}
          >
            {loading.add ? (
              <AddFriendCardIcon icon={FaSpinner} className="spinner" />
            ) : null}
            {type === 'compact' && showRemove ? 'Xác nhận' : 'Thêm bạn bè'}
          </button>
          
          <button 
            className="action-button remove-button"
            onClick={onRemove}
            disabled={loading.remove}
          >
            {loading.remove ? (
              <AddFriendCardIcon icon={FaSpinner} className="spinner" />
            ) : null}
            {type === 'compact' && showRemove ? 'Xóa' : ''}
            {type !== 'compact' && <AddFriendCardIcon icon={FaTimes} />}
            {type === 'compact' && !showRemove && 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendCard;
