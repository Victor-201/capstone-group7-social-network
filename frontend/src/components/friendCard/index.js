import React from 'react';
import { FaSpinner, FaEllipsisH, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import AvatarUser from '../avatarUser';
import "./style.scss";

// Themed icon component for FriendCard
const FriendCardIcon = ({ icon: Icon, className }) => {
  const themeClass = `friend-card-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

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

const FriendCard = ({ 
  user, 
  type = 'friend', // friend, request, suggestion, not-friend
  onAccept,
  onReject,
  onRemove,
  onAdd,
  loading = {},
  mutualFriendsCount = 0,
}) => {
  const renderActions = () => {
    switch (type) {
      case 'request':
        return (
          <div className="action-buttons">
            <button 
              className="action-button accept-button"
              onClick={onAccept}
              disabled={loading.accept}
            >
              {loading.accept ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : null}
              Xác nhận
            </button>
            <button 
              className="action-button reject-button"
              onClick={onReject}
              disabled={loading.reject}
            >
              {loading.reject ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : null}
              Xóa
            </button>
          </div>
        );

      case 'suggestion':
      case 'not-friend':
        return (
          <div className="action-buttons">
            <button 
              className="action-button add-button"
              onClick={onAdd}
              disabled={loading.add}
            >
              {loading.add ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : <FriendCardIcon icon={FaUserPlus} />}
              Thêm bạn bè
            </button>
            <button className="action-button more-button">
              <FriendCardIcon icon={FaEllipsisH} />
            </button>
          </div>
        );

      case 'friend':
      default:
        return (
          <div className="action-buttons">
            <button 
              className="action-button remove-button"
              onClick={onRemove}
              disabled={loading.remove}
            >
              {loading.remove ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : <FriendCardIcon icon={FaUserMinus} />}
              Gỡ
            </button>
            <button className="action-button more-button">
              <FriendCardIcon icon={FaEllipsisH} />
            </button>
          </div>
        );
    }
  };

  return (
    <div className="friend-card horizontal">
      <div className="friend-avatar">
        <AvatarUser user={user} size="medium" />
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
          {type === 'request' && user.createdAt && (
            <span className="request-time">
              {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>

      <div className="friend-actions">
        {renderActions()}
      </div>
    </div>
  );
};

export default FriendCard;