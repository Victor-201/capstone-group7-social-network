import React, { useEffect } from 'react';
import { FaSpinner, FaUsers } from 'react-icons/fa';
import AvatarUser from '../avatarUser';
import { useMutualFriends } from '../../hooks/friends/useMutualFriends';
import './style.scss';

const MutualFriendsIcon = ({ icon: Icon, className }) => {
  const themeClass = `mutual-friends-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const MutualFriends = ({ friendId, limit = 3, showCount = true }) => {
  const { getMutualFriendsForUser } = useMutualFriends();
  const { data: mutualFriends, loading, error, fetch } = getMutualFriendsForUser(friendId);

  useEffect(() => {
    if (friendId) {
      fetch();
    }
  }, [friendId, fetch]);

  if (loading) {
    return (
      <div className="mutual-friends loading">
        <MutualFriendsIcon icon={FaSpinner} className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mutual-friends error">
        <p>Không thể tải bạn chung</p>
      </div>
    );
  }

  if (!mutualFriends || mutualFriends.length === 0) {
    return null; // Don't show anything if no mutual friends
  }

  const displayedFriends = mutualFriends.slice(0, limit);
  const remainingCount = mutualFriends.length - limit;

  return (
    <div className="mutual-friends">
      <div className="mutual-friends-avatars">
        {displayedFriends.map((friend) => (
          <div key={friend.id} className="mutual-friend-avatar">
            <AvatarUser user={friend} size="small" />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="more-count">
            +{remainingCount}
          </div>
        )}
      </div>
      {showCount && (
        <div className="mutual-friends-text">
          <MutualFriendsIcon icon={FaUsers} />
          <span>
            {mutualFriends.length === 1 
              ? '1 bạn chung' 
              : `${mutualFriends.length} bạn chung`
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default MutualFriends;
