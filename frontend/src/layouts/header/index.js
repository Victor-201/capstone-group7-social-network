import React, { memo, useState, useEffect, useRef } from 'react';
import { ROUTERS } from '../../utils/router';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome, FaPhotoVideo, FaShoppingCart, FaUsers, FaCaretDown,
  FaSearch, FaUserFriends, FaRegComment
} from 'react-icons/fa';
import { MdNotificationsActive } from "react-icons/md";
import './style.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState({ userName: '', avatar: null });
  const [menus, setMenus] = useState([]);
  const menuRef = useRef(null);
  const role = sessionStorage.getItem('role');
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const authHeader = sessionStorage.getItem('authHeader');
      fetch(`http://localhost:8083/api/user/${userId}`, {
        method: 'GET',
        headers: { 'Authorization': authHeader }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error('Error fetching user:', err));
    }
  }, [userId]);

  useEffect(() => {
    const baseMenus = [
      { name: 'Trang chủ', icon: <FaHome />, path: ROUTERS.USER.HOME },
      { name: 'Bạn bè', icon: <FaUserFriends />, path: ROUTERS.USER.FRIENDS },
      { name: 'Video', icon: <FaPhotoVideo />, path: ROUTERS.USER.WATCH },
      { name: 'Cửa hàng', icon: <FaShoppingCart />, path: ROUTERS.USER.MARKETPLACE },
      { name: 'Nhóm', icon: <FaUsers />, path: ROUTERS.USER.GROUPS },
    ];

    if (role === 'ROLE_ADMIN') {
      baseMenus.push({ name: 'Quản lý', path: ROUTERS.ADMIN });
    }

    setMenus(baseMenus);
  }, [role, userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    sessionStorage.clear();
    alert('Đăng xuất thành công');
    setMenus([]);
    navigate(ROUTERS.USER.HOME);
  };

  return (
    <header className="header">
      <div className="header__container">
        
        <div className="header__left">
          <Link to="/" className="header__logo">
            <h1 className="header__logo-text">nova</h1>
          </Link>

          <form className="header__search" role="search">
            <FaSearch className="header__search-icon" />
            <input
              type="text"
              className="header__search-input"
              placeholder="Tìm kiếm trên Nova"
            />
          </form>
        </div>

        <nav className="header__nav" role="navigation">
          <ul className="header__menu">
            {menus.map((menu, index) => (
              <li key={index} className="header__menu-item">
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `header__nav-link${isActive ? ' header__nav-link--active' : ''}`
                  }
                >
                  <span className="header__nav-icon">{menu.icon}</span>
                  <span className="header__nav-text">{menu.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__right">
          <div className="header__icon-group">
            <div className="header__icon">
              <MdNotificationsActive className="header__icon-image" />
              <span className="header__icon-badge"><FaCaretDown /></span>
            </div>
            <div className="header__icon">
              <FaRegComment className="header__icon-image" />
              <span className="header__icon-badge"><FaCaretDown /></span>
            </div>
            <div className="header__icon">
              <Link to={ROUTERS.USER.USER_PROFILE} className="header__avatar">
                <img
                  src={user.avatar || '/uploads/images/default_avatar.png'}
                  alt="Avatar"
                  className="header__avatar-image"
                />
              </Link>
              <span className="header__icon-badge"><FaCaretDown /></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
