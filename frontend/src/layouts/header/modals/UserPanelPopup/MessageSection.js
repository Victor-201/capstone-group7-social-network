import { useState } from 'react';
import AvatarUser from '../../../../components/avatarUser';
import Loader from '../../../../components/loader';
import { useChats, useChatActions } from '../../../../hooks/chat';
import { useFriends } from '../../../../hooks/friends';
import ChatBox from '../../../../components/chatBox';
import ChatList from '../../../../components/chatList';

const MessageSection = ({ onClose, isOpenCreateChat, setIsOpenCreateChat }) => {
    const [chatId, setChatId] = useState(null);
    const { chats, loading: loadingChats, error: errorChats, refetch } = useChats();
    const { createNewChat, loading: loadingCreate, error: errorCreate } = useChatActions();
    const { friends, loading: loadingFriends, error: errorFriends } = useFriends();

 const handleCreateChat = async (friend_id) => {
    try {
        const newChat = await createNewChat(friend_id);
        setChatId(newChat.chat_id);
        setIsOpenCreateChat(false);
    } catch (err) {
        console.error("Tạo chat thất bại:", err.message);
    }
};

    const handleSelectChat = (chatId) => {
        setChatId(chatId);
    };

    const handleCloseChat = () => {
        setChatId(null);
    };

    return (
        <section className="popup__section popup__section--message">
            {isOpenCreateChat ? (
                <div className="popup__create-chat">
                    <input
                        type="text"
                        placeholder="Nhập tên người nhận..."
                        className="create-chat__input"
                    />
                    {loadingFriends ? (
                        <div className="create-chat__loader"><Loader /></div>
                    ) : errorFriends ? (
                        <div className="create-chat__error">{errorFriends}</div>
                    ) : friends.length === 0 ? (
                        <div className="create-chat__no-friends">Không có bạn bè nào.</div>
                    ) : (
                        <ul className="create-chat__friends-list">
                            {friends.map(friend => (
                                <li key={friend.id} className="chat__friend-item" onClick={() => handleCreateChat(friend.id)}>
                                    <div className="chat__friend-avatar">
                                        <AvatarUser user={friend} />
                                    </div>
                                    <span><b>{friend.full_name}</b></span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : chatId ? (
                <ChatBox chatId={chatId} onClose={handleCloseChat} />
            ) : loadingChats ? (
                <div className="popup__loader">
                    <Loader />
                </div>
            ) : errorChats ? (
                <div className="popup__error">{errorChats}</div>
            ) : chats.length === 0 ? (
                <div className="popup__no-message">Không có cuộc trò chuyện nào.</div>
            ) : (
                <ul className="popup__message-list">
                    {chats.map(chat => (
                        <ChatList key={chat.chat_id} chat={chat} handleSelectChat={handleSelectChat} />
                    ))}
                </ul>
            )}
        </section>
    );
};
export default MessageSection;
