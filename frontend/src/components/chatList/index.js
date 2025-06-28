import useTimeAgo from '../../hooks/useTimeAgo';
import { useAuth } from '../../contexts/AuthContext';
import AvatarUser from '../avatarUser';
import './style.scss';

const ChatList = ({ chat, handleSelectChat }) => {
  const { auth } = useAuth();
  const timeAgo = useTimeAgo(chat.latest_message.sent_at);
  const isSender = chat.latest_message.sender_id === auth.id;

  return (
    <li className="chat__friend-item" onClick={() => handleSelectChat(chat.chat_id)}>
      <div className="chat__friend-avatar">
        <AvatarUser user={chat.other_user} />
      </div>
      <div className="chat__friend-info">
        <span><b>{chat.other_user.full_name}</b></span>
        <span>
          {isSender ? 'Bạn: ' : `${chat.other_user.full_name}: `}
          {chat.latest_message.content} · {timeAgo}
        </span>
      </div>
    </li>
  );
};

export default ChatList;
