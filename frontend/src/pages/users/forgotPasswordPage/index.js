import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as accountApi from '../../../api/accountApi';
import './style.scss';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    otpCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await accountApi.forgotPassword(formData.email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await accountApi.verifyOtp(formData.email, formData.otpCode);
      setResetToken(result.token);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }

      if (formData.newPassword.length < 6) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
      }

      const result = await accountApi.resetPassword(resetToken, formData.newPassword);
      
      // Chuyển về trang đăng nhập với thông báo thành công
      navigate('/login', { 
        state: { 
          message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.' 
        } 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="auth-form">
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Nhập địa chỉ email của bạn"
        />
      </div>

      <div className="form-action">
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2Submit} className="auth-form">
      <div className="form-group">
        <label htmlFor="otpCode">Mã OTP *</label>
        <input
          type="text"
          id="otpCode"
          name="otpCode"
          value={formData.otpCode}
          onChange={handleChange}
          required
          placeholder="Nhập mã OTP từ email"
          maxLength="6"
        />
        <small className="form-help">
          Mã OTP đã được gửi đến email: <strong>{formData.email}</strong>
        </small>
      </div>

      <div className="form-action">
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
        </button>
      </div>

      <div className="form-action">
        <button 
          type="button" 
          className="auth-button secondary" 
          onClick={() => setStep(1)}
        >
          Quay lại
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleStep3Submit} className="auth-form">
      <div className="form-group">
        <label htmlFor="newPassword">Mật khẩu mới *</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          placeholder="Nhập mật khẩu mới"
          minLength="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Nhập lại mật khẩu mới"
          minLength="6"
        />
      </div>

      <div className="form-action">
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
        </button>
      </div>
    </form>
  );

  const getStepTitle = () => {
    switch(step) {
      case 1: return 'Quên mật khẩu';
      case 2: return 'Xác thực OTP';
      case 3: return 'Đặt lại mật khẩu';
      default: return 'Quên mật khẩu';
    }
  };

  const getStepDescription = () => {
    switch(step) {
      case 1: return 'Nhập email để nhận mã OTP đặt lại mật khẩu';
      case 2: return 'Nhập mã OTP được gửi đến email của bạn';
      case 3: return 'Nhập mật khẩu mới cho tài khoản của bạn';
      default: return '';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>nova</h1>
          <h2>{getStepTitle()}</h2>
          <p>{getStepDescription()}</p>
          
          {/* Progress indicator đã bị xoá theo yêu cầu */}
        </div>

        {error && <div className="auth-error">{error}</div>}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="auth-footer">
          <p>Nhớ mật khẩu? <Link to="/login">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
