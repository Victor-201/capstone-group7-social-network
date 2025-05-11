import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaFilter, FaEllipsisH } from 'react-icons/fa';
import FriendCard from '../../../components/friendCard';
import Sidebar from './modals/Sidebar';
import './style.scss';

// Custom styled icon component
const ThemedIcon = ({ icon: Icon, className }) => {
  const themeClass = `themed-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const FriendsPage = () => {
  const { getFriendsList, getPendingFriendRequests, getFollowers, getFollowing, sendFriendRequest, respondToFriendRequest, removeFriend, followUser, unfollowUser } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([
    {
      id: 'friend-1',
      fullName: 'Nguyễn Xuân Hải',
      username: 'xuanhai0913',
      avatar: 'v1652278394/user_avatars/friend_1.jpg',
    },
    {
      id: 'friend-2',
      fullName: 'Nguyễn Ngọc Trung',
      username: 'hoangthie',
      avatar: 'v1652278394/user_avatars/friend_2.jpg',
    },
    {
      id: 'friend-3',
      fullName: 'Nguyễn Văn Thắng',
      username: 'tranminhf',
      avatar: 'v1652278394/user_avatars/friend_3.jpg',
    }
  ]);
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'request-1',
      requester: {
        id: 'requester-1',
        fullName: 'Đỗ Văn G',
        username: 'dovang',
        avatar: 'v1652278394/user_avatars/requester_1.jpg',
      },
    },
    {
      id: 'request-2',
      requester: {
        id: 'requester-2',
        fullName: 'Vũ Thị H',
        username: 'vuthih',
        avatar: 'v1652278394/user_avatars/requester_2.jpg',
      },
    }
  ]);
  const [followers, setFollowers] = useState([
    {
      id: 'follower-1',
      fullName: 'Ngô Văn I',
      username: 'ngovani',
      avatar: 'v1652278394/user_avatars/follower_1.jpg',
    },
    {
      id: 'follower-2',
      fullName: 'Lê Thị K',
      username: 'lethik',
      avatar: 'v1652278394/user_avatars/follower_2.jpg',
    }
  ]);
  const [following, setFollowing] = useState([
    {
      id: 'following-1',
      fullName: 'Trịnh Thị L',
      username: 'trinhthi',
      avatar: 'v1652278394/user_avatars/following_1.jpg',
    },
    {
      id: 'following-2',
      fullName: 'Đặng Văn M',
      username: 'dangvanm',
      avatar: 'v1652278394/user_avatars/following_2.jpg',
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState(null);

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

  return (
    <div className="friends-page">
      <div className="container">
        {message && (<div className="message success-message">{message}</div>)}
        {error && (<div className="message error-message"><ThemedIcon icon={FaExclamationTriangle} className="error-icon" /> {error}</div>)}
        
        <div className="friends-wrapper">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="friends-main">
            <div className="content">
              <div className="search-friends">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bạn bè" 
                  className="search-input"
                />
                <div className="search-icon">
                  <ThemedIcon icon={FaSearch} />
                </div>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <ThemedIcon icon={FaSpinner} className="spinner" />
                  <p>Đang tải...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'friends' && (
                    <div className="friends-list">
                      <h2>
                        Danh sách bạn bè ({friends.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaFilter} />
                          </button>
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
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
                      <h2>
                        Lời mời kết bạn ({pendingRequests.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
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
                      <h2>Người theo dõi ({followers.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div></h2>
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
                      <h2>Đang theo dõi ({following.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div></h2>
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

                  {activeTab === 'recent' && (
                    <div className="recent-list">
                      <h2>
                        Bạn bè gần đây
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      <div className="empty-state">
                        <p>Chưa có hoạt động gần đây với bạn bè.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'birthdays' && (
                    <div className="birthdays-list">
                      <h2>
                        Sinh nhật bạn bè
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      <div className="empty-state">
                        <p>Không có sinh nhật bạn bè trong thời gian tới.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'custom' && (
                    <div className="custom-list">
                      <h2>
                        Danh sách tùy chỉnh
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      <div className="empty-state">
                        <p>Bạn chưa tạo danh sách tùy chỉnh nào.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;