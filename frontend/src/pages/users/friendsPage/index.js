import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaFilter, FaEllipsisH } from 'react-icons/fa';
import FriendCard from '../../../components/friendCard';
import Sidebar from './modals/Sidebar';
import { useFriends } from '../../../hooks/friends/useFriends';
import { useFriendRequests } from '../../../hooks/friends/useFriendRequests';
import { useFollow } from '../../../hooks/friends/useFollow';
import { useFriendActions } from '../../../hooks/friends/useFriendActions';
import './style.scss';

// Custom styled icon component
const ThemedIcon = ({ icon: Icon, className }) => {
  const themeClass = `themed-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const FriendsPage = () => {
  // Sử dụng hooks từ friends/ folder
  const {
    friends,
    loading: friendsLoading,
    error: friendsError,
    refetch: refetchFriends
  } = useFriends();

  const {
    receivedRequests,
    sentRequests,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests
  } = useFriendRequests();

  const {
    followers,
    following,
    loading: followLoading,
    error: followError,
    follow: followUser,
    unfollow: unfollowUser,
    isUserFollowed,
    refetch: refetchFollow
  } = useFollow();

  const {
    sendRequest: sendFriendRequest,
    acceptRequest: acceptFriendRequest,
    rejectRequest: rejectFriendRequest,
    removeFriend,
    loading: actionLoading,
    error: actionError
  } = useFriendActions();

  const [activeTab, setActiveTab] = useState('friends');
  const [localActionLoading, setLocalActionLoading] = useState({});
  const [message, setMessage] = useState(null);

  // Fetch data khi component mount
  useEffect(() => {
    fetchAllData();
  }, [refetchFriends, refetchRequests, refetchFollow]);

  // Fetch tất cả dữ liệu
  const fetchAllData = async () => {
    await Promise.all([
      refetchFriends(),
      refetchRequests(),
      refetchFollow()
    ]);
  };

  // Handle sending a friend request
  const handleSendRequest = async (userId) => {
    setLocalActionLoading(prev => ({ ...prev, [`add_${userId}`]: true }));
    
    try {
      const result = await sendFriendRequest(userId);
      if (result.success) {
        setMessage('Đã gửi lời mời kết bạn thành công');
        // Refresh the data
        await fetchAllData();
      } else {
        console.error('Error sending friend request:', result.message);
      }
    } catch (err) {
      console.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`add_${userId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle accepting/declining a friend request
  const handleRequestResponse = async (requesterId, action) => {
    setLocalActionLoading(prev => ({ ...prev, [`${action}_${requesterId}`]: true }));
    
    try {
      let result;
      if (action === 'accept') {
        result = await acceptFriendRequest(requesterId);
      } else {
        result = await rejectFriendRequest(requesterId);
      }
      
      if (result.success) {
        setMessage(`Đã ${action === 'accept' ? 'chấp nhận' : 'từ chối'} lời mời kết bạn`);
        // Refresh data after action
        await fetchAllData();
      } else {
        console.error('Error handling friend request:', result.message);
      }
    } catch (err) {
      console.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`${action}_${requesterId}`]: false }));
      
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
    
    setLocalActionLoading(prev => ({ ...prev, [`remove_${friendId}`]: true }));
    
    try {
      const result = await removeFriend(friendId);
      if (result.success) {
        setMessage('Đã xóa khỏi danh sách bạn bè');
        // Friends list will be updated automatically by the hook
        await fetchAllData();
      } else {
        console.error('Error removing friend:', result.message);
      }
    } catch (err) {
      console.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`remove_${friendId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle follow/unfollow user
  const handleFollowToggle = async (userId, isFollowing) => {
    setLocalActionLoading(prev => ({ ...prev, [`follow_${userId}`]: true }));
    
    try {
      let result;
      if (isFollowing) {
        result = await unfollowUser(userId);
        if (result.success) {
          setMessage('Đã hủy theo dõi người dùng');
        }
      } else {
        result = await followUser(userId);
        if (result.success) {
          setMessage('Đã theo dõi người dùng');
        }
      }
      
      if (!result.success) {
        console.error('Error with follow action:', result.message);
      }
    } catch (err) {
      console.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`follow_${userId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="friends-page">
      <div className="container">
        {message && (<div className="message success-message">{message}</div>)}
        {(friendsError || requestsError || followError || actionError) && (
          <div className="message error-message">
            <ThemedIcon icon={FaExclamationTriangle} className="error-icon" /> 
            {friendsError || requestsError || followError || actionError}
          </div>
        )}
        
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
              
              {(friendsLoading || requestsLoading || followLoading || actionLoading) ? (
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
                                remove: localActionLoading[`remove_${friend.id}`],
                                follow: localActionLoading[`follow_${friend.id}`]
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
                        Lời mời kết bạn ({receivedRequests.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      {receivedRequests.length === 0 ? (
                        <div className="empty-state">
                          <p>Không có lời mời kết bạn nào.</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {receivedRequests.map(request => (
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
                                accept: localActionLoading[`accept_${request.requester.id}`],
                                reject: localActionLoading[`reject_${request.requester.id}`]
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