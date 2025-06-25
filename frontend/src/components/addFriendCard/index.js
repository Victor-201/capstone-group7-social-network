import React from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import AvatarUser from '../avatarUser';
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
  showRemove = false,
  type = 'suggestion', // suggestion, compact
}) => {
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
      <div className="friend-avatar">
        <AvatarUser user={user} size={type === 'compact' ? 'large' : 'medium'} />
      </div>
      
      <div className="friend-info">
        <div className="friend-name">
          <h3>{getDisplayName(user)}</h3>
          {getUserName(user) && (
            <span className="username">@{getUserName(user)}</span>
          )}
        </div>
        
        <div className="mutual-info">
          {mutualFriendsCount > 0 ? (
            <span className="mutual-count">
              {mutualFriendsCount} bạn chung
            </span>
          ) : (
            <span className="mutual-count">
              Chưa có bạn chung
            </span>
          )}
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
            {type === 'compact' ? 'Xác nhận' : 'Thêm bạn bè'}
          </button>
          
          <button 
            className="action-button remove-button"
            onClick={onRemove}
            disabled={loading.remove}
          >
            {loading.remove ? (
              <AddFriendCardIcon icon={FaSpinner} className="spinner" />
            ) : null}
            {type === 'compact' ? 'Xóa' : ''}
            {type !== 'compact' && <AddFriendCardIcon icon={FaTimes} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendCard;
