import React, { memo, useState, useEffect, useRef } from 'react';
import { ROUTERS } from '../../utils/router';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { RiHome9Line, RiHome9Fill, RiGroupLine, RiGroupFill, RiFolderVideoLine, RiFolderVideoFill } from 'react-icons/ri';
import { TiGroupOutline, TiGroup } from 'react-icons/ti';
import { IoNotifications, IoArrowBack } from 'react-icons/io5';
import { TbMessageCircleFilled } from 'react-icons/tb';
import { FaSearch, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import './style.scss';
import UserPanelPopup from './modals/UserPanelPopup';
import AvatarUser from '../../components/avatarUser';
import Logo from '../../assets/images/logo/logo.png';
import useClickOutside from '../../hooks/useClickOutside';
import { useUserInfo } from '../../hooks/user';
import { useSearch } from '../../hooks/search';
import Loader from '../../components/loader';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/notifications';


const Header = () => {
    const { auth } = useAuth();
    const [activeUsePanelPopup, setActiveUsePanelPopup] = useState(null);
    const [isFocusedSearch, setIsFocusedSearch] = useState(false);
    const popupUserPanelRef = useRef(null);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [menus, setMenus] = useState([]);
    const { userInfo, loading, error } = useUserInfo();
    const { loading: loadingSearch, error: errorSearch, results: searchResults, search } = useSearch();
    const {
        notifications,
        unreadCount,
        setNotifications,
        setUnreadCount,
        reloadNotifications,
        loading: loadingNotifications,
        error: errorNotifications
    } = useNotifications();

    // Set menu items based on role
    useEffect(() => {
        const baseMenus = [
            { name: 'Trang chủ', icon: <RiHome9Line />, iconActive: <RiHome9Fill />, path: ROUTERS.USER.HOME },
            { name: 'Bạn bè', icon: <RiGroupLine />, iconActive: <RiGroupFill />, path: ROUTERS.USER.FRIENDS },
            { name: 'Video', icon: <RiFolderVideoLine />, iconActive: <RiFolderVideoFill />, path: ROUTERS.USER.WATCH },
            { name: 'Nhóm', icon: <TiGroupOutline />, iconActive: <TiGroup />, path: ROUTERS.USER.GROUPS },
        ];

        if (auth.role === 'ROLE_ADMIN') {
            baseMenus.push({ name: 'Quản lý', path: ROUTERS.ADMIN });
        }

        setMenus(baseMenus);
    }, [auth.role]);
    // Handle clicks outside to close popups
    useClickOutside(popupUserPanelRef, () => {
        setActiveUsePanelPopup(null);
    });

    // Handle click outside for search input
    useClickOutside(searchRef, () => {
        setIsFocusedSearch(false);
    });

    const handleSearch = (query) => {
        search(query, "users");
    };


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
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Tìm kiếm trên Nova"
                            />
                        </form>
                        {isFocusedSearch && (
                            <>
                                <button className="header__search-close" onClick={() => setIsFocusedSearch(false)}>
                                    <IoArrowBack />
                                </button>
                                {isFocusedSearch && (
                                    <ul className="header__search-suggestions">
                                        {searchResults.length > 0 && searchResults.map((user) => (
                                            <li
                                                key={user.id}
                                                className="header__search-item"
                                                onClick={() => navigate(ROUTERS.USER.PROFILE.replace(':user_name', user.userAccount.user_name))}
                                            >
                                                <div className="search-item__info">
                                                    <h3>{user.full_name}</h3>
                                                    {user.isFriend ? <span className="search-item__is-friend">Bạn bè</span> : null}
                                                    {user.mutualFriendsCount > 0 ? <span>{user.mutualFriendsCount} bạn chung</span> : null}
                                                </div>
                                                <div className="search-item__avatar">
                                                    <AvatarUser user={user} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
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
                            {unreadCount > 0 && <span className="header__icon-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                        </div>
                        <div
                            className="header__icon"
                            onClick={() => setActiveUsePanelPopup(activeUsePanelPopup === 'user' ? null : 'user')}
                        >
                            <div className="header__avatar">
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <AvatarUser user={userInfo} />
                                )}
                            </div>
                            <span className="header__icon-badge header__avatar-badge">
                                {activeUsePanelPopup === 'user' ? <FaCaretUp /> : <FaCaretDown />}
                            </span>
                        </div>
                        {activeUsePanelPopup && (
                            <UserPanelPopup
                                type={activeUsePanelPopup}
                                user={userInfo}
                                onClose={() => setActiveUsePanelPopup(null)}
                                reloadFns={{
                                    notifications: reloadNotifications,
                                }}
                                notiData={{
                                    notifications,
                                    loadingNotifications,
                                    errorNotifications,
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );

};

export default memo(Header);
