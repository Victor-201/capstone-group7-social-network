import React, { memo, useState, useEffect, useRef } from 'react';
import { ROUTERS } from '../../utils/router';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaPhotoVideo, FaShoppingCart, FaUsers, FaSignOutAlt, FaSearch, FaUserFriends } from 'react-icons/fa';
import './style.scss';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState({
        userName: '',
        avatar: null
    });
    const [menus, setMenus] = useState([]); // State for menus
    const menuRef = useRef(null); // Tham chiếu đến menu
    const role = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            const authHeader = sessionStorage.getItem('authHeader');
            fetch(`http://localhost:8083/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': authHeader, // Thêm Basic Auth header
                },
            })
                .then(response => response.json())
                .then(data => {
                    setUser(data); // Lưu thông tin người dùng vào state
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Cập nhật menus khi sessionStorage thay đổi
    useEffect(() => {
        const baseMenus = [
            { name: 'Trang chủ', icon: <FaHome />, path: ROUTERS.USER.HOME },
            { name: 'Bạn bè', icon: <FaUserFriends />, path: ROUTERS.USER.FRIENDS },
            { name: 'Video', icon: <FaPhotoVideo />, path: ROUTERS.USER.WATCH },
            { name: 'Cửa hàng', icon: <FaShoppingCart />, path: ROUTERS.USER.MARKETPLACE },
            { name: 'Nhóm', icon: <FaUsers />, path: ROUTERS.USER.GROUPS },
        ];

        if (role === 'ROLE_ADMIN') {
            baseMenus.push({ name: "Quản lý", path: ROUTERS.ADMIN });
        }

        setMenus(baseMenus); // Cập nhật menus
    }, [role, userId]); // Theo dõi sự thay đổi của role và userId

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Xóa thông tin đăng nhập khỏi sessionStorage
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('authHeader'); // Xóa cả authHeader nếu có
        // Hiển thị thông báo
        alert('Đăng xuất thành công');

        // Cập nhật lại menu sau khi đăng xuất
        setMenus([]); // Đặt menus về trạng thái rỗng

        // Chuyển hướng người dùng về trang đăng nhập
        navigate(ROUTERS.USER.HOME);
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="header-left">
                        <Link to="/" className="logo">
                            <h1>nova</h1>
                        </Link>
                        <div className="search">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="Tìm kiếm trên Nova" />
                        </div>
                    </div>
                    <nav className="header-center">
                        <ul className="header-menu">
                            {menus.map((menu, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={menu.path}
                                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                                    >
                                        <span className="nav-icon">{menu.icon}</span>
                                        <span className="nav-text">{menu.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="header-right">
                        <Link to={ROUTERS.USER.USER_PROFILE} className="profile-button">
                            <img
                                src={user.avatar ? `uploads/images/${user.avatar}` : `uploads/images/default_avatar.png`}
                                alt="Avatar"
                                className="avatar"
                            />
                            <span className="username">{user?.fullName || user?.username}</span>
                        </Link>
                        <button className="logout-button" onClick={handleLogout}>
                            <span className="logout-icon"><FaSignOutAlt /></span>
                            <span className="logout-text">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
export default memo(Header);