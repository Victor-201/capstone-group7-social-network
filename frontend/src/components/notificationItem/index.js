import React from 'react';
import './style.scss';
import useTimeAgo from '../../hooks/useTimeAgo';
import AvatarUser from '../avatarUser';

const NotificationItem = ({ noti }) => {
    const timeAgo = useTimeAgo(noti.createdAt);
    console.log('NotificationItem:', noti);

    return (
    <li className={`notification__item ${!noti.isRead ? 'notification__item--unread' : ''}`}>
        <div className="notification__info">
            <div className="notification__avatar">
                <AvatarUser user={noti.receiver} />
            </div>
            <div className="notification__content">
                <span className="notification__text">{noti.content}</span>
                <span className="notification__time">{timeAgo}</span>
            </div>
        </div>
    </li>
);
};

export default NotificationItem;
