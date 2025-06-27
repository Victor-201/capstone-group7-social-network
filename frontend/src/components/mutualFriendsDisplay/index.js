import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarUser from '../avatarUser';
import './style.scss';

const MutualFriendsDisplay = ({ 
  mutualFriends = [], 
  count = 0, 
  maxAvatars = 2 
}) => {
  const navigate = useNavigate();
  
  const handleFriendClick = (friend) => {
    const username = friend.userAccount?.user_name || friend.user_name || friend.userName;
    if (username) {
      navigate(`/${username}`);
    }
  };

  const safeMutualFriends = Array.isArray(mutualFriends) ? mutualFriends : [];
  
  if (count === 0) {
    return (
      <div className="mutual-friends-display empty">
        <span className="mutual-count">Chưa có bạn chung</span>
      </div>
    );
  }

  const displayAvatars = safeMutualFriends.slice(0, maxAvatars);
  const remainingCount = Math.max(0, count - maxAvatars);

  return (
    <div className="mutual-friends-display">
      <div className="mutual-avatars">
        {displayAvatars.map((friend, index) => (
          <div 
            key={friend.id} 
            className="mutual-avatar" 
            style={{ zIndex: maxAvatars - index, cursor: 'pointer' }}
            onClick={() => handleFriendClick(friend)}
            title={`Xem trang cá nhân của ${friend.full_name || friend.fullName}`}
          >
            <AvatarUser 
              user={friend} 
              size="mini"
              title={friend.full_name}
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="mutual-avatar more-count" style={{ zIndex: 0 }}>
            <div className="more-indicator">
              +{remainingCount}
            </div>
          </div>
        )}
      </div>
      <span className="mutual-count">
        {count} bạn chung
      </span>
    </div>
  );
};

export default MutualFriendsDisplay;
