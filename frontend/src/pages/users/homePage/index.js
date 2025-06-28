import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import Post from '../../../components/postCard';
import AddFriendCard from '../../../components/addFriendCard';
import { useFriendSuggestions } from '../../../hooks/friends/useFriendSuggestions';
import { useBatchMutualFriends, useBatchMutualFriendsDetailed } from '../../../hooks/friends/useMutualFriends';
import { useFriendActions } from '../../../hooks/friends/useFriendActions';
import { useUserFeedPosts } from '../../../hooks/posts/useUserPosts';
import './style.scss';

const HomePage = () => {
  const { posts } = useUserFeedPosts(); // ✅ Lấy bài viết từ API thật
  const [message, setMessage] = useState('');
  const [removedSuggestions, setRemovedSuggestions] = useState(new Set());

  // Lấy gợi ý kết bạn
  const {
    suggestions: realFriendSuggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
    refetch: refetchSuggestions
  } = useFriendSuggestions();

  // Gửi yêu cầu kết bạn
  const {
    sendRequest,
    loading: friendActionLoading,
    error: friendActionError
  } = useFriendActions();

  // Danh sách ID để lấy mutual friend count
  const friendSuggestionIds = useMemo(() => {
    return realFriendSuggestions?.map(user => user.id).filter(Boolean) || [];
  }, [realFriendSuggestions]);

  const { mutualCounts } = useBatchMutualFriends(friendSuggestionIds);
  const { mutualFriendsData } = useBatchMutualFriendsDetailed(friendSuggestionIds);

  // Tạo ref để giữ chỉ số random
  const suggestionIndexRef = useRef(null);

  useEffect(() => {
    if (posts.length && suggestionIndexRef.current === null) {
      suggestionIndexRef.current = Math.floor(Math.random() * posts.length);
    }
  }, [posts]);

  // Danh sách bạn bè đề xuất (lọc và random)
  const friendSuggestions = useMemo(() => {
    if (suggestionsLoading || !realFriendSuggestions) return [];

    return [...realFriendSuggestions]
      .filter(user => !removedSuggestions.has(user.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }, [realFriendSuggestions, suggestionsLoading, removedSuggestions]);

  const handleAddFriend = async (user) => {
    try {
      await sendRequest(user.id);
      setMessage(`Đã gửi lời mời kết bạn đến ${user.fullName || user.full_name || user.user_name}`);
      setRemovedSuggestions(prev => new Set([...prev, user.id]));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Lỗi khi gửi lời mời: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleRemoveSuggestion = (user) => {
    setRemovedSuggestions(prev => new Set([...prev, user.id]));
    setMessage(`Đã xóa gợi ý kết bạn với ${user.fullName || user.full_name || user.user_name}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const renderPostsWithSuggestions = () => {
    if (!posts.length) return null;

    const suggestionIndex = suggestionIndexRef.current;

    return posts.map((post, index) => {
      if (index === suggestionIndex) {
        return (
          <React.Fragment key={`suggestion-${index}`}>
            <Post post={post} />
            <div className="friend-suggestions-horizontal">
              <div className="friend-suggestions-header">
                <span>Gợi ý kết bạn</span>
                <span className="friend-suggestions-desc">Kết nối với những người bạn có thể biết</span>
              </div>
              <div className="friend-suggestions-list">
                {suggestionsLoading ? (
                  <div className="suggestions-loading">
                    <span>Đang tải gợi ý kết bạn...</span>
                  </div>
                ) : suggestionsError ? (
                  <div className="suggestions-error">
                    <span>Không thể tải gợi ý kết bạn</span>
                  </div>
                ) : friendSuggestions.length > 0 ? (
                  friendSuggestions.map((user) => (
                    <AddFriendCard
                      key={user.id}
                      user={user}
                      type="compact"
                      mutualFriendsCount={mutualCounts[user.id] || 0}
                      mutualFriendsData={mutualFriendsData[user.id]?.mutualFriends || []}
                      onAdd={() => handleAddFriend(user)}
                      onRemove={() => handleRemoveSuggestion(user)}
                      loading={{
                        add: friendActionLoading,
                        remove: false,
                      }}
                    />
                  ))
                ) : (
                  <div className="no-suggestions">
                    <span>Chưa có gợi ý kết bạn</span>
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      }

      return <Post key={post.id} post={post} />;
    });
  };

  return (
    <div className="container">
      <article className="home-page">
        {message && (
          <div className={`message ${friendActionError ? 'error-message' : 'success-message'}`}>
            {message}
          </div>
        )}

        <div className="create-post-section">
          <CreatePost />
        </div>

        <div className="newsfeed">
          {posts.length === 0 ? (
            <div className="no-posts">
              <FaExclamationTriangle />
              <span>Chưa có bài viết nào</span>
            </div>
          ) : (
            renderPostsWithSuggestions()
          )}
        </div>
      </article>
    </div>
  );
};

export default HomePage;
