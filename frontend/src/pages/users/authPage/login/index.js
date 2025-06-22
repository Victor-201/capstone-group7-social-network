import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogin } from '../../../../hooks/auth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    login_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { loginUser } = useLogin(); // Sử dụng hook useLogin

  // Check for success message from forgot password
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
      const result = await loginUser(formData);
      
      if (!result.success) {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              id="login_name"
              name="login_name"
              value={formData.login_name}
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
          
          <div className="forgot-password-link">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </form>
    </>
  );
};

export default LoginPage;