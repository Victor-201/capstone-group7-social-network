import { useState, useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import UserSection from './UserSection';
import NotificationSection from './NotificationSection';
import MessageSection from './MessageSection';
import useClickOutside from '../../../../hooks/useClickOutside';
import { useMarkAllAsRead, useDeleteReadNotifications  } from '../../../../hooks/notifications';
import './style.scss';

const UserPanelPopup = ({ type, user, onClose }) => {
    const [isOpenMoreAction, setIsOpenMoreAction] = useState(false);
    const isOpenMoreActionRef = useRef(null);
    const [filter, setFilter] = useState('all');
    const [notiRefreshKey, setNotiRefreshKey] = useState(0);
    const { read, loading: marking, error: markError } = useMarkAllAsRead();
    const { deleteRead, loading: deleting, error: deleteError } = useDeleteReadNotifications();

    useClickOutside(isOpenMoreActionRef, () => {
        setIsOpenMoreAction(false);
    });

    const handleMarkAllAsRead = async () => {
        await read();
        setNotiRefreshKey(prev => prev + 1); 
    };


const handleDeleteReadNotifications = async () => {
    await deleteRead();
    setNotiRefreshKey(prev => prev + 1);
};

    return (
        <div className="popup__user-panel">
            {type === 'user' ? (
                <UserSection user={user} onClose={onClose} />
            ) : (
                <>
                    <header className="popup__section-header">
                        {type === 'noti' && <h3 className="popup__section-title">Thông báo</h3>}
                        {type === 'mess' && <h3 className="popup__section-title">Tin nhắn</h3>}
                        <button
                            type="button"
                            className="popup__section-more"
                            onClick={() => setIsOpenMoreAction(prev => !prev)}
                            ref={isOpenMoreActionRef}
                        >
                            <BsThreeDots />
                            {isOpenMoreAction && (
                                <div className="popup__section-more--actions">
                                    {type === 'noti' && (
                                        <>
                                            <button className="notification-action" onClick={handleMarkAllAsRead}>
                                                Đánh dấu đã đọc tất cả
                                            </button>
                                            <button className="notification-action" onClick={handleDeleteReadNotifications}>
                                                Xoá tất cả thông báo đã đọc
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </button>
                    </header>
                    {type === 'noti' && (
    <NotificationSection
        filter={filter}
        key={notiRefreshKey}
        onClose={onClose}
        onRefresh={() => setNotiRefreshKey(prev => prev + 1)}
    />
)}
                    {type === 'mess' && <MessageSection />}
                </>
            )}
        </div>
    );
};

export default UserPanelPopup;
