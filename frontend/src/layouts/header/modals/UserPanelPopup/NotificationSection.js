import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

const NotificationSection = () => {
    const [filter, setFilter] = useState('all');

    const notifications = [
        { id: 1, text: 'Minh Hải đã chấp nhận lời mời kết bạn của bạn.', isRead: false },
        { id: 2, text: 'Bạn có 1 lời mời tham gia nhóm.', isRead: true },
    ];

    const filteredNoti = filter === 'all' ? notifications : notifications.filter(n => !n.isRead);

    return (
        <section className="popup__section popup__section--notification">
            <header className="popup__section-header">
                <h3 className="popup__section-title">Thông báo</h3>
                <div className="popup__filter">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tất cả</button>
                    <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Chưa đọc</button>
                </div>
                <button type="button" className="popup__section-more"><BsThreeDots /></button>
            </header>

            <ul className="popup__notification-list">
                {filteredNoti.map(noti => (
                    <li key={noti.id} className={`popup__notification-item ${!noti.isRead ? 'unread' : ''}`}>
                        <span className="popup__notification-text">{noti.text}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default NotificationSection;
