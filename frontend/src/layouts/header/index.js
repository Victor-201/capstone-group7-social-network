import React, { memo, useState, useEffect, useRef } from 'react';
import { ROUTERS } from '../../utils/router';
import { Link, NavLink } from 'react-router-dom';
import { RiHome9Line, RiHome9Fill, RiGroupLine, RiGroupFill, RiFolderVideoLine, RiFolderVideoFill} from 'react-icons/ri';
import { TiGroupOutline, TiGroup } from 'react-icons/ti';
import { IoNotifications } from 'react-icons/io5';
import { TbMessageCircleFilled } from 'react-icons/tb';
import { FaSearch, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import './style.scss';
import UserPanelPopup from './modals/UserPanelPopup';
import AvatarUser from '../../components/avatarUser';
import Logo from '../../assets/images/logo/logo.png';
import SearchPopup from './modals/SearchPopup';
import useClickOutside from '../../hooks/useClickOutside';

const Header = () => {
    const [activeUsePanelPopup, setActiveUsePanelPopup] = useState(null); // 'user', 'noti', 'mess'
    const [isFocusedSearch, setIsFocusedSearch] = useState(false);
    const popupUserPanelRef = useRef(null);
    const searchRef = useRef(null); // Thêm ref cho phần tìm kiếm
    const [user, setUser] = useState({ userName: 'Văn Thắng', avatar: 'cld-sample-5.jpg' });
    const [menus, setMenus] = useState([]);
    const role = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('userId');

    // Fetch user data
    useEffect(() => {
        if (userId) {
            const authHeader = sessionStorage.getItem('authHeader');
            fetch(`http://localhost:8083/api/user/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': authHeader },
            })
                .then((res) => res.json())
                .then((data) => setUser(data))
                .catch((err) => console.error('Error fetching user:', err));
        }
    }, [userId]);

    // Set menu items based on role
    useEffect(() => {
        const baseMenus = [
            { name: 'Trang chủ', icon: <RiHome9Line />, iconActive: <RiHome9Fill />, path: ROUTERS.USER.HOME },
            { name: 'Bạn bè', icon: <RiGroupLine />, iconActive: <RiGroupFill />, path: ROUTERS.USER.FRIENDS },
            { name: 'Video', icon: <RiFolderVideoLine />, iconActive: <RiFolderVideoFill />, path: ROUTERS.USER.WATCH },
            { name: 'Nhóm', icon: <TiGroupOutline />, iconActive: <TiGroup />, path: ROUTERS.USER.GROUPS },
        ];

        if (role === 'ROLE_ADMIN') {
            baseMenus.push({ name: 'Quản lý', path: ROUTERS.ADMIN });
        }

        setMenus(baseMenus);
    }, [role, userId]);

    // Handle clicks outside to close popups
    useClickOutside(popupUserPanelRef, () => {
        setActiveUsePanelPopup(null);
    });

    // Handle click outside for search input
    useClickOutside(searchRef, () => {
        setIsFocusedSearch(false);
    });

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__left">
                    <Link to={ROUTERS.USER.HOME} className="header__logo">
                        <img src={Logo} alt="Nova Logo" className="header__logo-img" />
                    </Link>
                    <div className={`header__search ${isFocusedSearch ? "header__search--focused" : ""}`} ref={searchRef}>
                        <form className='header__search-form'
                            role="search"
                            onClick={() => setIsFocusedSearch(true)}
                        >
                            <FaSearch className="header__search-icon" />
                            <input
                                type="text"
                                className="header__search-input"
                                placeholder="Tìm kiếm trên Nova"
                            />
                        </form>
                    </div>
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
                                    {({ isActive }) => (
                                        <>
                                            <span className="header__nav-icon">
                                                {isActive ? menu.iconActive : menu.icon}
                                            </span>
                                            <span className="header__nav-text">{menu.name}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header__right">
                    <div className="header__icon-group" ref={popupUserPanelRef}>
                        <div className="header__icon" onClick={() => setActiveUsePanelPopup('mess')}>
                            <TbMessageCircleFilled />
                            <span className="header__icon-badge">1</span>
                        </div>
                        <div className="header__icon" onClick={() => setActiveUsePanelPopup('noti')}>
                            <IoNotifications />
                            <span className="header__icon-badge">2</span>
                        </div>
                        <div
                            className="header__icon"
                            onClick={() => setActiveUsePanelPopup(activeUsePanelPopup === 'user' ? null : 'user')}
                        >
                            <div className="header__avatar">
                                <AvatarUser user={user} />
                            </div>
                            <span className="header__icon-badge header__avatar-badge">
                                {activeUsePanelPopup === 'user' ? <FaCaretUp /> : <FaCaretDown />}
                            </span>
                        </div>
                        {activeUsePanelPopup && (
                            <UserPanelPopup
                                type={activeUsePanelPopup}
                                user={user}
                                onClose={() => setActiveUsePanelPopup(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default memo(Header);
