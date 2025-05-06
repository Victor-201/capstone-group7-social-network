import React, { useState, useRef } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaMusic, FaEllipsisV } from 'react-icons/fa';
import './style.scss';

const ReelsSection = ({ 
  reels,
  onLike,
  onComment,
  onShare,
  onMenuClick,
  formatRelativeTime
}) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollTop;
    const reelHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / reelHeight);
    
    if (newIndex !== currentReelIndex) {
      setCurrentReelIndex(newIndex);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  return (
    <div className="reels-section" onScroll={handleScroll}>
      {reels.map((reel, index) => (
        <div 
          className={`reel-container ${index === currentReelIndex ? 'active' : ''}`} 
          key={reel.id}
        >
          <video
            ref={videoRef}
            src={reel.videoUrl}
            loop
            playsInline
            onClick={handleVideoClick}
            className="reel-video"
          />
          
          <div className="reel-info">
            <div className="reel-author">
              {reel.authorAvatar ? (
                <img 
                  src={reel.authorAvatar} 
                  alt={reel.author} 
                  className="author-avatar" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <img 
                  src="upload/images/avatar-default.jpg" 
                  alt={reel.author} 
                  className="author-avatar"
                />
              )}
              <div className="author-info">
                <div className="author-name">{reel.author}</div>
                <div className="reel-meta">
                  <span className="reel-time">{formatRelativeTime(reel.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="reel-content">
              <p className="reel-caption">{reel.caption}</p>
              {reel.music && (
                <div className="reel-music">
                  <FaMusic />
                  <span>{reel.music}</span>
                </div>
              )}
            </div>

            <div className="reel-actions">
              <button 
                className={`reel-action ${reel.isLiked ? 'liked' : ''}`}
                onClick={() => onLike(reel.id)}
              >
                <span className="action-icon">
                  {reel.isLiked ? <FaHeart /> : <FaRegHeart />}
                </span>
                <span className="action-count">{reel.likes || 0}</span>
              </button>
              <button className="reel-action" onClick={() => onComment(reel.id)}>
                <span className="action-icon"><FaComment /></span>
                <span className="action-count">{reel.comments ? reel.comments.length : 0}</span>
              </button>
              <button className="reel-action" onClick={() => onShare(reel.id)}>
                <span className="action-icon"><FaShare /></span>
                <span className="action-count">0</span>
              </button>
              <button className="reel-action" onClick={() => onMenuClick(reel.id)}>
                <span className="action-icon"><FaEllipsisV /></span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelsSection;
