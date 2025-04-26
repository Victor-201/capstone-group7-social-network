import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import DefaultAvatar from '../../../components/DefaultAvatar';
import { FaExclamationTriangle, FaUser, FaLink, FaInfo, FaSave, FaUpload, FaImage } from 'react-icons/fa';
import './style.scss';

const PersonalPage = () => {
  const { user, isAuthenticated, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    avatar: '',
    bio: ''
  });

  useEffect(() => {
    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Thiết lập giá trị ban đầu cho formData từ thông tin người dùng
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
      setPreviewImage(user.avatar || '');
    }
  }, [user, isAuthenticated, navigate]);

  // Xử lý khi người dùng thay đổi trường input
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Đặc biệt xử lý trường avatar
    if (name === 'avatar') {
      setPreviewImage(value);
      setImageError(false); // Reset trạng thái lỗi ảnh
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageError(false);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        // Clear the URL input since we're using a file now
        setFormData(prev => ({
          ...prev,
          avatar: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Kiểm tra xem URL ảnh có hợp lệ không
  const checkImageURL = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Xử lý khi ảnh không tải được
  const handleImageError = () => {
    setImageError(true);
  };

  // Xử lý submit form
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

      // Handle different submission methods based on whether we have a file or URL
      if (selectedFile) {
        // If we have a file, use FormData to upload it
        const formDataToSend = new FormData();
        formDataToSend.append('avatar', selectedFile);
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('bio', formData.bio);

        // Log to verify the FormData content
        console.log('Sending file upload with FormData:', {
          fileName: selectedFile.name,
          fullName: formData.fullName,
          bio: formData.bio
        });

        const response = await fetch('http://localhost:8080/api/users/upload-avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type here - it will be set automatically with the boundary parameter
          },
          body: formDataToSend
        });

        if (!response.ok) {
          // Try to get the error message from the response
          let errorMessage = 'Có lỗi xảy ra khi tải lên ảnh đại diện';
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

        // Cập nhật thông tin người dùng trong context và localStorage
        updateUserInfo(data.user);
        
        // Reset selected file after successful upload
        setSelectedFile(null);
      } else if (formData.avatar) {
        // If using URL, check if it's valid
        const isValidImage = await checkImageURL(formData.avatar);
        if (!isValidImage) {
          setImageError(true);
          throw new Error('URL ảnh không hợp lệ hoặc không tồn tại. Vui lòng kiểm tra lại.');
        }

        // Use regular JSON submission for URL-based avatar
        const response = await fetch('http://localhost:8080/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }

        // Cập nhật thông tin người dùng trong context và localStorage
        updateUserInfo(data.user);
      } else {
        // Just update other profile info without avatar
        const response = await fetch('http://localhost:8080/api/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            fullName: formData.fullName, 
            bio: formData.bio 
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }

        // Cập nhật thông tin người dùng trong context và localStorage
        updateUserInfo(data.user);
      }

      // Hiển thị thông báo thành công
      setMessage('Cập nhật thông tin thành công');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (

    
    <div className="personal-page">
      <div className="profile-container">
        <h1>Cài đặt hồ sơ cá nhân</h1>
        
        {error && (
          <div className="alert alert-danger">
            <FaExclamationTriangle className="alert-icon" /> {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success">
            <FaInfo className="alert-icon" /> {message}
          </div>
        )}
        
        <div className="profile-preview">
          <div className="avatar-preview">
            {previewImage && !imageError ? (
              <img 
                src={previewImage} 
                alt="Ảnh đại diện" 
                onError={handleImageError}
              />
            ) : (
              <DefaultAvatar size={100} />
            )}
            {imageError && (
              <div className="image-error-overlay">
                <FaExclamationTriangle />
              </div>
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
            <label htmlFor="avatar">
              <FaLink className="form-icon" /> URL ảnh đại diện
            </label>
            <input
              type="text"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="Nhập URL ảnh đại diện của bạn"
              className={imageError ? 'input-error' : ''}
            />
            <small>
              {imageError 
                ? 'URL ảnh không hợp lệ. Vui lòng kiểm tra lại đường dẫn.' 
                : 'Nhập URL hình ảnh từ internet. Ví dụ: https://example.com/your-image.jpg'}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="fileUpload">
              <FaImage className="form-icon" /> Tải ảnh từ máy tính
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
              <FaUpload className="button-icon" /> Chọn tệp
            </button>
            {selectedFile && (
              <div className="selected-file-name">
                Đã chọn: {selectedFile.name}
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

          <div className="form-action">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Đang xử lý...' : (
                <>
                  <FaSave className="button-icon" /> Cập nhật thông tin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalPage;