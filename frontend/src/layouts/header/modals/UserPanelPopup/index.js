import React from 'react';
import {
    FaCog,
    FaQuestionCircle,
    FaMoon,
    FaCommentDots,
    FaSignOutAlt,
} from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import useLogout from '../../../../hooks/useLogout';
import { ROUTERS } from '../../../../utils/router';
import './style.scss';
import AvatarUser from '../../../../components/avatarUser';

export const UserPanelPopup = ({ type, user, onClose }) => {
    const logout = useLogout();

    const menuItems = [
        {
            icon: <FaCog />,
            label: 'Cài đặt & quyền riêng tư',
            onClick: () => { },
        },
        {
            icon: <FaQuestionCircle />,
            label: 'Trợ giúp & hỗ trợ',
            onClick: () => { },
        },
        {
            icon: <FaMoon />,
            label: 'Màn hình & trợ năng',
            onClick: () => { },
        },
        {
            icon: <FaCommentDots />,
            label: 'Đóng góp ý kiến',
            onClick: () => { },
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
        <div className="popup__user-panel">
            {type === 'user' && (
                <section className="popup__section popup__section--user">
                    <header className="popup__user-header">
                        <Link
                            to={ROUTERS.USER.PROFILE}
                            className="popup__user-info"
                            onClick={onClose}
                        >
                            <div className="popup__avatar">
                                <AvatarUser user={user} />
                            </div>
                            <span className="popup__username">{user.userName}</span>
                        </Link>
                    </header>

                    <ul className="popup__menu">
                        {menuItems.map((item, index) => (
                            <li key={index} className="popup__menu-item">
                                <button
                                    type="button"
                                    className="popup__menu-button"
                                    onClick={item.onClick}
                                >
                                    <span className="popup__menu-icon">{item.icon}</span>
                                    <span className="popup__menu-label">{item.label}</span>
                                    <span className="popup__menu-arrow"><FaChevronRight /></span>
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
                <section className="popup__section popup__section--notification">
                    <header className="popup__section-header">
                        <h3 className="popup__section-title">Thông báo</h3>
                        <button type="button" className="popup__section-more">
                            <BsThreeDots />
                        </button>
                    </header>

                    <ul className="popup__notification-list">
                        <li className="popup__notification-item">
                            <span className="popup__notification-text">Bạn có 1 thông báo mới</span>
                        </li>
                    </ul>
                </section>
            )}

            {type === 'mess' && (
                <section className="popup__section popup__section--message">
                    <header className="popup__section-header">
                        <h3 className="popup__section-title">Tin nhắn</h3>
                        <button type="button" className="popup__section-more">
                            <BsThreeDots />
                        </button>
                    </header>

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

export default UserPanelPopup;
