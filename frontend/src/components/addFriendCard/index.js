import React from 'react';
import { FaUserPlus, FaUser, FaUserTimes, FaSpinner } from 'react-icons/fa';
import './style.scss';

const AddFriendCard = ({ 
  user,
  isFollowing,
  onAdd,
  onFollow,
  onUnfollow,
  loading = {}
}) => {
  return (
    <div className="add-friend-card">
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
      </div>
      <div className="actions">
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
      </div>
    </div>
  );
};

// Component khung gợi ý kết bạn nổi bật
export const AddFriendSuggestion = ({ users, onAdd, onFollow, onUnfollow, isFollowing, onSeeAll }) => (
  <div className="add-friend-suggestion-wrapper">
    <div className="suggested-title">Gợi ý kết bạn</div>
    <div className="suggested-friends-list">
      {users.map(user => (
        <AddFriendCard
          key={user.id}
          user={user}
          isFollowing={isFollowing ? isFollowing(user.id) : false}
          onAdd={() => onAdd && onAdd(user.id)}
          onFollow={() => onFollow && onFollow(user.id)}
          onUnfollow={() => onUnfollow && onUnfollow(user.id)}
        />
      ))}
    </div>
    <button className="see-all-btn" onClick={onSeeAll}>Xem tất cả</button>
  </div>
);

export default AddFriendCard;
