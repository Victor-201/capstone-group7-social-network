import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FaUsers, FaUserPlus, FaUser, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import FriendCard from '../../../components/friendCard';
import './style.scss';

const FriendsPage = () => {
  const { user, isAuthenticated, getFriendsList, getPendingFriendRequests, getFollowers, getFollowing, sendFriendRequest, respondToFriendRequest, removeFriend, followUser, unfollowUser, checkFollowStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([
    {
      id: 'friend-1',
      fullName: 'Nguyễn Xuân Hải',
      username: 'xuanhai0913',
      avatar: 'https://lh3.googleusercontent.com/pw/AP1GczPYLM35-ZSx0_Nu8IY_rIUa7plL7-5CIWK4cbMoaqRzdtVMeJ5tWVs3yJa8YZj9bncEtQBf9QNsHWCN9jgG6LN1edeEr2U9TRdX9HFKXjxJbkMbrjC0kXuh200DyFSOdlJf1TcndEP467Pm99bY34k6=w1262-h1682-s-no-gm?authuser=0',
      bio: 'Software Developer | Coffee Lover ☕'
    },
    {
      id: 'friend-2',
      fullName: 'Nguyễn Ngọc Trung',
      username: 'hoangthie',
      avatar: 'https://lh3.googleusercontent.com/pw/AP1GczNiBVMccIzFJxP23SjuvBqgQg5z-5rjkeSz4PqICKJzVFjNJRdIcPgQI9XUyqmgMoQs9na274IHABeis59DGl6OygXkJGFynzT3bO8opuBPnzZTWz0fj0hb7GxxU_7GQrtwJvNoOpU2AJK8wymNfIAO=w1122-h1682-s-no-gm?authuser=0',
      bio: 'Digital Artist 🎨 | Cat Person 🐱'
    },
    {
      id: 'friend-3',
      fullName: 'Nguyễn Văn Thắng',
      username: 'tranminhf',
      avatar: 'https://lh3.googleusercontent.com/pw/AP1GczP8ZcGcyaU4nIrL6gaPWLU0UC-bykGJELJ2M8Kho1b1-jaHqh1Pxxm12zACPlfJrrNJAdPwZM03j-xDpDsWEiYcYdT0xMTlUwL1ufVjUlmX82H9N0BN44uYpV7JmF_LjG8daHoJKnbglPEteIBZ07MK=w1122-h1682-s-no-gm?authuser=0',
      bio: 'Travel Enthusiast ✈️ | Photographer 📸'
    }
  ]);
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'request-1',
      requester: {
        id: 'requester-1',
        fullName: 'Đỗ Văn G',
        username: 'dovang',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=b6e3f4',
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'request-2',
      requester: {
        id: 'requester-2',
        fullName: 'Vũ Thị H',
        username: 'vuthih',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf',
      },
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
  const [followers, setFollowers] = useState([
    {
      id: 'follower-1',
      fullName: 'Ngô Văn I',
      username: 'ngovani',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=c0aede',
      bio: 'Music Producer 🎵 | Guitar Player 🎸'
    },
    {
      id: 'follower-2',
      fullName: 'Lê Thị K',
      username: 'lethik',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffdfbf',
      bio: 'Food Blogger 🍜 | Chef 👩‍🍳'
    }
  ]);
  const [following, setFollowing] = useState([
    {
      id: 'following-1',
      fullName: 'Trịnh Thị L',
      username: 'trinhthi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=b6e3f4',
      bio: 'Fashion Designer 👗 | Travel Lover ✈️'
    },
    {
      id: 'following-2',
      fullName: 'Đặng Văn M',
      username: 'dangvanm',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=c0aede',
      bio: 'Tech Enthusiast 💻 | Gamer 🎮'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([
    {
      id: 'suggested-1',
      fullName: 'Nguyễn Văn N',
      username: 'nguyenvann',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=b6e3f4',
      bio: 'Startup Founder 🚀 | AI Researcher 🤖'
    },
    {
      id: 'suggested-2',
      fullName: 'Trần Thị P',
      username: 'tranthip',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=ffdfbf',
      bio: 'Yoga Instructor 🧘‍♀️ | Wellness Coach 💪'
    },
    {
      id: 'suggested-3',
      fullName: 'Lê Văn Q',
      username: 'levanq',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah&backgroundColor=c0aede',
      bio: 'Environmental Scientist 🌱 | Nature Photographer 📸'
    }
  ]);

  // Comment out useEffect temporarily for testing
  /*useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);*/

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
    setActionLoading(prev => ({ ...prev, [`add_${userId}`]: true }));
    
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
      setActionLoading(prev => ({ ...prev, [`add_${userId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle accepting/declining a friend request
  const handleRequestResponse = async (requesterId, action) => {
    setActionLoading(prev => ({ ...prev, [`${action}_${requesterId}`]: true }));
    
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
      setActionLoading(prev => ({ ...prev, [`${action}_${requesterId}`]: false }));
      
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

  return (
    <div className="friends-page">
      <div className="container">
        <h1 className="page-title">Bạn bè & Người theo dõi</h1>
        
        {message && (
          <div className="message success-message">{message}</div>
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
              {activeTab === 'friends' && (
                <div className="friends-list">
                  <h2>Danh sách bạn bè ({friends.length})</h2>
                  {friends.length === 0 ? (
                    <div className="empty-state">
                      <p>Bạn chưa có người bạn nào. Hãy tìm và kết bạn với mọi người!</p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {friends.map(friend => (
                        <FriendCard
                          key={friend.id}
                          user={friend}
                          type="friend"
                          isFollowing={isUserFollowed(friend.id)}
                          onRemove={() => handleRemoveFriend(friend.id)}
                          onFollow={() => handleFollowToggle(friend.id, false)}
                          onUnfollow={() => handleFollowToggle(friend.id, true)}
                          loading={{
                            remove: actionLoading[`remove_${friend.id}`],
                            follow: actionLoading[`follow_${friend.id}`]
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="requests-list">
                  <h2>Lời mời kết bạn ({pendingRequests.length})</h2>
                  {pendingRequests.length === 0 ? (
                    <div className="empty-state">
                      <p>Không có lời mời kết bạn nào.</p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {pendingRequests.map(request => (
                        <FriendCard
                          key={request.id}
                          user={{
                            ...request.requester,
                            createdAt: request.createdAt
                          }}
                          type="request"
                          onAccept={() => handleRequestResponse(request.requester.id, 'accept')}
                          onReject={() => handleRequestResponse(request.requester.id, 'reject')}
                          loading={{
                            accept: actionLoading[`accept_${request.requester.id}`],
                            reject: actionLoading[`reject_${request.requester.id}`]
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'followers' && (
                <div className="followers-list">
                  <h2>Người theo dõi ({followers.length})</h2>
                  {followers.length === 0 ? (
                    <div className="empty-state">
                      <p>Chưa có ai theo dõi bạn.</p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {followers.map(follower => (
                        <FriendCard
                          key={follower.id}
                          user={follower}
                          type="follower"
                          isFollowing={isUserFollowed(follower.id)}
                          onAdd={() => handleSendRequest(follower.id)}
                          onFollow={() => handleFollowToggle(follower.id, false)}
                          onUnfollow={() => handleFollowToggle(follower.id, true)}
                          loading={{
                            add: actionLoading[`add_${follower.id}`],
                            follow: actionLoading[`follow_${follower.id}`]
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'following' && (
                <div className="following-list">
                  <h2>Đang theo dõi ({following.length})</h2>
                  {following.length === 0 ? (
                    <div className="empty-state">
                      <p>Bạn chưa theo dõi ai.</p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {following.map(followedUser => (
                        <FriendCard
                          key={followedUser.id}
                          user={followedUser}
                          type="following"
                          onAdd={() => handleSendRequest(followedUser.id)}
                          onUnfollow={() => handleFollowToggle(followedUser.id, true)}
                          loading={{
                            add: actionLoading[`add_${followedUser.id}`],
                            follow: actionLoading[`follow_${followedUser.id}`]
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="suggestions-list">
                  <h2>Gợi ý kết bạn</h2>
                  {suggestedUsers.length === 0 ? (
                    <div className="empty-state">
                      <p>Không có gợi ý kết bạn nào.</p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {suggestedUsers.map(suggestedUser => (
                        <FriendCard
                          key={suggestedUser.id}
                          user={suggestedUser}
                          type="suggestion"
                          isFollowing={isUserFollowed(suggestedUser.id)}
                          onAdd={() => handleSendRequest(suggestedUser.id)}
                          onFollow={() => handleFollowToggle(suggestedUser.id, false)}
                          onUnfollow={() => handleFollowToggle(suggestedUser.id, true)}
                          loading={{
                            add: actionLoading[`add_${suggestedUser.id}`],
                            follow: actionLoading[`follow_${suggestedUser.id}`]
                          }}
                        />
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