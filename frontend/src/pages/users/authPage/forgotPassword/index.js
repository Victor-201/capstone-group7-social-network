import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as accountApi from '../../../../api/accountApi';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load email from localStorage when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Update email in localStorage when it changes
  useEffect(() => {
    if (email) {
      localStorage.setItem('resetEmail', email);
    }
  }, [email]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await accountApi.forgotPassword(email);
      // Save email to localStorage for persistence
      localStorage.setItem('resetEmail', email);
      setStep(2);
      setSuccess('Mã OTP đã được gửi đến email của bạn');
    } catch (err) {
      setError(err.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Make sure we're using the email from localStorage if it exists
      const emailToUse = email || localStorage.getItem('resetEmail');
      
      if (!emailToUse) {
        throw new Error('Email không được tìm thấy. Vui lòng thử lại từ đầu.');
      }
      
      if (!otp || otp.length !== 6) {
        throw new Error('Mã OTP không hợp lệ. Vui lòng nhập đúng 6 chữ số.');
      }
      
      // Pass otpCode instead of otp to match API expectations
      const result = await accountApi.verifyOtp(emailToUse, otp);
      
      // Check for different possible response structures
      let token = null;
      
      if (result && result.result && result.result.resetToken) {
        token = result.result.resetToken;
      } else if (result && result.resetToken) {
        token = result.resetToken;
      } else if (result && result.token) {
        token = result.token;
      }
      
      if (token) {
        setResetToken(token);
        setStep(3);
        setSuccess('Xác thực OTP thành công. Vui lòng đặt lại mật khẩu mới.');
      } else {
        throw new Error('Không nhận được token từ server. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err.message || 'Mã OTP không hợp lệ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }
      if (newPassword.length < 6) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
      }
      
      // Check if password contains only letters and numbers
      const passwordPattern = /^[a-zA-Z0-9]+$/;
      if (!passwordPattern.test(newPassword)) {
        throw new Error('Mật khẩu chỉ được chứa chữ cái và số (không dùng ký tự đặc biệt)');
      }
      
      await accountApi.resetPassword(resetToken, newPassword);
      
      setSuccess('Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
      
      // Reset form and clear localStorage
      setStep(1);
      setEmail('');
      setOtp('');
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      localStorage.removeItem('resetEmail');
      
      // Redirect will be handled by the parent component
    } catch (err) {
      setError(err.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>
          <div className="form-action">
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </div>
          <div className="form-action">
            <Link to="/login" className="auth-button secondary">
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="auth-form">
          <div className="form-group">
            <label htmlFor="otp">Mã OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Nhập mã OTP từ email"
              maxLength="6"
              pattern="[0-9]{6}"
              title="Mã OTP phải có 6 chữ số"
            />
            <small className="form-help">
              Mã OTP đã được gửi đến email: <strong>{email}</strong>
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
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="auth-form">
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu mới (chỉ chữ cái và số)"
              minLength="6"
              pattern="[a-zA-Z0-9]+"
              title="Mật khẩu chỉ được chứa chữ cái và số"
            />
            <small className="form-help">Mật khẩu phải có ít nhất 6 ký tự và chỉ chứa chữ cái và số</small>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Nhập lại mật khẩu mới"
              minLength="6"
              pattern="[a-zA-Z0-9]+"
              title="Mật khẩu chỉ được chứa chữ cái và số"
            />
          </div>
          <div className="form-action">
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
            </button>
          </div>
          <div className="form-action">
            <button
              type="button"
              className="auth-button secondary"
              onClick={() => setStep(2)}
            >
              Quay lại
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ForgotPassword; 