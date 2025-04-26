import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import DefaultAvatar from '../../../components/DefaultAvatar';
import { 
  FaExclamationTriangle, 
  FaUser, 
  FaInfo, 
  FaSave, 
  FaUpload, 
  FaImage, 
  FaCamera, 
  FaPencilAlt,
  FaUserFriends,
  FaImages,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaEllipsisH,
  FaGlobe,
  FaLock,
  FaUserPlus,
  FaEnvelope,
  FaBriefcase,
  FaHome,
  FaGraduationCap,
  FaHeart,
  FaTimes,
  FaSpinner,
  FaCheck
} from 'react-icons/fa';
import './style.scss';

const PersonalPage = () => {
  const { user, isAuthenticated, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [previewCoverImage, setPreviewCoverImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const fileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    education: '',
    work: '',
    relationship: '',
  });
  
  // New state variables for popups
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [showCoverPopup, setShowCoverPopup] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingCover, setSavingCover] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Fetch all user data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [isAuthenticated, navigate]);

  const fetchUserData = async () => {
    setFetchingData(true);
    try {
      // Fetch user profile
      if (user) {
        setFormData({
          fullName: user.fullName || '',
          bio: user.bio || '',
          location: user.location || '',
          education: user.education || '',
          work: user.work || '',
          relationship: user.relationship || '',
        });
        setPreviewImage(user.avatar || '');
        setPreviewCoverImage(user.coverImage || '');
        setUserProfile(user);
      }

      // Fetch user's posts
      await fetchUserPosts();

      // Fetch user's friends
      await fetchUserFriends();

    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile data");
    } finally {
      setFetchingData(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      // Use the userId parameter with the main posts endpoint
      const response = await fetch(`${API_URL}/api/posts?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const fetchUserFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/friends/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setFriends(data || []);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle file selection and show popup - Avatar
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setShowAvatarPopup(true); // Show the popup after selecting image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover photo file selection and show popup
  const handleCoverFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCoverFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewCoverImage(e.target.result);
        setShowCoverPopup(true); // Show the popup after selecting image
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Trigger cover file input click
  const triggerCoverFileInput = () => {
    coverFileInputRef.current.click();
  };

  // Save avatar image to database
  const handleSaveAvatar = async () => {
    setSavingAvatar(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      // Prepare form data for avatar update only
      const formDataToSend = new FormData();
      formDataToSend.append('avatar', selectedFile);

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        let errorMessage = 'Có lỗi xảy ra khi cập nhật ảnh đại diện';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      updateUserInfo(data.user);
      setMessage('Cập nhật ảnh đại diện thành công');
      setShowAvatarPopup(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingAvatar(false);
    }
  };

  // Save cover image to database
  const handleSaveCover = async () => {
    setSavingCover(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      // Prepare form data for cover update only
      const formDataToSend = new FormData();
      formDataToSend.append('coverImage', selectedCoverFile);

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        let errorMessage = 'Có lỗi xảy ra khi cập nhật ảnh bìa';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      updateUserInfo(data.user);
      setMessage('Cập nhật ảnh bìa thành công');
      setShowCoverPopup(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCover(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      }

      // Prepare form data to send
      const formDataToSend = new FormData();
      
      // Include all profile fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Only include avatar if a file was selected
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      // Only include cover image if a file was selected
      if (selectedCoverFile) {
        formDataToSend.append('coverImage', selectedCoverFile);
      }

      // Send request to update profile with FormData
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        // Try to get the error message from the response
        let errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          // If response is not JSON, use the status text
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Update user info in context and localStorage
      updateUserInfo(data.user);
      
      // Reset selected files after successful upload
      setSelectedFile(null);
      setSelectedCoverFile(null);

      // Show success message
      setMessage('Cập nhật thông tin thành công');
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handlePostLike = async (postId) => {
    // Implementation for liking a post
    console.log("Like post:", postId);
  };

  const handlePostComment = async (postId) => {
    // Implementation for commenting on a post
    console.log("Comment on post:", postId);
  };

  // Handle sharing a post
  const handlePostShare = async (postId) => {
    if (!isAuthenticated) {
      setError("Bạn cần đăng nhập để chia sẻ bài viết");
      return;
    }

    // Show dialog to add share content
    const shareContent = prompt("Chia sẻ bài viết này với nội dung của bạn:", "");
    
    // If user cancels prompt, return
    if (shareContent === null) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/share`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId,
          content: shareContent,
          privacy: 'public'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setMessage("Đã chia sẻ bài viết thành công!");
      
      // Re-fetch posts to see updates
      fetchUserPosts();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message || "Không thể chia sẻ bài viết. Vui lòng thử lại sau.");
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (fetchingData) {
    return (
      <div className="personal-page">
        <div className="profile-loading">
          <div className="loader"></div>
          <p>Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-page">
      {/* Display alerts if there are any */}
      {message && (
        <div className="alert alert-success">
          <FaInfo className="alert-icon" /> {message}
        </div>
      )}
      {error && (
        <div className="alert alert-danger">
          <FaExclamationTriangle className="alert-icon" /> {error}
        </div>
      )}
      
      {!isEditing ? (
        // Profile View Mode
        <div className="profile-view">
          {/* Cover Photo */}
          <div className="profile-cover-container">
            <div className="profile-cover">
              {previewCoverImage ? (
                <img 
                  src={previewCoverImage} 
                  alt="Cover" 
                  className="cover-image" 
                />
              ) : (
                <div className="default-cover"></div>
              )}
              <button className="cover-edit-button" onClick={triggerCoverFileInput}>
                <FaCamera /> Thay đổi ảnh bìa
              </button>
              <input
                type="file"
                ref={coverFileInputRef}
                style={{ display: 'none' }}
                onChange={handleCoverFileSelect}
                accept="image/*"
              />
              {showCoverPopup && (
                <div className="popup">
                  <div className="popup-content">
                    <h3>Xác nhận thay đổi ảnh bìa</h3>
                    <div className="popup-preview">
                      <img src={previewCoverImage} alt="Cover Preview" />
                    </div>
                    <div className="popup-actions">
                      <button 
                        className="popup-cancel-button" 
                        onClick={() => setShowCoverPopup(false)}
                      >
                        Hủy
                      </button>
                      <button 
                        className="popup-save-button" 
                        onClick={handleSaveCover}
                        disabled={savingCover}
                      >
                        {savingCover ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Picture and Name */}
            <div className="profile-header">
              <div className="profile-picture-container">
                <div className="profile-picture">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="avatar-image" 
                    />
                  ) : (
                    <DefaultAvatar size={168} />
                  )}
                  <button className="avatar-edit-button" onClick={triggerFileInput}>
                    <FaCamera />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept="image/*"
                  />
                  {showAvatarPopup && (
                    <div className="popup">
                      <div className="popup-content">
                        <h3>Xác nhận thay đổi ảnh đại diện</h3>
                        <div className="popup-preview">
                          <img src={previewImage} alt="Avatar Preview" />
                        </div>
                        <div className="popup-actions">
                          <button 
                            className="popup-cancel-button" 
                            onClick={() => setShowAvatarPopup(false)}
                          >
                            Hủy
                          </button>
                          <button 
                            className="popup-save-button" 
                            onClick={handleSaveAvatar}
                            disabled={savingAvatar}
                          >
                            {savingAvatar ? 'Đang lưu...' : 'Lưu'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-info-header">
                <h1>{formData.fullName || user?.username}</h1>
                {friends.length > 0 && (
                  <p className="friends-count">{friends.length} bạn bè</p>
                )}
                <div className="profile-actions">
                  <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
                    <FaPencilAlt /> Chỉnh sửa trang cá nhân
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Navigation */}
            <div className="profile-nav">
              <div className="nav-tabs">
                <button 
                  className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  Bài viết
                </button>
                <button 
                  className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => setActiveTab('about')}
                >
                  Giới thiệu
                </button>
                <button 
                  className={`nav-tab ${activeTab === 'friends' ? 'active' : ''}`}
                  onClick={() => setActiveTab('friends')}
                >
                  Bạn bè
                </button>
                <button 
                  className={`nav-tab ${activeTab === 'photos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('photos')}
                >
                  Ảnh
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="profile-content">
            <div className="profile-main">
              {/* Left Column */}
              <div className="profile-left-column">
                {/* Intro Card */}
                <div className="profile-card intro-card">
                  <h2>Giới thiệu</h2>
                  {formData.bio && (
                    <p className="bio-text">{formData.bio}</p>
                  )}
                  <ul className="intro-details">
                    {formData.work && (
                      <li>
                        <FaBriefcase className="intro-icon" />
                        <span>Làm việc tại {formData.work}</span>
                      </li>
                    )}
                    {formData.education && (
                      <li>
                        <FaGraduationCap className="intro-icon" />
                        <span>Học tại {formData.education}</span>
                      </li>
                    )}
                    {formData.location && (
                      <li>
                        <FaHome className="intro-icon" />
                        <span>Sống tại {formData.location}</span>
                      </li>
                    )}
                    {formData.relationship && (
                      <li>
                        <FaHeart className="intro-icon" />
                        <span>{formData.relationship}</span>
                      </li>
                    )}
                  </ul>
                  <button 
                    className="edit-intro-button"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaPencilAlt /> Chỉnh sửa chi tiết
                  </button>
                </div>

                {/* Photos Card */}
                <div className="profile-card photos-card">
                  <div className="card-header">
                    <h2>Ảnh</h2>
                    <Link to="/photos" className="see-all">
                      Xem tất cả ảnh
                    </Link>
                  </div>
                  <div className="photos-grid">
                    {posts
                      .filter(post => post.image)
                      .slice(0, 9)
                      .map((post, index) => (
                        <div key={index} className="photo-item">
                          <img src={post.image} alt={`Photo ${index}`} />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Friends Card */}
                <div className="profile-card friends-card">
                  <div className="card-header">
                    <h2>Bạn bè</h2>
                    <Link to="/friends" className="see-all">
                      Xem tất cả bạn bè
                    </Link>
                  </div>
                  <div className="friends-grid">
                    {friends.slice(0, 9).map((friend, index) => (
                      <div key={index} className="friend-item">
                        <Link to={`/profile/${friend.id}`}>
                          {friend.avatar ? (
                            <img src={friend.avatar} alt={friend.fullName} />
                          ) : (
                            <DefaultAvatar size={60} />
                          )}
                          <span>{friend.fullName}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Posts */}
              <div className="profile-right-column">
                {/* Create Post Card */}
                <div className="profile-card create-post-card">
                  <div className="create-post-header">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="User" 
                        className="post-avatar" 
                      />
                    ) : (
                      <DefaultAvatar size={40} />
                    )}
                    <input 
                      type="text" 
                      className="post-input" 
                      placeholder={`${user?.fullName || 'Bạn'} đang nghĩ gì?`}
                      onClick={() => console.log("Open post creator")}
                      readOnly
                    />
                  </div>
                  <div className="create-post-actions">
                    <button className="post-action-button">
                      <FaImages className="action-icon image-icon" /> Ảnh/Video
                    </button>
                    <button className="post-action-button">
                      <FaUserFriends className="action-icon" /> Gắn thẻ bạn bè
                    </button>
                    <button className="post-action-button">
                      <FaGlobe className="action-icon" /> Công khai
                    </button>
                  </div>
                </div>

                {/* Posts Feed */}
                {posts.length === 0 ? (
                  <div className="no-posts-message">
                    <p>Chưa có bài viết nào.</p>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <div key={index} className="profile-card post-card">
                      <div className="post-header">
                        <div className="post-author">
                          {previewImage ? (
                            <img 
                              src={previewImage} 
                              alt="User" 
                              className="post-avatar" 
                            />
                          ) : (
                            <DefaultAvatar size={40} />
                          )}
                          <div className="post-meta">
                            <span className="post-author-name">{user?.fullName || user?.username}</span>
                            <span className="post-time">
                              {formatDate(post.createdAt)}
                              <FaGlobe className="privacy-icon" />
                            </span>
                          </div>
                        </div>
                        <button className="post-options-button">
                          <FaEllipsisH />
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
                        <span className="like-count">
                          <FaThumbsUp className="like-icon" /> {post.likes || 0}
                        </span>
                        <span className="comment-count">
                          {post.comments?.length || 0} bình luận
                        </span>
                      </div>
                      <div className="post-actions">
                        <button 
                          className="post-action-button"
                          onClick={() => handlePostLike(post.id)}
                        >
                          <FaThumbsUp className="action-icon" /> Thích
                        </button>
                        <button 
                          className="post-action-button"
                          onClick={() => handlePostComment(post.id)}
                        >
                          <FaComment className="action-icon" /> Bình luận
                        </button>
                        <button 
                          className="post-action-button"
                          onClick={() => handlePostShare(post.id)}
                        >
                          <FaShare className="action-icon" /> Chia sẻ
                        </button>
                      </div>
                      {post.comments && post.comments.length > 0 && (
                        <div className="post-comments">
                          {post.comments.map((comment, idx) => (
                            <div key={idx} className="comment">
                              {comment.author?.avatar ? (
                                <img 
                                  src={comment.author.avatar} 
                                  alt="User" 
                                  className="comment-avatar" 
                                />
                              ) : (
                                <DefaultAvatar size={32} />
                              )}
                              <div className="comment-bubble">
                                <div className="comment-author">{comment.author?.fullName}</div>
                                <div className="comment-content">{comment.content}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="add-comment">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="User" 
                            className="comment-avatar" 
                          />
                        ) : (
                          <DefaultAvatar size={32} />
                        )}
                        <input 
                          type="text" 
                          className="comment-input" 
                          placeholder="Viết bình luận..." 
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Profile Edit Mode
        <div className="profile-container">
          <h1>Chỉnh sửa trang cá nhân</h1>
          
          <div className="profile-preview">
            <div className="avatar-preview">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Ảnh đại diện" 
                />
              ) : (
                <DefaultAvatar size={100} />
              )}
            </div>
            <div className="name-preview">
              <h2>{formData.fullName || user?.username || 'Chưa cập nhật tên'}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">
                <FaUser className="form-icon" /> Tên hiển thị
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập tên hiển thị của bạn"
              />
              <small>Tên của bạn sẽ hiển thị trên các bài đăng và bình luận</small>
            </div>

            <div className="form-group">
              <label htmlFor="fileUpload">
                <FaImage className="form-icon" /> Ảnh đại diện
              </label>
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                accept="image/*"
              />
              <button type="button" onClick={triggerFileInput} className="upload-button">
                <FaUpload className="button-icon" /> Chọn ảnh từ máy tính
              </button>
              {selectedFile && (
                <div className="selected-file-name">
                  Đã chọn: {selectedFile.name}
                </div>
              )}
              <small>Chọn một tệp hình ảnh từ máy tính của bạn (JPEG, PNG, GIF)</small>
            </div>

            <div className="form-group">
              <label htmlFor="coverFileUpload">
                <FaImage className="form-icon" /> Ảnh bìa
              </label>
              <input
                type="file"
                id="coverFileUpload"
                ref={coverFileInputRef}
                style={{ display: 'none' }}
                onChange={handleCoverFileSelect}
                accept="image/*"
              />
              <button type="button" onClick={triggerCoverFileInput} className="upload-button">
                <FaUpload className="button-icon" /> Chọn ảnh bìa từ máy tính
              </button>
              {selectedCoverFile && (
                <div className="selected-file-name">
                  Đã chọn: {selectedCoverFile.name}
                </div>
              )}
              <small>Chọn một tệp hình ảnh từ máy tính của bạn (JPEG, PNG, GIF)</small>
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                <FaInfo className="form-icon" /> Giới thiệu bản thân
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Viết một vài điều về bản thân bạn"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">
                <FaHome className="form-icon" /> Địa chỉ
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="education">
                <FaGraduationCap className="form-icon" /> Học vấn
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Nhập thông tin học vấn của bạn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="work">
                <FaBriefcase className="form-icon" /> Công việc
              </label>
              <input
                type="text"
                id="work"
                name="work"
                value={formData.work}
                onChange={handleChange}
                placeholder="Nhập thông tin công việc của bạn"
              />
            </div>

            <div className="form-group">
              <label htmlFor="relationship">
                <FaHeart className="form-icon" /> Tình trạng mối quan hệ
              </label>
              <input
                type="text"
                id="relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                placeholder="Ví dụ: Độc thân, Đã kết hôn,..."
              />
            </div>

            <div className="form-action">
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                <FaTimes /> Hủy
              </button>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Đang xử lý...' : (
                  <>
                    <FaSave className="button-icon" /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PersonalPage;