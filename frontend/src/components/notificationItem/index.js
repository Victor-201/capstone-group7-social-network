import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import useTimeAgo from '../../hooks/useTimeAgo';
import AvatarUser from '../avatarUser';
import { useNavigate } from 'react-router-dom';
import { useMarkAsRead, useMarkAsUnRead, useDeleteNotification } from '../../hooks/notifications';
import { BsThreeDots } from 'react-icons/bs';

const NotificationItem = ({ noti, onClose, reloadNotifications }) => {
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef(null);
    const timeAgo = useTimeAgo(noti.created_at);
    const navigate = useNavigate();
    const { readNoti } = useMarkAsRead();
    const { unreadNoti } = useMarkAsUnRead();
    const { deleteNoti } = useDeleteNotification();

    const handleActionNoti = async (action) => {
        const updated = await action(noti.id);
        if (updated) {
            reloadNotifications?.();
            setShowActions(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionsRef.current && !actionsRef.current.contains(e.target)) {
                setShowActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <li
            className={`notification__item ${noti.is_read ? 'notification__item--read' : ''}`}
            onDoubleClick={() => handleActionNoti(readNoti)}
        >
            <div className="notification__more" onClick={(e) => { e.stopPropagation(); setShowActions((prev) => !prev); }} ref={actionsRef}>
                <BsThreeDots />
                {showActions && (
                    <div className="notification__more--actions">
                        {noti.is_read ? (
                            <button className="notification__action" onClick={() => handleActionNoti(unreadNoti)}>
                                Đánh dấu chưa đọc
                            </button>
                        ) : (
                            <button className="notification__action" onClick={() => handleActionNoti(readNoti)}>
                                Đánh dấu đã đọc
                            </button>
                        )}
                        <button className="notification__action" onClick={() => handleActionNoti(deleteNoti)}>
                            Xoá thông báo
                        </button>
                    </div>
                )}
            </div>

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
