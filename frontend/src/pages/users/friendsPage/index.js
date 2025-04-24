import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import DefaultAvatar from '../../../components/DefaultAvatar';
import { FaUser, FaUserPlus, FaUserMinus, FaUsers, FaUserCheck, FaUserTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import './style.scss';

const FriendsPage = () => {
  const { user, isAuthenticated, getFriendsList, getPendingFriendRequests, getFollowers, getFollowing, sendFriendRequest, respondToFriendRequest, removeFriend, followUser, unfollowUser, checkFollowStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // Fetch all data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Fetch all data for the page
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch friends list
      const friendsResult = await getFriendsList();
      if (friendsResult.success) {
        setFriends(friendsResult.friends);
      } else {
        console.error('Error fetching friends:', friendsResult.message);
      }
      
      // Fetch pending requests
      const requestsResult = await getPendingFriendRequests();
      if (requestsResult.success) {
        setPendingRequests(requestsResult.requests);
      } else {
        console.error('Error fetching requests:', requestsResult.message);
      }
      
      // Fetch followers
      const followersResult = await getFollowers();
      if (followersResult.success) {
        setFollowers(followersResult.followers);
      } else {
        console.error('Error fetching followers:', followersResult.message);
      }
      
      // Fetch following
      const followingResult = await getFollowing();
      if (followingResult.success) {
        setFollowing(followingResult.following);
      } else {
        console.error('Error fetching following:', followingResult.message);
      }
      
      // Fetch suggested users (this would typically come from an API endpoint)
      // For now, we'll mock some data
      setSuggestedUsers([
        { id: 1001, username: 'suggested_user1', fullName: 'Suggested User 1', avatar: null },
        { id: 1002, username: 'suggested_user2', fullName: 'Suggested User 2', avatar: null },
        { id: 1003, username: 'suggested_user3', fullName: 'Suggested User 3', avatar: null }
      ]);
      
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      console.error('Error fetching friend data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a friend request
  const handleSendRequest = async (userId) => {
    setActionLoading(prev => ({ ...prev, [`request_${userId}`]: true }));
    
    try {
      const result = await sendFriendRequest(userId);
      if (result.success) {
        setMessage('Đã gửi lời mời kết bạn thành công');
        // Refresh the data
        fetchData();
      } else {
        setError(result.message || 'Không thể gửi lời mời kết bạn');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`request_${userId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle accepting/declining a friend request
  const handleRequestResponse = async (requesterId, action) => {
    setActionLoading(prev => ({ ...prev, [`respond_${requesterId}_${action}`]: true }));
    
    try {
      const result = await respondToFriendRequest(requesterId, action);
      if (result.success) {
        setMessage(`Đã ${action === 'accept' ? 'chấp nhận' : 'từ chối'} lời mời kết bạn`);
        // Refresh data after action
        fetchData();
      } else {
        setError(result.message || 'Không thể xử lý lời mời kết bạn');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`respond_${requesterId}_${action}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle removing a friend
  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người này khỏi danh sách bạn bè?')) {
      return;
    }
    
    setActionLoading(prev => ({ ...prev, [`remove_${friendId}`]: true }));
    
    try {
      const result = await removeFriend(friendId);
      if (result.success) {
        setMessage('Đã xóa khỏi danh sách bạn bè');
        // Update the friends list
        setFriends(friends.filter(friend => friend.id !== friendId));
      } else {
        setError(result.message || 'Không thể xóa bạn bè');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`remove_${friendId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle follow/unfollow user
  const handleFollowToggle = async (userId, isFollowing) => {
    setActionLoading(prev => ({ ...prev, [`follow_${userId}`]: true }));
    
    try {
      let result;
      if (isFollowing) {
        result = await unfollowUser(userId);
        if (result.success) {
          setMessage('Đã hủy theo dõi người dùng');
          // Update following list
          setFollowing(following.filter(user => user.id !== userId));
        }
      } else {
        result = await followUser(userId);
        if (result.success) {
          setMessage('Đã theo dõi người dùng');
          // Refresh data to get updated following list
          const followingResult = await getFollowing();
          if (followingResult.success) {
            setFollowing(followingResult.following);
          }
        }
      }
      
      if (!result.success) {
        setError(result.message || 'Không thể thực hiện thao tác theo dõi');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`follow_${userId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Check if a user is being followed by current user
  const isUserFollowed = (userId) => {
    return following.some(user => user.id === userId);
  };

  // Check if a user is already a friend
  const isUserFriend = (userId) => {
    return friends.some(friend => friend.id === userId);
  };

  if (!isAuthenticated) {
    return (
      <div className="friends-page">
        <div className="container">
          <div className="auth-message">
            <h2>Vui lòng đăng nhập để xem trang bạn bè</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-page">
      <div className="container">
        <h1 className="page-title">Bạn bè & Người theo dõi</h1>
        
        {message && (
          <div className="message success-message">
            {message}
          </div>
        )}
        
        {error && (
          <div className="message error-message">
            <FaExclamationTriangle className="error-icon" /> {error}
          </div>
        )}
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            <FaUsers className="tab-icon" /> Bạn bè
          </button>
          <button 
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FaUserPlus className="tab-icon" /> Lời mời kết bạn
          </button>
          <button 
            className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            <FaUser className="tab-icon" /> Người theo dõi
          </button>
          <button 
            className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            <FaUser className="tab-icon" /> Đang theo dõi
          </button>
          <button 
            className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <FaUserPlus className="tab-icon" /> Gợi ý kết bạn
          </button>
        </div>
        
        <div className="content">
          {loading ? (
            <div className="loading-container">
              <FaSpinner className="spinner" />
              <p>Đang tải...</p>
            </div>
          ) : (
            <>
              {/* Friends Tab */}
              {activeTab === 'friends' && (
                <div className="friends-list">
                  <h2>Danh sách bạn bè ({friends.length})</h2>
                  {friends.length === 0 ? (
                    <div className="empty-state">
                      <p>Bạn chưa có người bạn nào. Hãy tìm và kết bạn với mọi người!</p>
                    </div>
                  ) : (
                    <div className="user-cards">
                      {friends.map(friend => (
                        <div key={friend.id} className="user-card">
                          <div className="user-avatar">
                            {friend.avatar ? (
                              <img src={friend.avatar} alt={friend.fullName} />
                            ) : (
                              <DefaultAvatar size={60} />
                            )}
                          </div>
                          <div className="user-info">
                            <h3>{friend.fullName}</h3>
                            <p className="username">@{friend.username}</p>
                            {friend.bio && <p className="bio">{friend.bio}</p>}
                          </div>
                          <div className="user-actions">
                            <button 
                              className="action-button remove-button"
                              onClick={() => handleRemoveFriend(friend.id)}
                              disabled={actionLoading[`remove_${friend.id}`]}
                            >
                              {actionLoading[`remove_${friend.id}`] ? (
                                <FaSpinner className="spinner" />
                              ) : (
                                <FaUserMinus className="action-icon" />
                              )}
                              Hủy kết bạn
                            </button>
                            
                            {!isUserFollowed(friend.id) ? (
                              <button 
                                className="action-button follow-button"
                                onClick={() => handleFollowToggle(friend.id, false)}
                                disabled={actionLoading[`follow_${friend.id}`]}
                              >
                                {actionLoading[`follow_${friend.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUser className="action-icon" />
                                )}
                                Theo dõi
                              </button>
                            ) : (
                              <button 
                                className="action-button unfollow-button"
                                onClick={() => handleFollowToggle(friend.id, true)}
                                disabled={actionLoading[`follow_${friend.id}`]}
                              >
                                {actionLoading[`follow_${friend.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUserTimes className="action-icon" />
                                )}
                                Bỏ theo dõi
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Friend Requests Tab */}
              {activeTab === 'requests' && (
                <div className="requests-list">
                  <h2>Lời mời kết bạn ({pendingRequests.length})</h2>
                  {pendingRequests.length === 0 ? (
                    <div className="empty-state">
                      <p>Không có lời mời kết bạn nào.</p>
                    </div>
                  ) : (
                    <div className="user-cards">
                      {pendingRequests.map(request => (
                        <div key={request.id} className="user-card">
                          <div className="user-avatar">
                            {request.requester.avatar ? (
                              <img src={request.requester.avatar} alt={request.requester.fullName} />
                            ) : (
                              <DefaultAvatar size={60} />
                            )}
                          </div>
                          <div className="user-info">
                            <h3>{request.requester.fullName}</h3>
                            <p className="username">@{request.requester.username}</p>
                            <p className="request-time">Đã gửi lời mời: {new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="user-actions">
                            <button 
                              className="action-button accept-button"
                              onClick={() => handleRequestResponse(request.requester.id, 'accept')}
                              disabled={actionLoading[`respond_${request.requester.id}_accept`]}
                            >
                              {actionLoading[`respond_${request.requester.id}_accept`] ? (
                                <FaSpinner className="spinner" />
                              ) : (
                                <FaUserCheck className="action-icon" />
                              )}
                              Chấp nhận
                            </button>
                            <button 
                              className="action-button reject-button"
                              onClick={() => handleRequestResponse(request.requester.id, 'decline')}
                              disabled={actionLoading[`respond_${request.requester.id}_decline`]}
                            >
                              {actionLoading[`respond_${request.requester.id}_decline`] ? (
                                <FaSpinner className="spinner" />
                              ) : (
                                <FaUserTimes className="action-icon" />
                              )}
                              Từ chối
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Followers Tab */}
              {activeTab === 'followers' && (
                <div className="followers-list">
                  <h2>Người theo dõi ({followers.length})</h2>
                  {followers.length === 0 ? (
                    <div className="empty-state">
                      <p>Chưa có ai theo dõi bạn.</p>
                    </div>
                  ) : (
                    <div className="user-cards">
                      {followers.map(follower => (
                        <div key={follower.id} className="user-card">
                          <div className="user-avatar">
                            {follower.avatar ? (
                              <img src={follower.avatar} alt={follower.fullName} />
                            ) : (
                              <DefaultAvatar size={60} />
                            )}
                          </div>
                          <div className="user-info">
                            <h3>{follower.fullName}</h3>
                            <p className="username">@{follower.username}</p>
                            {follower.bio && <p className="bio">{follower.bio}</p>}
                          </div>
                          <div className="user-actions">
                            {!isUserFriend(follower.id) && (
                              <button 
                                className="action-button add-button"
                                onClick={() => handleSendRequest(follower.id)}
                                disabled={actionLoading[`request_${follower.id}`]}
                              >
                                {actionLoading[`request_${follower.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUserPlus className="action-icon" />
                                )}
                                Kết bạn
                              </button>
                            )}
                            
                            {!isUserFollowed(follower.id) ? (
                              <button 
                                className="action-button follow-button"
                                onClick={() => handleFollowToggle(follower.id, false)}
                                disabled={actionLoading[`follow_${follower.id}`]}
                              >
                                {actionLoading[`follow_${follower.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUser className="action-icon" />
                                )}
                                Theo dõi lại
                              </button>
                            ) : (
                              <button 
                                className="action-button unfollow-button"
                                onClick={() => handleFollowToggle(follower.id, true)}
                                disabled={actionLoading[`follow_${follower.id}`]}
                              >
                                {actionLoading[`follow_${follower.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUserTimes className="action-icon" />
                                )}
                                Bỏ theo dõi
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Following Tab */}
              {activeTab === 'following' && (
                <div className="following-list">
                  <h2>Đang theo dõi ({following.length})</h2>
                  {following.length === 0 ? (
                    <div className="empty-state">
                      <p>Bạn chưa theo dõi ai.</p>
                    </div>
                  ) : (
                    <div className="user-cards">
                      {following.map(followedUser => (
                        <div key={followedUser.id} className="user-card">
                          <div className="user-avatar">
                            {followedUser.avatar ? (
                              <img src={followedUser.avatar} alt={followedUser.fullName} />
                            ) : (
                              <DefaultAvatar size={60} />
                            )}
                          </div>
                          <div className="user-info">
                            <h3>{followedUser.fullName}</h3>
                            <p className="username">@{followedUser.username}</p>
                            {followedUser.bio && <p className="bio">{followedUser.bio}</p>}
                          </div>
                          <div className="user-actions">
                            {!isUserFriend(followedUser.id) && (
                              <button 
                                className="action-button add-button"
                                onClick={() => handleSendRequest(followedUser.id)}
                                disabled={actionLoading[`request_${followedUser.id}`]}
                              >
                                {actionLoading[`request_${followedUser.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUserPlus className="action-icon" />
                                )}
                                Kết bạn
                              </button>
                            )}
                            
                            <button 
                              className="action-button unfollow-button"
                              onClick={() => handleFollowToggle(followedUser.id, true)}
                              disabled={actionLoading[`follow_${followedUser.id}`]}
                            >
                              {actionLoading[`follow_${followedUser.id}`] ? (
                                <FaSpinner className="spinner" />
                              ) : (
                                <FaUserTimes className="action-icon" />
                              )}
                              Bỏ theo dõi
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Suggestions Tab */}
              {activeTab === 'suggestions' && (
                <div className="suggestions-list">
                  <h2>Gợi ý kết bạn</h2>
                  {suggestedUsers.length === 0 ? (
                    <div className="empty-state">
                      <p>Không có gợi ý kết bạn nào.</p>
                    </div>
                  ) : (
                    <div className="user-cards">
                      {suggestedUsers.map(suggestedUser => (
                        <div key={suggestedUser.id} className="user-card">
                          <div className="user-avatar">
                            {suggestedUser.avatar ? (
                              <img src={suggestedUser.avatar} alt={suggestedUser.fullName} />
                            ) : (
                              <DefaultAvatar size={60} />
                            )}
                          </div>
                          <div className="user-info">
                            <h3>{suggestedUser.fullName}</h3>
                            <p className="username">@{suggestedUser.username}</p>
                            {suggestedUser.bio && <p className="bio">{suggestedUser.bio}</p>}
                          </div>
                          <div className="user-actions">
                            <button 
                              className="action-button add-button"
                              onClick={() => handleSendRequest(suggestedUser.id)}
                              disabled={actionLoading[`request_${suggestedUser.id}`]}
                            >
                              {actionLoading[`request_${suggestedUser.id}`] ? (
                                <FaSpinner className="spinner" />
                              ) : (
                                <FaUserPlus className="action-icon" />
                              )}
                              Kết bạn
                            </button>
                            
                            {!isUserFollowed(suggestedUser.id) ? (
                              <button 
                                className="action-button follow-button"
                                onClick={() => handleFollowToggle(suggestedUser.id, false)}
                                disabled={actionLoading[`follow_${suggestedUser.id}`]}
                              >
                                {actionLoading[`follow_${suggestedUser.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUser className="action-icon" />
                                )}
                                Theo dõi
                              </button>
                            ) : (
                              <button 
                                className="action-button unfollow-button"
                                onClick={() => handleFollowToggle(suggestedUser.id, true)}
                                disabled={actionLoading[`follow_${suggestedUser.id}`]}
                              >
                                {actionLoading[`follow_${suggestedUser.id}`] ? (
                                  <FaSpinner className="spinner" />
                                ) : (
                                  <FaUserTimes className="action-icon" />
                                )}
                                Bỏ theo dõi
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;