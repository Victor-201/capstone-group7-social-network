import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './style.scss';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Sử dụng hook useAuth

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sử dụng hàm login từ AuthContext
      const result = await login(formData.username, formData.password);
      
      if (!result.success) {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }

      // Chuyển hướng đến trang chủ
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>nova</h1>
          <h2>Đăng nhập</h2>
          <p>Chào mừng trở lại! Đăng nhập để tiếp tục.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập hoặc email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div className="form-action">
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;