import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Sử dụng port 8080 thay vì 5000
        const response = await fetch('http://127.0.0.1:8080/api/posts?_t=' + new Date().getTime(), {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data.length ? data : mockPosts); // Use mock data if no posts returned
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setPosts(mockPosts); // Use mock data on error
        setError("Failed to load posts. Using demo content instead.");
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: "Current User",
      authorId: "current-user",
      authorAvatar: "/images/default-avatar.png",
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
      const response = await fetch('http://127.0.0.1:8080/api/posts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newPostContent
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const savedPost = await response.json();
      // Update post with server data if needed
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === newPost.id ? { ...post, id: savedPost.id } : post
        )
      );
    } catch (err) {
      console.error("Failed to save post:", err);
      // You could add error handling here, like showing a notification
    }
  };

  // Handle like functionality
  const handleLike = async (postId) => {
    // Optimistic update
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
      const response = await fetch(`http://127.0.0.1:8080/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Cập nhật state từ phản hồi server nếu cần
      const data = await response.json();
      
    } catch (err) {
      console.error("Failed to like post:", err);
      // Revert optimistic update on error
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

  // Mock data for development
  const mockPosts = [
    {
      id: 1,
      author: "Jane Doe",
      authorId: "jane-doe",
      authorAvatar: "/images/default-avatar.png",
      content: "Just finished my latest project! 🚀 #coding #webdev",
      image: "https://via.placeholder.com/600x400",
      createdAt: "2025-04-23T14:30:00Z",
      likes: 42,
      comments: [
        { id: 101, author: "John Smith", content: "Amazing work!", createdAt: "2025-04-23T15:00:00Z" },
        { id: 102, author: "Alice Johnson", content: "Congrats!", createdAt: "2025-04-23T15:30:00Z" }
      ],
      isLiked: false
    },
    {
      id: 2,
      author: "John Smith",
      authorId: "john-smith",
      authorAvatar: "/images/default-avatar.png",
      content: "Beautiful day for a hike! 🏞️ #nature #outdoors",
      image: "https://via.placeholder.com/600x400",
      createdAt: "2025-04-23T10:15:00Z",
      likes: 28,
      comments: [],
      isLiked: true
    },
    {
      id: 3,
      author: "Alice Johnson",
      authorId: "alice-johnson",
      authorAvatar: "/images/default-avatar.png",
      content: "Just learned about React hooks. They're game changers! #reactjs #javascript",
      createdAt: "2025-04-22T16:45:00Z",
      likes: 17,
      comments: [
        { id: 103, author: "Jane Doe", content: "They really are! Changed how I build components.", createdAt: "2025-04-22T17:30:00Z" }
      ],
      isLiked: false
    }
  ];

  // Format date to relative time (e.g. "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Left Sidebar */}
        <aside className="sidebar sidebar-left">
          <div className="sidebar-section">
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item">
                <Link to="/profile" className="sidebar-link">
                  <img src="/images/default-avatar.png" alt="Profile" className="sidebar-avatar" />
                  <span>Your Profile</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/friends" className="sidebar-link">
                  <span className="menu-icon">👥</span>
                  <span>Friends</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/groups" className="sidebar-link">
                  <span className="menu-icon">👪</span>
                  <span>Groups</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/marketplace" className="sidebar-link">
                  <span className="menu-icon">🛍️</span>
                  <span>Marketplace</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/watch" className="sidebar-link">
                  <span className="menu-icon">📺</span>
                  <span>Watch</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/events" className="sidebar-link">
                  <span className="menu-icon">📅</span>
                  <span>Events</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/memories" className="sidebar-link">
                  <span className="menu-icon">⏱️</span>
                  <span>Memories</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link to="/saved" className="sidebar-link">
                  <span className="menu-icon">🔖</span>
                  <span>Saved</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Your Shortcuts</h3>
            <ul className="sidebar-menu">
              <li className="sidebar-menu-item">
                <a href="#" className="sidebar-link">
                  <span className="menu-icon">🎮</span>
                  <span>Gaming Group</span>
                </a>
              </li>
              <li className="sidebar-menu-item">
                <a href="#" className="sidebar-link">
                  <span className="menu-icon">💻</span>
                  <span>Web Development</span>
                </a>
              </li>
              <li className="sidebar-menu-item">
                <a href="#" className="sidebar-link">
                  <span className="menu-icon">📱</span>
                  <span>Mobile App Design</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Stories Section */}
          <div className="stories-container">
            <div className="story story-create">
              <div className="story-content">
                <div className="story-create-image">
                  <img src="/images/default-avatar.png" alt="Create Story" className="story-avatar" />
                </div>
                <div className="story-create-button">
                  <span className="story-create-icon">+</span>
                </div>
                <p className="story-text">Create Story</p>
              </div>
            </div>
            <div className="story">
              <img src="https://via.placeholder.com/180x320" alt="Story" className="story-image" />
              <div className="story-content">
                <div className="story-avatar-container">
                  <img src="/images/default-avatar.png" alt="User" className="story-avatar" />
                </div>
                <p className="story-text">Jane Doe</p>
              </div>
            </div>
            <div className="story">
              <img src="https://via.placeholder.com/180x320" alt="Story" className="story-image" />
              <div className="story-content">
                <div className="story-avatar-container">
                  <img src="/images/default-avatar.png" alt="User" className="story-avatar" />
                </div>
                <p className="story-text">John Smith</p>
              </div>
            </div>
            <div className="story">
              <img src="https://via.placeholder.com/180x320" alt="Story" className="story-image" />
              <div className="story-content">
                <div className="story-avatar-container">
                  <img src="/images/default-avatar.png" alt="User" className="story-avatar" />
                </div>
                <p className="story-text">Alice Johnson</p>
              </div>
            </div>
          </div>

          {/* Create Post */}
          <div className="create-post-container">
            <div className="create-post-header">
              <img src="/images/default-avatar.png" alt="User" className="user-avatar" />
              <form onSubmit={handlePostSubmit} className="create-post-form">
                <input 
                  type="text" 
                  className="create-post-input" 
                  placeholder="What's on your mind?" 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="create-post-button"
                  disabled={!newPostContent.trim()}
                >
                  Post
                </button>
              </form>
            </div>
            <div className="create-post-actions">
              <button className="post-action-button">
                <span className="action-icon">🎥</span>
                <span>Live Video</span>
              </button>
              <button className="post-action-button">
                <span className="action-icon">🖼️</span>
                <span>Photo/Video</span>
              </button>
              <button className="post-action-button">
                <span className="action-icon">😊</span>
                <span>Feeling/Activity</span>
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="posts-container">
            {isLoading ? (
              <div className="loading-indicator">
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
              </div>
            ) : (
              posts.map(post => (
                <div className="post" key={post.id}>
                  <div className="post-header">
                    <div className="post-user-info">
                      <img src={post.authorAvatar} alt={post.author} className="post-avatar" />
                      <div className="post-meta">
                        <h4 className="post-author">{post.author}</h4>
                        <p className="post-time">{formatRelativeTime(post.createdAt)}</p>
                      </div>
                    </div>
                    <button className="post-options">
                      <span>⋮</span>
                    </button>
                  </div>
                  <div className="post-content">
                    <p>{post.content}</p>
                    {post.image && (
                      <div className="post-image-container">
                        <img src={post.image} alt="Post" className="post-image" />
                      </div>
                    )}
                  </div>
                  <div className="post-stats">
                    <div className="post-likes">
                      <span className="like-icon">👍</span>
                      <span>{post.likes}</span>
                    </div>
                    <div className="post-comments-count">
                      <span>{post.comments.length} comments</span>
                    </div>
                  </div>
                  <div className="post-actions">
                    <button 
                      className={`post-action-button ${post.isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <span className="action-icon">👍</span>
                      <span>Like</span>
                    </button>
                    <button className="post-action-button">
                      <span className="action-icon">💬</span>
                      <span>Comment</span>
                    </button>
                    <button className="post-action-button">
                      <span className="action-icon">➡️</span>
                      <span>Share</span>
                    </button>
                  </div>
                  {post.comments.length > 0 && (
                    <div className="post-comments">
                      {post.comments.map(comment => (
                        <div className="comment" key={comment.id}>
                          <img src="/images/default-avatar.png" alt={comment.author} className="comment-avatar" />
                          <div className="comment-content">
                            <h5 className="comment-author">{comment.author}</h5>
                            <p className="comment-text">{comment.content}</p>
                            <div className="comment-actions">
                              <button className="comment-action">Like</button>
                              <button className="comment-action">Reply</button>
                              <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="add-comment">
                    <img src="/images/default-avatar.png" alt="User" className="comment-avatar" />
                    <input type="text" className="comment-input" placeholder="Write a comment..." />
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar sidebar-right">
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Sponsored</h3>
            <div className="sponsored-item">
              <img src="https://via.placeholder.com/150x100" alt="Sponsored" className="sponsored-image" />
              <div className="sponsored-content">
                <h4>Premium Web Hosting</h4>
                <p>Get 50% off your first 3 months</p>
              </div>
            </div>
            <div className="sponsored-item">
              <img src="https://via.placeholder.com/150x100" alt="Sponsored" className="sponsored-image" />
              <div className="sponsored-content">
                <h4>Learn Web Development</h4>
                <p>Start your journey today</p>
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Birthdays</h3>
            <div className="birthday-item">
              <span className="birthday-icon">🎂</span>
              <p><strong>John Smith</strong> and <strong>2 others</strong> have birthdays today.</p>
            </div>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Contacts</h3>
            <ul className="contacts-list">
              <li className="contact-item">
                <div className="contact-info">
                  <img src="/images/default-avatar.png" alt="Contact" className="contact-avatar" />
                  <span className="contact-name">Jane Doe</span>
                </div>
                <span className="online-indicator"></span>
              </li>
              <li className="contact-item">
                <div className="contact-info">
                  <img src="/images/default-avatar.png" alt="Contact" className="contact-avatar" />
                  <span className="contact-name">John Smith</span>
                </div>
                <span className="online-indicator"></span>
              </li>
              <li className="contact-item">
                <div className="contact-info">
                  <img src="/images/default-avatar.png" alt="Contact" className="contact-avatar" />
                  <span className="contact-name">Alice Johnson</span>
                </div>
                <span className="online-indicator"></span>
              </li>
              <li className="contact-item">
                <div className="contact-info">
                  <img src="/images/default-avatar.png" alt="Contact" className="contact-avatar" />
                  <span className="contact-name">Bob Wilson</span>
                </div>
                <span className="online-indicator offline"></span>
              </li>
              <li className="contact-item">
                <div className="contact-info">
                  <img src="/images/default-avatar.png" alt="Contact" className="contact-avatar" />
                  <span className="contact-name">Emily Brown</span>
                </div>
                <span className="online-indicator"></span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
