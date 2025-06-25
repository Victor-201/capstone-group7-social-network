import React from 'react';
import { FaSpinner, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddFriendCard from '../addFriendCard';
import { useFriendSuggestions } from '../../hooks/friends/useFriendSuggestions';
import { useFriendActions } from '../../hooks/friends/useFriendActions';
import { ROUTERS } from '../../utils/router';
import './style.scss';

// Themed icon component
const SuggestionsIcon = ({ icon: Icon, className }) => {
  const themeClass = `suggestions-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const FriendSuggestions = ({ limit = 6 }) => {
  const navigate = useNavigate();
  const { suggestions, loading, error, refetch } = useFriendSuggestions();
  const { sendRequest, loading: actionLoading } = useFriendActions();

  const handleSendRequest = async (userId) => {
    try {
      await sendRequest(userId);
      // Refetch suggestions after sending request
      refetch();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleSeeAll = () => {
    navigate(ROUTERS.USER.FRIEND_SUGGESTIONS);
  };

  if (loading) {
    return (
      <div className="friend-suggestions loading">
        <SuggestionsIcon icon={FaSpinner} className="spinner" />
        <p>Đang tải gợi ý kết bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friend-suggestions error">
        <p>Không thể tải gợi ý kết bạn: {error}</p>
        <button onClick={refetch}>Thử lại</button>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="friend-suggestions empty">
        <SuggestionsIcon icon={FaUserPlus} />
        <p>Không có gợi ý kết bạn nào</p>
      </div>
    );
  }

  const displayedSuggestions = limit ? suggestions.slice(0, limit) : suggestions;

  return (
    <div className="friend-suggestions">
      <div className="suggestions-header">
        <h3>Những người bạn có thể biết</h3>
        {suggestions.length > limit && (
          <button className="see-all-button" onClick={handleSeeAll}>
            Xem tất cả ({suggestions.length})
          </button>
        )}
      </div>
      <div className="suggestions-grid">
        {displayedSuggestions.map((user) => (
          <AddFriendCard
            key={user.id}
            user={user}
            onAdd={() => handleSendRequest(user.id)}
            loading={{
              add: actionLoading.sendRequest === user.id
            }}
            mutualFriendsCount={user.mutualFriendsCount || 0}
            showRemove={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;
