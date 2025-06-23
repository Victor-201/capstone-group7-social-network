import React, { useState } from 'react';
import NotificationItem from '../../../../components/notificationItem';
import { useNotifications } from '../../../../hooks/notifications';
import Loader from '../../../../components/loader';

const NotificationSection = ({ filter, onClose }) => {
    const { notifications, loading, error } = useNotifications(filter);

    return (
        <section className="popup__section popup__section--notification">
            {/* filter buttons... */}
            {loading ? (
                <div className="popup__loader">
                    <Loader />
                </div>
            ) : error ? (
                <div className="popup__error">{error}</div>
            ) : notifications.length === 0 ? (
                <div className="popup__no-notification">Không có thông báo nào.</div>
            ) : (
                <ul className="popup__notification-list">
                    {notifications.map(noti => (
                        <NotificationItem key={noti.id} noti={noti} onClose={onClose} />
                    ))}
                </ul>
            )}
        </section>
    );
};


export default NotificationSection;
