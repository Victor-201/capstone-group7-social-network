// pages/home/HomePage.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import Post from '../../../components/postCard';
import AddFriendCard from '../../../components/addFriendCard';
import { useFriendSuggestions } from '../../../hooks/friends/useFriendSuggestions';
import { useBatchMutualFriends, useBatchMutualFriendsDetailed } from '../../../hooks/friends/useMutualFriends';
import { useFriendActions } from '../../../hooks/friends/useFriendActions';
import { useUserFeedPosts } from '../../../hooks/posts/useUserPosts';
import { useAuth } from '../../../contexts/AuthContext';
import './style.scss';

const HomePage = () => {
  const { auth } = useAuth();
  const { posts, loading: postsLoading, error: postsError } = useUserFeedPosts();
  const [message, setMessage] = useState('');
  const [removedSuggestions, setRemovedSuggestions] = useState(new Set());

  const {
    suggestions: realFriendSuggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useFriendSuggestions();

  const {
    sendRequest,
    loading: friendActionLoading,
    error: friendActionError,
  } = useFriendActions();

  const friendSuggestionIds = useMemo(() => {
    return realFriendSuggestions?.map(user => user.id).filter(Boolean) || [];
  }, [realFriendSuggestions]);

  const { mutualCounts } = useBatchMutualFriends(friendSuggestionIds);
  const { mutualFriendsData } = useBatchMutualFriendsDetailed(friendSuggestionIds);

  const suggestionIndexRef = useRef(null);

  useEffect(() => {
    if (posts.length && suggestionIndexRef.current === null) {
      suggestionIndexRef.current = Math.floor(Math.random() * posts.length);
    }
  }, [posts]);

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
      setMessage(`✅ Đã gửi lời mời kết bạn đến ${user.fullName || user.user_name}`);
      setRemovedSuggestions(prev => new Set([...prev, user.id]));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Lỗi khi gửi lời mời: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleRemoveSuggestion = (user) => {
    setRemovedSuggestions(prev => new Set([...prev, user.id]));
    setMessage(`🚫 Đã xóa gợi ý với ${user.fullName || user.user_name}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const renderPostsWithSuggestions = () => {
    if (postsLoading) {
      return <p>⏳ Đang tải bài viết...</p>;
    }

    if (postsError) {
      return (
        <div className="posts-error">
          <FaExclamationTriangle />
          <span>{postsError}</span>
          {postsError.includes("hết hạn") && (
            <button
              className="login-button"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Đăng nhập
            </button>
          )}
        </div>
      );
    }

    if (!posts.length) {
      return <p>📭 Không có bài viết nào từ bạn hoặc bạn bè.</p>;
    }

    const suggestionIndex = suggestionIndexRef.current;

    return posts.map((post, index) => {

      if (index === suggestionIndex && friendSuggestions.length > 0) {
        return (
          <React.Fragment key={`suggestion-${post.id || post._id || index}`}>
            <Post post={post} user_id={post.user_id} />
            <div className="friend-suggestions-horizontal">
              <div className="friend-suggestions-header">
                <span>Gợi ý kết bạn</span>
                <span className="friend-suggestions-desc">Kết nối với những người bạn có thể biết</span>
              </div>
              <div className="friend-suggestions-list">
                {suggestionsLoading ? (
                  <p>Đang tải gợi ý kết bạn...</p>
                ) : (
                  friendSuggestions.map((user) => (
                    <AddFriendCard
                      key={user.id}
                      user={user}
                      type="compact"
                      mutualFriendsCount={mutualCounts[user.id] || 0}
                      mutualFriendsData={mutualFriendsData[user.id]?.mutualFriends || []}
                      onAdd={() => handleAddFriend(user)}
                      onRemove={() => handleRemoveSuggestion(user)}
                      loading={{ add: friendActionLoading, remove: false }}
                    />
                  ))
                ) }
              </div>
            </div>
          </React.Fragment>
        );
      }

      return <Post key={post.id} post={post} user_id={post.user_id} />;
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
          <CreatePost user_id={auth.id} />  
        </div>
        <div className="newsfeed">
          {renderPostsWithSuggestions()}
        </div>
      </article>
    </div>
  );
};

export default HomePage;
