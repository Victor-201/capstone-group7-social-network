import React, { useRef, useEffect, useState } from 'react';

const ChatWindow = ({ messages, onSendMessage, loading }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window__messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-window__message ${
              message.isSender
                ? 'chat-window__message--sent'
                : 'chat-window__message--received'
            }`}
          >
            <div className="chat-window__message-content">{message.content}</div>
            <div className="chat-window__message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-window__input-row">
        <input
          className="chat-window__input"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button
          className="chat-window__send-btn"
          onClick={handleSend}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
