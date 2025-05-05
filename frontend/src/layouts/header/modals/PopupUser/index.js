import React from 'react';
import {
    FaCog,
    FaQuestionCircle,
    FaMoon,
    FaCommentDots,
    FaSignOutAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useLogout from '../../../../hooks/useLogout';
import { ROUTERS } from '../../../../utils/router';
import './style.scss';

export const HeaderPopup = ({ type, user, onClose }) => {
    const logout = useLogout();

    const menuItems = [
        {
            icon: <FaCog />,
            label: 'Cài đặt & quyền riêng tư',
            onClick: () => {},
        },
        {
            icon: <FaQuestionCircle />,
            label: 'Trợ giúp & hỗ trợ',
            onClick: () => {},
        },
        {
            icon: <FaMoon />,
            label: 'Màn hình & trợ năng',
            onClick: () => {},
        },
        {
            icon: <FaCommentDots />,
            label: 'Đóng góp ý kiến',
            onClick: () => {},
        },
        {
            icon: <FaSignOutAlt />,
            label: 'Đăng xuất',
            onClick: () => {
                logout();
                onClose();
            },
        },
    ];

    return (
        <div className="header-popup">
            {type === 'user' && (
                <section className="header-popup__user">
                    <Link
                        to={ROUTERS.USER.PROFILE}
                        className="popup__user-info"
                        onClick={onClose}
                    >
                        <img
                            src={user.avatar || '/Uploads/images/default_avatar.png'}
                            alt="Avatar"
                            className="popup__avatar"
                        />
                        <span className="popup__username">{user.userName}</span>
                    </Link>
                    <ul className="popup__menu-list">
                        {menuItems.map((item, index) => (
                            <li key={index} className="popup__menu-item">
                                <button
                                    type="button"
                                    className="popup__menu-button"
                                    onClick={item.onClick}
                                >
                                    <span className="popup__icon">{item.icon}</span>
                                    <span className="popup__label">{item.label}</span>
                                    <span className="popup__arrow">›</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <footer className="popup__footer">
                        Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo · Cookie · Xem thêm · Meta © 2025
                    </footer>
                </section>
            )}

            {type === 'noti' && (
                <section className="header-popup__notification">
                    <div className="popup__notification-header">
                        <h3 className="popup__notification-title">Thông báo</h3>
                        <Link to={ROUTERS.USER.NOTIFICATION} className="popup__notification-link">
                            Xem tất cả
                        </Link>
                    </div>
                    <ul className="popup__notification-list">
                        <li className="popup__notification-item">
                            <span className="popup__notification-text">Bạn có 1 thông báo mới</span>
                        </li>
                    </ul>
                </section>
            )}

            {type === 'mess' && (
                <section className="header-popup__message">
                    <div className="popup__message-header">
                        <h3 className="popup__message-title">Tin nhắn</h3>
                        <Link to={ROUTERS.USER.MESSAGES} className="popup__message-link">
                            Xem tất cả
                        </Link>
                    </div>
                    <ul className="popup__message-list">
                        <li className="popup__message-item">
                            <span className="popup__message-text">Bạn có 1 tin nhắn mới</span>
                        </li>
                    </ul>
                </section>
            )}
        </div>
    );
};

export default HeaderPopup;

