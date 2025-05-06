import React from 'react';
import { FaUserPlus, FaUserMinus, FaUser, FaUserCheck, FaUserTimes, FaSpinner } from 'react-icons/fa';
import "./style.scss";

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
              {loading.accept ? <FaSpinner className="spinner" /> : <FaUserCheck />}
              Chấp nhận
            </button>
            <button 
              className="action-button reject-button"
              onClick={onReject}
              disabled={loading.reject}
            >
              {loading.reject ? <FaSpinner className="spinner" /> : <FaUserTimes />}
              Từ chối
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
              {loading.add ? <FaSpinner className="spinner" /> : <FaUserPlus />}
              Kết bạn
            </button>
            {isFollowing ? (
              <button 
                className="action-button unfollow-button"
                onClick={onUnfollow}
                disabled={loading.follow}
              >
                {loading.follow ? <FaSpinner className="spinner" /> : <FaUserTimes />}
                Bỏ theo dõi
              </button>
            ) : (
              <button 
                className="action-button follow-button"
                onClick={onFollow}
                disabled={loading.follow}
              >
                {loading.follow ? <FaSpinner className="spinner" /> : <FaUser />}
                Theo dõi
              </button>
            )}
          </>
        );

      case 'friend':
        return (
          <>
            <button 
              className="action-button remove-button"
              onClick={onRemove}
              disabled={loading.remove}
            >
              {loading.remove ? <FaSpinner className="spinner" /> : <FaUserMinus />}
              Hủy kết bạn
            </button>
            {isFollowing ? (
              <button 
                className="action-button unfollow-button"
                onClick={onUnfollow}
                disabled={loading.follow}
              >
                {loading.follow ? <FaSpinner className="spinner" /> : <FaUserTimes />}
                Bỏ theo dõi
              </button>
            ) : (
              <button 
                className="action-button follow-button"
                onClick={onFollow}
                disabled={loading.follow}
              >
                {loading.follow ? <FaSpinner className="spinner" /> : <FaUser />}
                Theo dõi
              </button>
            )}
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
              {loading.add ? <FaSpinner className="spinner" /> : <FaUserPlus />}
              Kết bạn
            </button>
            <button 
              className="action-button unfollow-button"
              onClick={onUnfollow}
              disabled={loading.follow}
            >
              {loading.follow ? <FaSpinner className="spinner" /> : <FaUserTimes />}
              Bỏ theo dõi
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
        {user.avatar ? (
          <img src={user.avatar} alt={user.fullName} />
        ) : (
          <img src="upload/images/default-avatar.jpg" alt={user.fullName} />
        )}
      </div>
      <div className="info">
        <h3>{user.fullName}</h3>
        <p className="username">@{user.username}</p>
        {user.bio && <p className="bio">{user.bio}</p>}
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