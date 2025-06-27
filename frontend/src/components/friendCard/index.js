import React, { useState, useEffect, useRef } from 'react';
import { FaSpinner, FaEllipsisH, FaUserMinus, FaUserPlus, FaEyeSlash, FaFlag, FaBan } from 'react-icons/fa';
import AvatarUser from '../avatarUser';
import MutualFriendsDisplay from '../mutualFriendsDisplay';
import "./style.scss";

// Themed icon component for FriendCard
const FriendCardIcon = ({ icon: Icon, className }) => {
  const themeClass = `friend-card-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

// Helper function to get display name
const getDisplayName = (user) => {
  return user.fullName || user.full_name || user.user_name || user.userName || user.name || 'Người dùng';
};

// Helper function to get username
const getUserName = (user) => {
  const displayName = getDisplayName(user);
  const username = user.user_name || user.userName;
  
  // Only show username if it's different from display name
  if (username && username !== displayName && !displayName.toLowerCase().includes(username.toLowerCase())) {
    return username;
  }
  return null;
};

const FriendCard = ({ 
  user, 
  type = 'friend', // friend, request, suggestion, not-friend, follower, following
  onAccept,
  onReject,
  onRemove,
  onAdd,
  onFollow,
  onUnfollow,
  onBlock,
  onReport,
  isFollowing = false,
  loading = {},
  mutualFriendsCount = 0,
  mutualFriendsData = [],
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Safety check for user object
  if (!user) {
    console.warn('FriendCard: user prop is null or undefined');
    return null;
  }

  const renderActions = () => {
    switch (type) {
      case 'request':
        return (
          <div className="action-buttons">
            <button 
              className="action-button accept-button"
              onClick={onAccept}
              disabled={loading.accept}
            >
              {loading.accept ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : null}
              Xác nhận
            </button>
            <button 
              className="action-button reject-button"
              onClick={onReject}
              disabled={loading.reject}
            >
              {loading.reject ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : null}
              Xóa
            </button>
          </div>
        );

      case 'suggestion':
      case 'not-friend':
        return (
          <div className="action-buttons suggestion-actions">
            <button 
              className="action-button add-button"
              onClick={onAdd}
              disabled={loading.add}
            >
              {loading.add ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : <FriendCardIcon icon={FaUserPlus} />}
              Thêm bạn bè
            </button>
            <div className="more-options" ref={dropdownRef}>
              <button 
                className="action-button more-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FriendCardIcon icon={FaEllipsisH} />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onUnfollow?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaEyeSlash} />
                    Huỷ theo dõi
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onBlock?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaBan} />
                    Chặn
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onReport?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaFlag} />
                    Báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'follower':
        return (
          <div className="action-buttons">
            <button 
              className="action-button add-button"
              onClick={onAdd}
              disabled={loading.add}
            >
              {loading.add ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : <FriendCardIcon icon={FaUserPlus} />}
              Thêm bạn bè
            </button>
            <div className="more-options" ref={dropdownRef}>
              <button 
                className="action-button more-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FriendCardIcon icon={FaEllipsisH} />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  {isFollowing ? (
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        onUnfollow?.();
                        setShowDropdown(false);
                      }}
                    >
                      <FriendCardIcon icon={FaEyeSlash} />
                      Huỷ theo dõi
                    </button>
                  ) : (
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        onFollow?.();
                        setShowDropdown(false);
                      }}
                    >
                      <FriendCardIcon icon={FaUserPlus} />
                      Theo dõi lại
                    </button>
                  )}
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onBlock?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaBan} />
                    Chặn
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onReport?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaFlag} />
                    Báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'following':
        return (
          <div className="action-buttons">
            <button 
              className="action-button unfollow-button"
              onClick={onUnfollow}
              disabled={loading.unfollow}
            >
              {loading.unfollow ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : <FriendCardIcon icon={FaEyeSlash} />}
              Huỷ theo dõi
            </button>
            <div className="more-options" ref={dropdownRef}>
              <button 
                className="action-button more-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FriendCardIcon icon={FaEllipsisH} />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onAdd?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaUserPlus} />
                    Thêm bạn bè
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onBlock?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaBan} />
                    Chặn
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onReport?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaFlag} />
                    Báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'friend':
      default:
        return (
          <div className="action-buttons">
            <button 
              className="action-button remove-button"
              onClick={onRemove}
              disabled={loading.remove}
            >
              {loading.remove ? <FriendCardIcon icon={FaSpinner} className="spinner" /> : <FriendCardIcon icon={FaUserMinus} />}
              Huỷ kết bạn
            </button>
            <div className="more-options">
              <button 
                className="action-button more-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FriendCardIcon icon={FaEllipsisH} />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onUnfollow?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaEyeSlash} />
                    Huỷ theo dõi
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onBlock?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaBan} />
                    Chặn
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      onReport?.();
                      setShowDropdown(false);
                    }}
                  >
                    <FriendCardIcon icon={FaFlag} />
                    Báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="friend-card facebook-style">
      <div className="friend-avatar">
        <AvatarUser user={user} size="large" />
      </div>
      
      <div className="friend-info">
        <div className="friend-name">
          <h3>{getDisplayName(user)}</h3>
          {getUserName(user) && (
            <span className="username">@{getUserName(user)}</span>
          )}
        </div>
        
        
        <div className="mutual-info">
          <MutualFriendsDisplay
            mutualFriends={mutualFriendsData}
            count={mutualFriendsCount}
          />
          {type === 'request' && user.createdAt && (
            <span className="request-time">
              {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>

      <div className="friend-actions">
        {renderActions()}
      </div>
    </div>
  );
};

export default FriendCard;