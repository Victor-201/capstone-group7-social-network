import React from 'react';
import { FaCog, FaQuestionCircle, FaMoon, FaCommentDots, FaSignOutAlt } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AvatarUser from '../../../../components/avatarUser';
import { ROUTERS } from '../../../../utils/router';
import { useAuth } from '../../../../contexts/AuthContext';

const UserSection = ({ user, onClose }) => {
    const {logout} = useAuth();
    const navigator = useNavigate();

    const menuItems = [
        { icon: <FaCog />, label: 'Cài đặt & quyền riêng tư', onClick: () => {} },
        { icon: <FaQuestionCircle />, label: 'Trợ giúp & hỗ trợ', onClick: () => {} },
        { icon: <FaMoon />, label: 'Màn hình & trợ năng', onClick: () => {} },
        { icon: <FaCommentDots />, label: 'Đóng góp ý kiến', onClick: () => {} },
        { icon: <FaSignOutAlt />, label: 'Đăng xuất', onClick: () => { logout(); onClose(); navigator(ROUTERS.USER.HOME) } },
    ];

    return (
        <section className="popup__section popup__section--user">
            <header className="popup__user-header">
                <Link  to={ROUTERS.USER.PROFILE.replace(':user_name', user.userAccount.user_name)} className="popup__user-info" onClick={onClose}>
                    <div className="popup__avatar">
                        <AvatarUser user={user} />
                    </div>
                    <span className="popup__username">{user.full_name}</span>
                </Link>
            </header>

            <ul className="popup__menu">
                {menuItems.map((item, index) => (
                    <li key={index} className="popup__menu-item">
                        <button type="button" className="popup__menu-button" onClick={item.onClick}>
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
    );
};

export default UserSection;