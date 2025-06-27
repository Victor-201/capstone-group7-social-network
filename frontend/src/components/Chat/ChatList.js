import React from 'react';

const ChatList = ({ conversations, onSelectChat, selectedChatId }) => {
  return (
    <ul className="chat-list">
      {conversations.map((conversation) => (
        <li
          key={conversation.id}
          onClick={() => onSelectChat(conversation.id)}
          className={`chat-list__item${selectedChatId === conversation.id ? ' chat-list__item--selected' : ''}`}
        >
          <img
            className="chat-list__avatar"
            src={conversation.participant.avatar}
            alt={conversation.participant.name}
          />
          <div className="chat-list__content">
            <div className="chat-list__name">{conversation.participant.name}</div>
            <div className="chat-list__desc">
              {conversation.lastMessage?.content || 'No messages yet'}
            </div>
          </div>
          {conversation.unreadCount > 0 && (
            <span className="chat-list__badge">{conversation.unreadCount}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
