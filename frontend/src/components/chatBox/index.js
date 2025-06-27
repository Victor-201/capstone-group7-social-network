import React, { useState, useEffect, useRef } from 'react';
import { useChatSocket } from '../../hooks/chat';
import './style.scss';
const ChatBox = ({ chatId, onClose }) => {
  const { messages, sendMessage, markAsRead, reloadChat } = useChatSocket(chatId);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    markAsRead();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      setSending(true);
      await sendMessage(input);
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Chat</h3>
        <button onClick={onClose}>Đóng</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty">Không có tin nhắn</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`message ${msg.isMine ? 'mine' : ''}`}
            >
              <div className="content">{msg.content}</div>
              <div className="time">{new Date(msg.created_at).toLocaleTimeString()}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={sending}>Gửi</button>
      </form>
    </div>
  );
};

export default ChatBox;
