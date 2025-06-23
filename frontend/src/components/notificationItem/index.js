import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import useTimeAgo from '../../hooks/useTimeAgo';
import AvatarUser from '../avatarUser';
import { useNavigate } from 'react-router-dom';
import { useMarkAsRead } from '../../hooks/notifications';
import { useMarkAsUnRead } from '../../hooks/notifications';
import { BsThreeDots } from 'react-icons/bs';

const NotificationItem = ({ noti, onMarkedRead, onClose, onRefresh }) => {
    const [showActions, setShowActions] = useState(false);
    const timeAgo = useTimeAgo(noti.created_at);
    const navigate = useNavigate();
    const { read } = useMarkAsRead();
    const { unread } = useMarkAsUnRead();
    const actionsRef = useRef(null);

    const handleClick = async () => {
        if (noti.is_read) {
            navigate(noti.link || '/');
            onClose?.();
            return;
        }
        
        const updated = await read(noti.id);
        if (updated) {
            onMarkedRead?.(updated);
            onRefresh?.(); // Thêm dòng này để load lại danh sách
            navigate(noti.link || '/');
            onClose?.();
        }
    };

    const toggleActions = (e) => {
        e.stopPropagation(); // Ngăn click lan ra ngoài
        setShowActions((prev) => !prev);
    };

    const handleClickOutside = (e) => {
        if (actionsRef.current && !actionsRef.current.contains(e.target)) {
            setShowActions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <li
            className={`notification__item ${noti.is_read ? 'notification__item--read' : ''}`}
            onDoubleClick={handleClick}
        >
            <div className="notification__more" onClick={toggleActions} ref={actionsRef}>
                <BsThreeDots />
                {showActions && (
                    <div className="notification__more--actions">
                        {noti.is_read ? (
                            <button
                                className="notification__action"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const updated = await unread(noti.id);
                                    if (updated) {
                                        onMarkedRead?.(updated);
                                        onRefresh?.(); // Thêm dòng này
                                    }
                                    setShowActions(false);
                                }}
                            >
                                Đánh dấu chưa đọc
                            </button>
                        ) : (
                            <button
                                className="notification__action"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const updated = await read(noti.id);
                                    if (updated) {
                                        onMarkedRead?.(updated);
                                        onRefresh?.(); // Thêm dòng này
                                    }
                                    setShowActions(false);
                                }}
                            >
                                Đánh dấu đã đọc
                            </button>
                        )}
                        <button
                            className="notification__action"
                            onClick={async (e) => {
                                e.stopPropagation();
                                // TODO: Thêm logic xoá ở đây, ví dụ:
                                // await deleteNotification(noti.id);
                                onRefresh?.(); // Thêm dòng này
                                setShowActions(false);
                            }}
                        >
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
