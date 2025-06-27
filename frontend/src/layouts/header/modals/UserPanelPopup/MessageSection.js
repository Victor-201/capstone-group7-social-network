import AvatarUser from '../../../../components/avatarUser';
import ChatItem from '../../../../components/chatItem';
import Loader from '../../../../components/loader';
import { useChats } from '../../../../hooks/chat';
import { useFriends } from '../../../../hooks/friends';

const MessageSection = ({ onClose, isOpenCreateChat }) => {
    const { chats, loading, error, refetch } = useChats();
    const { friends, loading: loadingFriends, error: errorFriends } = useFriends();

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
                                <li key={friend.id} className="create-chat__friend-item">
                                    <AvatarUser user={friend} />
                                    <span>{friend.full_name}</span>
                                    <button className="create-chat__friend-chat-btn">Nhắn tin</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                ) : loading ? (
                    <div className="popup__loader">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="popup__error">{error}</div>
                ) : chats.length === 0 ? (
                    <div className="popup__no-message">Không có cuộc trò chuyện nào.</div>
                ) : (
                <ul className="popup__message-list">
                    {chats.map(chat => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onClose={onClose}
                            refetchChats={refetch}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
};

export default MessageSection;
