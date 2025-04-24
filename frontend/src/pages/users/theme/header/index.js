import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import DefaultAvatar from '../../../../components/DefaultAvatar';
import { FaHome, FaVideo, FaShoppingCart, FaUsers, FaSignOutAlt, FaSearch, FaUserFriends } from 'react-icons/fa';
import './style.scss';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // Xử lý sự kiện khi nhấn vào nút đăng xuất
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
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
                    <Link to="/" className="nav-item active">
                        <span className="nav-icon"><FaHome /></span>
                    </Link>
                    <Link to="/watch" className="nav-item">
                        <span className="nav-icon"><FaVideo /></span>
                    </Link>
                    <Link to="/marketplace" className="nav-item">
                        <span className="nav-icon"><FaShoppingCart /></span>
                    </Link>
                    <Link to="/groups" className="nav-item">
                        <span className="nav-icon"><FaUsers /></span>
                    </Link>
                    <Link to="/friends" className="nav-item">
                        <span className="nav-icon"><FaUserFriends /></span>
                    </Link>
                </nav>
                <div className="header-right">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <Link to="/personal" className="profile-button">
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt="Profile" 
                                        onError={(e) => {e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block';}}
                                    />
                                ) : (
                                    <DefaultAvatar size={32} />
                                )}
                                <span className="username">{user?.fullName || user?.username}</span>
                            </Link>
                            <button className="logout-button" onClick={handleLogout}>
                                <span className="logout-icon"><FaSignOutAlt /></span>
                                <span className="logout-text">Đăng xuất</span>
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-button">Đăng nhập</Link>
                            <Link to="/register" className="register-button">Đăng ký</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default memo(Header);