import React, { useMemo, useEffect } from 'react';
import { FaSpinner, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddFriendCard from '../addFriendCard';
import { useFriendSuggestions } from '../../hooks/friends/useFriendSuggestions';
import { useFriendActions } from '../../hooks/friends/useFriendActions';
import { useBatchMutualFriends } from '../../hooks/friends/useMutualFriends';
import { ROUTERS } from '../../utils/router';
import './style.scss';

// Themed icon component
const SuggestionsIcon = ({ icon: Icon, className }) => {
  const themeClass = `suggestions-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const FriendSuggestions = ({ limit = 6 }) => {
  const navigate = useNavigate();
  const { suggestions, loading, error, refetch } = useFriendSuggestions(false);
  const { sendRequest, loading: actionLoading } = useFriendActions();

  // Fetch suggestions khi component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const suggestionIds = useMemo(() => {
    return Array.isArray(suggestions) ? suggestions.map(user => user.id).filter(Boolean) : [];
  }, [suggestions]);

  const {
    mutualCounts,
    loading: mutualLoading,
    error: mutualError,
    refetch: refetchMutual
  } = useBatchMutualFriends(suggestionIds, false);

  // Fetch mutual friends khi có suggestions
  useEffect(() => {
    if (suggestionIds.length > 0) {
      refetchMutual();
    }
  }, [suggestionIds, refetchMutual]);

  const handleSendRequest = async (userId) => {
    try {
      await sendRequest(userId);
      refetch();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleSeeAll = () => {
    navigate(`${ROUTERS.USER.FRIENDS}?tab=suggestions`);
  };

  if (loading || mutualLoading) {
    return (
      <div className="friend-suggestions loading">
        <SuggestionsIcon icon={FaSpinner} className="spinner" />
        <p>Đang tải gợi ý kết bạn...</p>
      </div>
    );
  }

  if (error || mutualError) {
    return (
      <div className="friend-suggestions error">
        <p>Không thể tải gợi ý kết bạn: {error || mutualError}</p>
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
            mutualFriendsCount={mutualCounts[user.id] || user.mutualFriendsCount || 0}
            showRemove={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;
