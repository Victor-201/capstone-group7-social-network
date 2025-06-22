import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import NotificationItem from '../../../../components/notificationItem';
import {useNotifications} from '../../../../hooks/notifications';
import Loader from '../../../../components/loader';

const NotificationSection = () => {
    const [filter, setFilter] = useState('all');
    const { notifications, loading, error } = useNotifications();

    console.log('Notifications:', notifications);

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
            {loading ? (
                <div className="popup__loader">
                    <Loader />
                </div>
            ) : notifications.length === 0 ? (
                <div className="popup__no-notification">Không có thông báo nào.</div>
            ) : (
                <ul className="popup__notification-list">
                    {notifications.map(noti => (
                        <NotificationItem
                            key={noti.id}
                            noti={noti}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default NotificationSection;