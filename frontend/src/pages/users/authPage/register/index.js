import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../../../hooks/auth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    confirm_password: '',
    full_name: '',
    phone_number: '',
    gender: '',
    birth_date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerUser } = useRegister();

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
      console.log("Register form data:", formData);
      
      // Kiểm tra password confirmation
      if (formData.password !== formData.confirm_password) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }

      console.log("Calling register function...");
      // Sử dụng hàm register từ AuthContext
      const result = await registerUser(formData);
      console.log("Register result:", result);
      
      if (!result.success) {
        throw new Error(result.message || 'Đăng ký thất bại');
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
    <>
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên *</label>
            <input
              type="text"
              id="fullName"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên của bạn"
              minLength="3"
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập *</label>
            <input
              type="text"
              id="username"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
              minLength="3"
              maxLength="30"
              pattern="[a-zA-Z0-9]+"
              title="Tên đăng nhập chỉ được chứa chữ cái và số"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="Nhập số điện thoại"
              pattern="[0-9]{10,15}"
              title="Số điện thoại phải có từ 10-15 chữ số"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Giới tính *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Ngày sinh *</label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Tạo mật khẩu mới"
              minLength="6"
              maxLength="255"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
              minLength="6"
              maxLength="255"
            />
          </div>

          <div className="form-action">
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>
        </form>
      </>
  );
};

export default RegisterPage;