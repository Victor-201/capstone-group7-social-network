import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import DefaultAvatar from '../../../components/DefaultAvatar';
import { FaExclamationTriangle, FaUser, FaInfo, FaSave, FaUpload, FaImage } from 'react-icons/fa';
import './style.scss';

const PersonalPage = () => {
  const { user, isAuthenticated, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
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
        bio: user.bio || ''
      });
      setPreviewImage(user.avatar || '');
    }
  }, [user, isAuthenticated, navigate]);

  // Xử lý khi người dùng thay đổi trường input
  const handleChange = (e) => {
    const { name, value } = e.target;
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
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
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

      // Prepare form data to send
      const formDataToSend = new FormData();
      
      // Always include fullName and bio
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('bio', formData.bio);
      
      // Only include avatar if a file was selected
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      // Send request to update profile with FormData
      const response = await fetch('http://localhost:8080/api/users/upload-avatar', {
        method: 'POST',
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

      // Cập nhật thông tin người dùng trong context và localStorage
      updateUserInfo(data.user);
      
      // Reset selected file after successful upload
      setSelectedFile(null);

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