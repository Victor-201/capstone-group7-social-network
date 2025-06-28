import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from './login';
import RegisterForm from './register';
import ForgotPassword from './forgotPassword';
import Logo from '../../../assets/images/logo/logo.png';

import './style.scss';

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const isForgotPassword = location.pathname === '/forgot-password';

  const getHeaderContent = () => {
    if (isLogin) {
      return (
        <>
          <h2>Đăng nhập</h2>
          <p className="auth-description">Chào mừng trở lại! Đăng nhập để tiếp tục.</p>
        </>
      );
    } else if (isRegister) {
      return (
        <>
          <h2>Đăng ký tài khoản</h2>
          <p className="auth-description">Tham gia cùng Nova để kết nối với mọi người.</p>
        </>
      );
    } else if (isForgotPassword) {
      return (
        <>
          <h2>Quên mật khẩu</h2>
          <p className="auth-description">Nhập email để nhận mã OTP đặt lại mật khẩu.</p>
        </>
      );
    }
  };

  const getFooterContent = () => {
    if (isLogin) {
      return <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>;
    } else if (isRegister) {
      return <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>;
    } else if (isForgotPassword) {
      return <p>Nhớ mật khẩu? <Link to="/login">Đăng nhập</Link></p>;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="auth-header">
          {getHeaderContent()}
        </div>

        {isLogin && <LoginForm />}
        {isRegister && <RegisterForm />}
        {isForgotPassword && <ForgotPassword />}

        <div className="auth-footer">
          {getFooterContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
