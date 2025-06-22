import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from './login';
import RegisterForm from './register';
import Logo from '../../../assets/images/logo/logo.png';

import './style.scss';

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="auth-header">
          {isLogin ? (
            <>
              <h2>Đăng nhập</h2>
              <p className="auth-description">Chào mừng trở lại! Đăng nhập để tiếp tục.</p>
            </>
          ) : (
            <>
              <h2>Đăng ký tài khoản</h2>
              <p className="auth-description">Tham gia cùng Nova để kết nối với mọi người.</p>
            </>
          )}
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="auth-footer">
          {isLogin ? (
            <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
          ) : (
            <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
