import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FaUsers, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import NewsFeed from '../../../components/newsFeed';
import ReelsSection from '../../../components/reelsSection';
import AddFriendCard, { AddFriendSuggestion } from '../../../components/addFriendCard';
import './style.scss';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('foryou');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Dữ liệu mẫu cho posts
    setPosts([
      {
        id: 1,
        author: "Nguyễn Văn A",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        content: "Đây là bài viết mẫu #demo",
        createdAt: new Date().toISOString(),
        likes: 5,
        isLiked: false,
        comments: [
          {
            id: 1,
            author: "Bình luận viên",
            authorAvatar: "",
            content: "Bình luận mẫu",
            createdAt: new Date().toISOString()
          }
        ],
        tags: ["demo"]
      },
      {
        id: 2,
        author: "Trần Thị B",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        content: "Bài viết thứ hai với #hashtag",
        createdAt: new Date().toISOString(),
        likes: 2,
        isLiked: true,
        comments: [],
        tags: ["hashtag"]
      }
    ]);
    // Dữ liệu mẫu cho reels
    setReels([
      {
        id: 1,
        author: "Nguyễn Văn B",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        caption: "Reel mẫu vui nhộn",
        createdAt: new Date().toISOString(),
        likes: 2,
        isLiked: false,
        comments: [],
        music: "Nhạc nền mẫu"
      }
    ]);
    // Dữ liệu mẫu cho suggested users
    setSuggestedUsers([
      {
        id: 1,
        fullName: "Nguyễn Văn C",
        username: "nguyenvanc",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
        bio: "Bạn mới gợi ý"
      },
      {
        id: 2,
        fullName: "Lê Thị D",
        username: "lethid",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        bio: "Gợi ý kết bạn từ hệ thống"
      }
    ]);
    setIsLoading(false);
    setError(null);
  }, []);

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Dummy handlers
  const handlePostLike = () => {};
  const handlePostComment = () => {};
  const handlePostShare = () => {};
  const handlePostBookmark = () => {};
  const handlePostExternalLink = () => {};
  const handlePostMenuClick = () => {};
  const handleReelLike = () => {};
  const handleReelComment = () => {};
  const handleReelShare = () => {};
  const handleReelMenuClick = () => {};
  const handleAddFriend = () => {};
  const handleFollowUser = () => {};
  const handleUnfollowUser = () => {};

  return (
    <div className="nova-home">
      <div className="nova-container">
        <div className="nova-content">
          <div className="nova-sidebar">
            {/* Profile Card */}
            <div className="sidebar-card profile-card">
              <div className="profile-cover">
                <div className="profile-avatar-large">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <img
                      src="upload/images/avatar-default.jpg"
                      alt="Profile"
                    />
                  )}
                </div>
              </div>
              <div className="profile-info">
                <h3>{user?.fullName || user?.username || "Khách"}</h3>
                <p className="profile-handle">@{user?.username || "guest"}</p>
                {isAuthenticated && (
                  <div className="profile-stats">
                    <div className="stat">
                      <span className="stat-number">0</span>
                      <span className="stat-label">Bài viết</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">0</span>
                      <span className="stat-label">Bạn bè</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Friends */}
            {suggestedUsers.length > 0 && (
              <AddFriendSuggestion
                users={suggestedUsers}
                onAdd={handleAddFriend}
                onFollow={handleFollowUser}
                onUnfollow={handleUnfollowUser}
                isFollowing={() => false}
                onSeeAll={() => alert('Xem tất cả gợi ý kết bạn!')}
              />
            )}
          </div>

          <div className="nova-main">
            {/* Create Post */}
            {isAuthenticated && <CreatePost />}

            {/* Feed Filter */}
            <div className="feed-filter">
              <button 
                className={`filter-button ${activeTab === 'foryou' ? 'active' : ''}`} 
                onClick={() => setActiveTab('foryou')}
              >
                Dành cho bạn
              </button>
              <button 
                className={`filter-button ${activeTab === 'following' ? 'active' : ''}`} 
                onClick={() => setActiveTab('following')}
              >
                Theo dõi
              </button>
              <button 
                className={`filter-button ${activeTab === 'trending' ? 'active' : ''}`} 
                onClick={() => setActiveTab('trending')}
              >
                Thịnh hành
              </button>
            </div>

            {/* News Feed */}
            {isLoading ? (
              <div className="loading-card">
                <FaSpinner className="loader-icon" />
                <p>Đang tải bài viết...</p>
              </div>
            ) : error ? (
              <div className="error-card">
                <FaExclamationTriangle className="error-icon" />
                <p>{error}</p>
              </div>
            ) : (
              <>
                <NewsFeed
                  posts={posts}
                  onLike={handlePostLike}
                  onComment={handlePostComment}
                  onShare={handlePostShare}
                  onBookmark={handlePostBookmark}
                  onExternalLink={handlePostExternalLink}
                  onMenuClick={handlePostMenuClick}
                  formatRelativeTime={formatRelativeTime}
                />

                {/* Reels Section */}
                {reels.length > 0 && (
                  <div className="reels-container">
                    <h2 className="section-title">Reels</h2>
                    <ReelsSection
                      reels={reels}
                      onLike={handleReelLike}
                      onComment={handleReelComment}
                      onShare={handleReelShare}
                      onMenuClick={handleReelMenuClick}
                      formatRelativeTime={formatRelativeTime}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;