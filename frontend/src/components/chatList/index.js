import useTimeAgo from '../../hooks/useTimeAgo';
import { useAuth } from '../../contexts/AuthContext';
import AvatarUser from '../avatarUser';
import './style.scss';

const ChatList = ({ chat, handleSelectChat, setOtherUserId }) => {
  const { auth } = useAuth();

  return (
   <li
  className="chat__friend-item"
  onClick={() => {
    handleSelectChat(chat.chat_id);
    setOtherUserId(chat.other_user.id);
  }}
>

      <div className="chat__friend-avatar">
        <AvatarUser user={chat.other_user} />
      </div>
      <div className="chat__friend-info">
        <span><b>{chat.other_user.full_name}</b></span>
        <div className="chat__friend-message">
          <span>
            {chat.latest_message.sender_id === auth.id ? 'Bạn: ' : `${chat.other_user.full_name}: `}{chat.latest_message.content}
          </span>
          <span>·</span>
          <span>{useTimeAgo(chat.latest_message.sent_at)}</span>
        </div>
      </div>
    </li>
  );
};

export default ChatList;
