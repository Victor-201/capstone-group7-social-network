import React from 'react';
import useTimeAgo from '../../hooks/useTimeAgo';
import { useAuth } from '../../contexts/AuthContext';
import AvatarUser from '../avatarUser';
import './style.scss';

const ChatMessageItem = ({ message }) => {
  const { auth } = useAuth();
  const isMine = message.sender_id === auth.id;
  return (
    <>
      <div className={`chat-box__message ${isMine ? 'chat-box__message--mine' : ''}`}>
        {!isMine ? <div className="chat-box__avatar"> <AvatarUser user={message.Sender} /> </div> : ''}
        <div className="chat-box__info">
          <div className="chat-box__content">{message.content}</div>
          <span className="chat-box__time">{useTimeAgo(message.sent_at)}</span>
        </div>
      </div>
    </>
  );
};

export default ChatMessageItem;
