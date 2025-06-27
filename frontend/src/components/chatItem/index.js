import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import useTimeAgo from '../../hooks/useTimeAgo';
import AvatarUser from '../avatarUser';
import { useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { markMessagesAsRead, deleteMessage } from '../../api/messageApi';

const ChatItem = ({ chat, onClose, refetchChats }) => {
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef(null);
    const navigate = useNavigate();

    const timeAgo = useTimeAgo(chat?.lastMessage?.createdAt);

    const handleActionChat = async (action) => {
        const token = localStorage.getItem("token");
        try {
            if (action === 'markRead') {
                await markMessagesAsRead(token, chat.id);
                refetchChats?.();
            } else if (action === 'markUnread') {
                // Tuỳ backend, bạn cần API cho markUnread hoặc bỏ
                alert("Chức năng đánh dấu chưa đọc chưa được hỗ trợ.");
            } else if (action === 'delete') {
                // hoặc deleteChat nếu xoá nguyên cuộc trò chuyện
                await deleteMessage(token, chat.lastMessage.id);
                refetchChats?.();
            }
            setShowActions(false);
        } catch (err) {
            console.error("Action failed:", err);
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
            className={`chat__item ${chat?.is_read ? 'chat__item--read' : ''}`}
            onDoubleClick={() => navigate(`/chat/${chat.id}`)}
        >
            <div className="chat__more" onClick={(e) => {
                e.stopPropagation();
                setShowActions((prev) => !prev);
            }} ref={actionsRef}>
                <BsThreeDots />
                {showActions && (
                    <div className="chat__more--actions">
                        {chat?.is_read ? (
                            <button className="chat__action" onClick={() => handleActionChat('markUnread')}>
                                Đánh dấu chưa đọc
                            </button>
                        ) : (
                            <button className="chat__action" onClick={() => handleActionChat('markRead')}>
                                Đánh dấu đã đọc
                            </button>
                        )}
                        <button className="chat__action" onClick={() => handleActionChat('delete')}>
                            Xoá tin nhắn cuối
                        </button>
                    </div>
                )}
            </div>

            <div className="chat__info" onClick={() => navigate(`/chat/${chat.id}`)}>
                <div className="chat__avatar">
                    <AvatarUser user={chat?.partner || { name: chat.name, avatar: chat.avatar }} />
                </div>
                <div className="chat__content">
                    <span className="chat__text">
                        {chat.lastMessage?.content || 'Chưa có tin nhắn'}
                    </span>
                    <span className="chat__time">{timeAgo || '...'}</span>
                </div>
            </div>
        </li>
    );
};

export default ChatItem;
