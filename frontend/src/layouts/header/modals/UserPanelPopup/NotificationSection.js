import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import NotificationItem from '../../../../components/notificationItem';

const NotificationSection = () => {
    const [filter, setFilter] = useState('all');

    const notifications = [
        {
            id: 1,
            senderId: 101,
            receiverId: 202,
            actionType: 'friend_accept',
            actionId: 555,
            isRead: false,
            createdAt: '2025-05-10T14:30:00',
        },
        {
            id: 2,
            senderId: 103,
            receiverId: 202,
            actionType: 'group_invite',
            actionId: 777,
            isRead: true,
            createdAt: '2025-05-09T18:45:00',
        },
    ];

    const senderNames = {
        101: 'Minh Hải',
        103: 'Hữu Nghĩa',
    };

    const filteredNoti = filter === 'all' ? notifications : notifications.filter(n => !n.isRead);

    return (
        <section className="popup__section popup__section--notification">
            <header className="popup__section-header">
                <h3 className="popup__section-title">Thông báo</h3>
                <button type="button" className="popup__section-more"><BsThreeDots /></button>
            </header>
            <div className="popup__notification-filter">
                <button
                    className={`filter-btn ${filter === 'all' ? "filter-btn--active" : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`filter-btn ${filter === 'unread' ? 'filter-btn--active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Chưa đọc
                </button>
            </div>
            <ul className="popup__notification-list">
                {filteredNoti.map(noti => (
                    <NotificationItem
                        key={noti.id}
                        noti={noti}
                        senderName={senderNames[noti.senderId] || 'Ai đó'}
                    />
                ))}
            </ul>
        </section>
    );
};

export default NotificationSection;
