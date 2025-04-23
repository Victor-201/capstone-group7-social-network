import { memo } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="Capstone Social" />
                    </Link>
                    <div className="search">
                        <input type="text" placeholder="Search Capstone Social" />
                    </div>
                </div>
                <nav className="header-center">
                    <Link to="/" className="nav-item active">
                        <span className="nav-icon">🏠</span>
                    </Link>
                    <Link to="/watch" className="nav-item">
                        <span className="nav-icon">🎥</span>
                    </Link>
                    <Link to="/marketplace" className="nav-item">
                        <span className="nav-icon">🛍️</span>
                    </Link>
                    <Link to="/groups" className="nav-item">
                        <span className="nav-icon">👥</span>
                    </Link>
                </nav>
                <div className="header-right">
                    <button className="profile-button">
                        <img src="/images/default-avatar.png" alt="Profile" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default memo(Header);