import React from 'react';
import './style.scss';
import useTimeAgo from '../../hooks/useTimeAgo';
import AvatarUser from '../avatarUser';

const NotificationItem = ({ noti, senderName }) => {
    const timeAgo = useTimeAgo(noti.createdAt);
    const generateText = () => {
        switch (noti.actionType) {
            case 'friend_accept':
                return (
                    <>
                        <b>{senderName}</b> đã chấp nhận lời mời kết bạn của bạnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn.
                    </>
                );
            case 'group_invite':
                return (
                    <>
                        Bạn có 1 lời mời tham gia nhóm từ <b>{senderName}</b>.
                    </>
                );
            default:
                return <>Bạn có một thông báo mới.</>;
        }
    };

    return (
    <li className={`notification__item ${!noti.isRead ? 'notification__item--unread' : ''}`}>
        <div className="notification__info">
            <div className="notification__avatar">
                <AvatarUser user={senderName} />
            </div>
            <div className="notification__content">
                <span className="notification__text">{generateText()}</span>
                <span className="notification__time">{timeAgo}</span>
            </div>
        </div>
    </li>
);
};

export default NotificationItem;
