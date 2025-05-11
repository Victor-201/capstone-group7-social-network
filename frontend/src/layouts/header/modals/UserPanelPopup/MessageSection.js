import React from 'react';
import { BsThreeDots } from 'react-icons/bs';

const MessageSection = () => {
    return (
        <section className="popup__section popup__section--message">
            <header className="popup__section-header">
                <h3 className="popup__section-title">Tin nhắn</h3>
                <button type="button" className="popup__section-more"><BsThreeDots /></button>
            </header>

            <ul className="popup__message-list">
                <li className="popup__message-item">
                    <span className="popup__message-text">Bạn có 1 tin nhắn mới</span>
                </li>
            </ul>
        </section>
    );
};

export default MessageSection;
