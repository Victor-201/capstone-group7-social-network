import { useState, useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { IoCreate } from "react-icons/io5";
import UserSection from './UserSection';
import NotificationSection from './NotificationSection';
import MessageSection from './MessageSection';
import useClickOutside from '../../../../hooks/useClickOutside';
import { useMarkAllAsRead, useDeleteAllReadNotifications } from '../../../../hooks/notifications';
import './style.scss';

const UserPanelPopup = ({ type, user, onClose, reloadFns, notiData }) => {
    const [isOpenMoreAction, setIsOpenMoreAction] = useState(false);
    const isOpenMoreActionRef = useRef(null);
    const [isOpenCreateChat, setIsOpenCreateChat] = useState(false);
    const { read, loading: marking, error: markError } = useMarkAllAsRead();
    const { deleteRead, loading: deleting, error: deleteError } = useDeleteAllReadNotifications();

    useClickOutside(isOpenMoreActionRef, () => {
        setIsOpenMoreAction(false);
    });

    const handleMarkAllAsRead = async () => {
        await read();
        reloadFns?.notifications?.();
    };


    const handleDeleteReadNotifications = async () => {
        await deleteRead();
        reloadFns?.notifications?.();
    };

    const handleCreateChat = async () => {
        setIsOpenCreateChat(true);
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
                        <div className="popup__section-actions">
                            {type === 'mess' && (
                                <button className="message-create" onClick={handleCreateChat}>
                                    <IoCreate />
                                </button>
                            )}
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
                        </div>
                    </header>
                    {type === 'noti' && (
                        <NotificationSection
                            notifications={notiData.notifications}
                            loading={notiData.loadingNotifications}
                            error={notiData.errorNotifications}
                            onClose={onClose}
                            reloadNotifications={reloadFns.notifications}
                        />
                    )}
                    {type === 'mess' && (
                        <MessageSection
                            onClose={onClose}
                            isOpenCreateChat={isOpenCreateChat}
                        />
                    )}

                </>
            )}
        </div>
    );
};

export default UserPanelPopup;
