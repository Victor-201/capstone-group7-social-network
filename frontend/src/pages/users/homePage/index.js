import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  FaImage, 
  FaMapMarkerAlt, 
  FaTags, 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaShare, 
  FaBookmark, 
  FaExternalLinkAlt,
  FaGlobe,
  FaEllipsisV,
  FaThumbsUp,
  FaReply
} from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BiLoader } from 'react-icons/bi';
import { MdErrorOutline } from 'react-icons/md';
import DefaultAvatar from '../../../components/DefaultAvatar';
import './style.scss';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('foryou');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/posts?_t=${new Date().getTime()}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts([]);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [API_URL]);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !isAuthenticated) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Bạn cần đăng nhập để đăng bài");
      return;
    }

    const newPost = {
      id: Date.now(),
      author: user?.fullName || user?.username,
      authorId: user?.id,
      authorAvatar: user?.avatar || null,
      content: newPostContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      isLiked: false
    };

    // Optimistic update
    setPosts([newPost, ...posts]);
    setNewPostContent('');

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPostContent
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const savedPost = await response.json();
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === newPost.id ? savedPost : post
        )
      );
    } catch (err) {
      console.error("Failed to save post:", err);
      // Rollback optimistic update
      setPosts(prevPosts => prevPosts.filter(post => post.id !== newPost.id));
      setError("Không thể đăng bài. Vui lòng thử lại.");
    }
  };

  // Handle like functionality
  const handleLike = async (postId) => {
    if (!isAuthenticated) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to like post:", err);
      // Rollback optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
              }
            : post
        )
      );
    }
  };

  // Extract hashtags from post content
  const extractHashtags = (content) => {
    if (!content) return [];
    const regex = /#(\w+)/g;
    const matches = content.match(regex);
    if (!matches) return [];
    return matches.map(tag => tag.slice(1));
  };

  // Format date to relative time (e.g. "2 hours ago")
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
    
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Handle comment submission
  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim() || !isAuthenticated) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const newComment = await response.json();
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="nova-home">
      <div className="nova-container">
        <div className="nova-content">
          <div className="nova-sidebar">
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
                    <DefaultAvatar size={80} />
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

            <div className="sidebar-card trending-card">
              <h3 className="card-title">Chủ đề phổ biến</h3>
              <ul className="trending-list">
                <li className="trending-item">
                  <span className="trending-tag">#technology</span>
                  <span className="trending-count">24.3k bài viết</span>
                </li>
                <li className="trending-item">
                  <span className="trending-tag">#ai</span>
                  <span className="trending-count">18.9k bài viết</span>
                </li>
                <li className="trending-item">
                  <span className="trending-tag">#design</span>
                  <span className="trending-count">12.5k bài viết</span>
                </li>
                <li className="trending-item">
                  <span className="trending-tag">#nova</span>
                  <span className="trending-count">8.7k bài viết</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="nova-main">
            {/* Create Post */}
            {isAuthenticated && (
              <div className="create-post-card">
                <form onSubmit={handlePostSubmit} className="create-post-form">
                  <div className="post-form-header">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="User" 
                        className="post-avatar" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <DefaultAvatar size={48} />
                    )}
                    <textarea 
                      className="post-input" 
                      placeholder="Chia sẻ suy nghĩ của bạn..." 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={newPostContent.length > 0 ? 3 : 1}
                    />
                  </div>
                  <div className="post-form-footer">
                    <div className="post-attachments">
                      <button type="button" className="attachment-button">
                        <span className="attachment-icon"><FaImage /></span>
                        <span className="attachment-label">Hình ảnh</span>
                      </button>
                      <button type="button" className="attachment-button">
                        <span className="attachment-icon"><FaMapMarkerAlt /></span>
                        <span className="attachment-label">Vị trí</span>
                      </button>
                      <button type="button" className="attachment-button">
                        <span className="attachment-icon"><FaTags /></span>
                        <span className="attachment-label">Chủ đề</span>
                      </button>
                    </div>
                    <button 
                      type="submit" 
                      className="post-submit"
                      disabled={!newPostContent.trim()}
                    >
                      Đăng
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Feed Filter */}
            <div className="feed-filter">
              <button className={`filter-button ${activeTab === 'foryou' ? 'active' : ''}`} onClick={() => setActiveTab('foryou')}>Dành cho bạn</button>
              <button className={`filter-button ${activeTab === 'following' ? 'active' : ''}`} onClick={() => setActiveTab('following')}>Theo dõi</button>
              <button className={`filter-button ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>Thịnh hành</button>
            </div>

            {/* Posts Feed */}
            <div className="posts-container">
              {isLoading ? (
                <div className="loading-card">
                  <BiLoader className="loader-icon" />
                  <p>Đang tải bài viết...</p>
                </div>
              ) : error ? (
                <div className="error-card">
                  <MdErrorOutline className="error-icon" />
                  <p>{error}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="empty-card">
                  <p>Không có bài viết nào để hiển thị.</p>
                  {isAuthenticated && (
                    <p className="empty-card-action">Hãy là người đầu tiên chia sẻ bài viết!</p>
                  )}
                </div>
              ) : (
                posts.map(post => {
                  const tags = post.tags || extractHashtags(post.content);
                  return (
                    <div className="post-card" key={post.id}>
                      <div className="post-header">
                        <div className="post-author">
                          {post.authorAvatar ? (
                            <img 
                              src={post.authorAvatar} 
                              alt={post.author} 
                              className="author-avatar" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <DefaultAvatar size={48} />
                          )}
                          <div className="author-info">
                            <div className="author-name">{post.author}</div>
                            <div className="post-meta">
                              <span className="post-time">{formatRelativeTime(post.createdAt)}</span>
                              <span className="dot-separator">•</span>
                              <span className="visibility-icon"><FaGlobe /></span>
                            </div>
                          </div>
                        </div>
                        <button className="post-menu">
                          <FaEllipsisV className="menu-icon" />
                        </button>
                      </div>

                      <div className="post-content">
                        <p>{post.content}</p>
                        
                        {tags.length > 0 && (
                          <div className="post-tags">
                            {tags.map(tag => (
                              <span key={tag} className="post-tag">#{tag}</span>
                            ))}
                          </div>
                        )}
                        
                        {post.image && (
                          <div className="post-media">
                            <img 
                              src={post.image} 
                              alt="Post" 
                              className="post-image" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="post-actions">
                        <button 
                          className={`post-action ${post.isLiked ? 'liked' : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <span className="action-icon">
                            {post.isLiked ? <FaHeart /> : <FaRegHeart />}
                          </span>
                          <span className="action-count">{post.likes || 0}</span>
                        </button>
                        <button className="post-action">
                          <span className="action-icon"><FaComment /></span>
                          <span className="action-count">{post.comments ? post.comments.length : 0}</span>
                        </button>
                        <button className="post-action">
                          <span className="action-icon"><FaShare /></span>
                          <span className="action-count">0</span>
                        </button>
                        <button className="post-action">
                          <span className="action-icon"><FaBookmark /></span>
                        </button>
                        <button className="post-action">
                          <span className="action-icon"><FaExternalLinkAlt /></span>
                        </button>
                      </div>

                      {post.comments && post.comments.length > 0 && (
                        <div className="post-comments">
                          <h4 className="comments-header">
                            <span className="comments-count">{post.comments.length} Bình luận</span>
                          </h4>
                          <div className="comments-list">
                            {post.comments.map(comment => (
                              <div className="comment-item" key={comment.id}>
                                {comment.authorAvatar ? (
                                  <img 
                                    src={comment.authorAvatar} 
                                    alt={comment.author} 
                                    className="comment-avatar" 
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <DefaultAvatar size={36} />
                                )}
                                <div className="comment-content">
                                  <div className="comment-header">
                                    <span className="comment-author">{comment.author}</span>
                                    <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
                                  </div>
                                  <p className="comment-text">{comment.content}</p>
                                  <div className="comment-actions">
                                    <button className="comment-action">
                                      <FaThumbsUp size={12} /> Thích
                                    </button>
                                    <button className="comment-action">
                                      <FaReply size={12} /> Trả lời
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isAuthenticated && (
                        <div className="add-comment">
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt="User" 
                              className="comment-avatar" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <DefaultAvatar size={36} />
                          )}
                          <input 
                            type="text" 
                            className="comment-input" 
                            placeholder="Thêm bình luận..." 
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button 
                            className="comment-submit"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              if (input.value.trim()) {
                                handleAddComment(post.id, input.value);
                                input.value = '';
                              }
                            }}
                          >
                            <IoMdSend />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
