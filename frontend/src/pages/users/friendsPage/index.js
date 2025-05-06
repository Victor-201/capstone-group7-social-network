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
      fullName: 'Phạm Văn D',
      username: 'phamvand',
      avatar: null,
      bio: 'Bạn từ thời đại học'
    },
    {
      id: 'friend-2',
      fullName: 'Hoàng Thị E',
      username: 'hoangthie',
      avatar: null,
      bio: 'Đồng nghiệp cũ'
    }
  ]);
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'request-1',
      requester: {
        id: 'requester-1',
        fullName: 'Đỗ Văn F',
        username: 'dovanf',
        avatar: null
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'request-2',
      requester: {
        id: 'requester-2',
        fullName: 'Vũ Thị G',
        username: 'vuthig',
        avatar: null
      },
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 ngày trước
    }
  ]);
  const [followers, setFollowers] = useState([
    {
      id: 'follower-1',
      fullName: 'Ngô Văn H',
      username: 'ngovanh',
      avatar: null,
      bio: 'Người theo dõi nhiệt tình'
    }
  ]);
  const [following, setFollowing] = useState([
    {
      id: 'following-1',
      fullName: 'Trịnh Thị I',
      username: 'trinhthii',
      avatar: null,
      bio: 'Blogger nổi tiếng'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([
    {
      id: 'test-user-1',
      fullName: 'Nguyễn Văn A',
      username: 'nguyenvana',
      avatar: null,
      bio: 'Xin chào! Tôi là Nguyễn Văn A'
    },
    {
      id: 'test-user-2', 
      fullName: 'Trần Thị B',
      username: 'tranthib',
      avatar: null,
      bio: 'Rất vui được làm quen!'
    },
    {
      id: 'test-user-3',
      fullName: 'Lê Văn C',
      username: 'levanc',
      avatar: null,
      bio: 'Tôi thích đọc sách và du lịch'
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