import React from 'react';
import {
    FaCog,
    FaQuestionCircle,
    FaMoon,
    FaCommentDots,
    FaSignOutAlt,
} from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
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
                <section className="header-popup__section header-popup__section--user">
                    <header className="header-popup__user-header">
                        <Link
                            to={ROUTERS.USER.PROFILE}
                            className="header-popup__user-info"
                            onClick={onClose}
                        >
                            <img
                                src={user.avatar || '/Uploads/images/default_avatar.png'}
                                alt="Avatar"
                                className="header-popup__avatar"
                            />
                            <span className="header-popup__username">{user.userName}</span>
                        </Link>
                    </header>

                    <ul className="header-popup__menu">
                        {menuItems.map((item, index) => (
                            <li key={index} className="header-popup__menu-item">
                                <button
                                    type="button"
                                    className="header-popup__menu-button"
                                    onClick={item.onClick}
                                >
                                    <span className="header-popup__menu-icon">{item.icon}</span>
                                    <span className="header-popup__menu-label">{item.label}</span>
                                    <span className="header-popup__menu-arrow">›</span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <footer className="header-popup__footer">
                        Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo · Cookie · Xem thêm · Meta © 2025
                    </footer>
                </section>
            )}

            {type === 'noti' && (
                <section className="header-popup__section header-popup__section--notification">
                    <header className="header-popup__section-header">
                        <h3 className="header-popup__section-title">Thông báo</h3>
                        <button type="button" className="header-popup__section-more">
                            <BsThreeDots />
                        </button>
                    </header>

                    <ul className="header-popup__notification-list">
                        <li className="header-popup__notification-item">
                            <span className="header-popup__notification-text">Bạn có 1 thông báo mới</span>
                        </li>
                    </ul>
                </section>
            )}

            {type === 'mess' && (
                <section className="header-popup__section header-popup__section--message">
                    <header className="header-popup__section-header">
                        <h3 className="header-popup__section-title">Tin nhắn</h3>
                        <button type="button" className="header-popup__section-more">
                            <BsThreeDots />
                        </button>
                    </header>

                    <ul className="header-popup__message-list">
                        <li className="header-popup__message-item">
                            <span className="header-popup__message-text">Bạn có 1 tin nhắn mới</span>
                        </li>
                    </ul>
                </section>
            )}
        </div>
    );
};

export default HeaderPopup;
