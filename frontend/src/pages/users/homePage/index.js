import React from "react";
import { FaHeart, FaComment, FaEllipsisH } from "react-icons/fa";
import "./style.scss";

// Hàm này chỉ dùng cho homepage, không phải component tái sử dụng
export function renderReelsSection(reels) {
  return (
    <section className="reels-section">
      <div className="reels-horizontal-section">
        <div className="reels-horizontal-header">
          <span className="reels-horizontal-title">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{marginRight: 8}}>
              <rect width="28" height="28" rx="8" fill="#242526"/>
              <path d="M10.5 8.5C10.5 7.67157 11.1716 7 12 7H16C16.8284 7 17.5 7.67157 17.5 8.5V19.5C17.5 20.3284 16.8284 21 16 21H12C11.1716 21 10.5 20.3284 10.5 19.5V8.5Z" fill="#fff"/>
              <path d="M13.5 10.5C13.5 10.2239 13.7239 10 14 10C14.2761 10 14.5 10.2239 14.5 10.5V17.5C14.5 17.7761 14.2761 18 14 18C13.7239 18 13.5 17.7761 13.5 17.5V10.5Z" fill="#1877F2"/>
            </svg>
            Reels
          </span>
          <FaEllipsisH className="reels-horizontal-more" />
        </div>
        <div className="reels-horizontal-list">
          {reels.map((reel, idx) => (
            <div className="reel-card" key={reel.id || idx}>
              <div className="reel-card-video-wrapper">
                <video
                  src={reel.videoUrl}
                  className="reel-card-video"
                  loop
                  muted
                  autoPlay
                  playsInline
                />
                <div className="reel-card-overlay">
                  <div className="reel-card-caption">{reel.caption}</div>
                </div>
              </div>
              <div className="reel-card-footer">
                <div className="reel-card-user">
                  <img src={reel.userAvatar} alt={reel.username} className="reel-card-avatar" />
                  <span className="reel-card-username">{reel.username}</span>
                </div>
                <div className="reel-card-actions">
                  <span><FaHeart /> {reel.likes}</span>
                  <span><FaComment /> {reel.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
