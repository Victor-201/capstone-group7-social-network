import React, { useState, useEffect, useRef } from 'react';
import { useChatSocket, useChatActions } from '../../hooks/chat';
import { useUserInfo } from '../../hooks/user/useUserInfo';
import ChatMessageItem from '../../components/chatMessageItem';
import AvatarUser from '../avatarUser';

import './style.scss';
import { IoClose } from 'react-icons/io5'; // dùng react-icons cho icon x

const ChatBox = ({ chatId = null, friend_id, onClose }) => {
  const { userInfo: friend, loading: loadingFriends } = useUserInfo(friend_id);
  const { createNewChat, loading: loadingCreate } = useChatActions();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [tempChatId, setTempChatId] = useState(chatId);
  const [pendingMessage, setPendingMessage] = useState(null);
  const { messages, unreadCount,  sendMessage, markAsRead, reloadChat} = useChatSocket(tempChatId);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      setTempChatId(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (tempChatId) {
      markAsRead();
    }
  }, [tempChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (tempChatId && pendingMessage) {
      sendMessage(pendingMessage, tempChatId);
      setPendingMessage(null);
      setInput('');
      setSending(false);
    }
  }, [tempChatId, pendingMessage]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);

    if (tempChatId) {
      try {
        await sendMessage(trimmed, tempChatId);
        setInput('');
      } catch (err) {
        console.error('Lỗi gửi tin nhắn:', err);
      } finally {
        setSending(false);
      }
    } else {
      try {
        const chat = await createNewChat(friend_id);
        setTempChatId(chat.chat_id);
        setPendingMessage(trimmed);
      } catch (err) {
        console.error('Lỗi tạo chat:', err);
        setSending(false);
      }
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-box__header">
        {loadingFriends ? 'Loading...' :
          <div className="chat-box__friend-info">
            <div className="chat-box__avatar">
              <AvatarUser user={friend} />
            </div>
            <div className="chat-box__name">{friend.full_name}</div>
          </div>
        }

        <button className="chat-box__close" onClick={onClose} title="Đóng">
          <IoClose size={22} />
        </button>
      </div>

      <div className="chat-box__messages">
        {messages.length === 0 ? (
          <div className="chat-box__empty">Không có tin nhắn</div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessageItem key={msg.id || idx} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-box__input" onSubmit={handleSend}>
        <input
          className="chat-box__text"
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loadingCreate || sending}
        />
        {input.trim() && (
          <button className="chat-box__send" type="submit" disabled={sending || loadingCreate}>
            Gửi
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatBox;
