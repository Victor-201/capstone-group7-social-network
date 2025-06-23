import React from 'react';
import './style.scss';
import useTimeAgo from '../../hooks/useTimeAgo';
import AvatarUser from '../avatarUser';
import { useNavigate } from 'react-router-dom';
import  { useMarkAsRead } from '../../hooks/notifications';

const NotificationItem = ({ noti, onMarkedRead, onClose }) => {
    const timeAgo = useTimeAgo(noti.created_at);
    const navigate = useNavigate();
    const { read } = useMarkAsRead();

    const handleClick = async () => {
        if (noti.is_read) {
            navigate(noti.link || '/');
            onClose?.();
            return;
        }

        const updated = await read(noti.id);
        if (updated) {
            onMarkedRead?.(updated);
            navigate(noti.link || '/');
            onClose?.();
        }
    };

    return (
        <li
            className={`notification__item ${noti.is_read ? 'notification__item--read' : ''}`}
            onClick={handleClick}
        >
            <div className="notification__info">
                <div className="notification__avatar">
                    <AvatarUser user={noti.sender} />
                </div>
                <div className="notification__content">
                    <span className="notification__text">
                        <b>{noti.sender.full_name}</b> {noti.content}
                    </span>
                    <span className="notification__time">{timeAgo}</span>
                </div>
            </div>
        </li>
    );
};

export default NotificationItem;
