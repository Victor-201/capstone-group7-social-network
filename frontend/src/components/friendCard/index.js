import React from 'react';
import { FaSpinner, FaEllipsisH } from 'react-icons/fa';
import AvatarUser from '../avatarUser';
import "./style.scss";

// Themed icon component for FriendCard
const FriendCardIcon = ({ icon: Icon, className }) => {
  const themeClass = `friend-card-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const FriendCard = ({ 
  user, 
  type = 'friend', // friend, request, suggestion, follower, following
  isFollowing,
  onAccept,
  onReject,
  onAdd,
  onRemove,
  onFollow,
  onUnfollow,
  loading = {},
}) => {
  const renderActions = () => {
    switch (type) {
      case 'request':
        return (
          <>
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
          </>
        );

      case 'suggestion':
      case 'follower':
        return (
          <>
            <button 
              className="action-button add-button"
              onClick={onAdd}
              disabled={loading.add}
            >
              {loading.add ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : null}
              Thêm bạn bè
            </button>
            <button className="action-button more-options-button">
              <FriendCardIcon icon={FaEllipsisH} />
            </button>
          </>
        );

      case 'friend':
        return (
          <>
            <button 
              className="action-button primary-button"
              onClick={onRemove}
              disabled={loading.remove}
            >
              {loading.remove ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : null}
              Xác nhận
            </button>
            <button className="action-button more-options-button">
              <FriendCardIcon icon={FaEllipsisH} />
            </button>
          </>
        );

      case 'following':
        return (
          <>
            <button 
              className="action-button add-button"
              onClick={onAdd}
              disabled={loading.add}
            >
              {loading.add ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : null}
              Thêm bạn bè
            </button>
            <button className="action-button more-options-button">
              <FriendCardIcon icon={FaEllipsisH} />
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="friend-card">
      <div className="avatar">
        <AvatarUser user={user} />
      </div>
      <div className="info">
        <h3>{user.fullName}</h3>
        <p className="mutual-friends">{Math.floor(Math.random() * 15) + 1} bạn chung</p>
        {type === 'request' && user.createdAt && (
          <p className="request-time">
            Đã gửi lời mời: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="actions">
        {renderActions()}
      </div>
    </div>
  );
};

export default FriendCard;