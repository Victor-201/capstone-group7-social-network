import React from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, FaExternalLinkAlt, FaGlobe, FaEllipsisV } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import './style.scss';

const NewsFeed = ({ 
  posts,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onExternalLink,
  onMenuClick,
  formatRelativeTime
}) => {
  return (
    <div className="news-feed">
      {posts.map(post => (
        <div className="post-card" key={post.id}>
          <div className="post-header">
            <div className="post-author">
              {post.authorAvatar ? (
                <img 
                  src={post.authorAvatar} 
                  alt={post.author} 
                  className="author-avatar" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <img 
                  src="upload/images/avatar-default.jpg" 
                  alt={post.author} 
                  className="author-avatar"
                />
              )}
              <div className="author-info">
                <div className="author-name">{post.author}</div>
                <div className="post-meta">
                  <span className="post-time">{formatRelativeTime(post.createdAt)}</span>
                  <span className="dot-separator">•</span>
                  <span className="visibility-icon"><FaGlobe /></span>
                </div>
              </div>
            </div>
            <button className="post-menu" onClick={() => onMenuClick(post.id)}>
              <FaEllipsisV className="menu-icon" />
            </button>
          </div>

          <div className="post-content">
            <p>{post.content}</p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="post-tag">#{tag}</span>
                ))}
              </div>
            )}
            
            {post.image && (
              <div className="post-media">
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="post-image" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="post-actions">
            <button 
              className={`post-action ${post.isLiked ? 'liked' : ''}`}
              onClick={() => onLike(post.id)}
            >
              <span className="action-icon">
                {post.isLiked ? <FaHeart /> : <FaRegHeart />}
              </span>
              <span className="action-count">{post.likes || 0}</span>
            </button>
            <button className="post-action" onClick={() => onComment(post.id)}>
              <span className="action-icon"><FaComment /></span>
              <span className="action-count">{post.comments ? post.comments.length : 0}</span>
            </button>
            <button className="post-action" onClick={() => onShare(post.id)}>
              <span className="action-icon"><FaShare /></span>
              <span className="action-count">0</span>
            </button>
            <button className="post-action" onClick={() => onBookmark(post.id)}>
              <span className="action-icon"><FaBookmark /></span>
            </button>
            <button className="post-action" onClick={() => onExternalLink(post.id)}>
              <span className="action-icon"><FaExternalLinkAlt /></span>
            </button>
          </div>

          {post.comments && post.comments.length > 0 && (
            <div className="post-comments">
              <h4 className="comments-header">
                <span className="comments-count">{post.comments.length} Bình luận</span>
              </h4>
              <div className="comments-list">
                {post.comments.map(comment => (
                  <div className="comment-item" key={comment.id}>
                    {comment.authorAvatar ? (
                      <img 
                        src={comment.authorAvatar} 
                        alt={comment.author} 
                        className="comment-avatar" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <img 
                        src="upload/images/avatar-default.jpg" 
                        alt={comment.author} 
                        className="comment-avatar"
                      />
                    )}
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
