import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaFilter, FaEllipsisH } from 'react-icons/fa';
import FriendCard from '../../../components/friendCard';
import Sidebar from './modals/Sidebar/index';
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
    unfriendUser: removeFriend,
    loading: actionLoading,
    error: actionError
  } = useFriendActions();

  const [activeTab, setActiveTab] = useState('friends');
  const [localActionLoading, setLocalActionLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [recentlyUnfriended, setRecentlyUnfriended] = useState(new Map());

  // Fetch tất cả dữ liệu
  const fetchAllData = useCallback(async () => {
    const results = await Promise.all([
      refetchFriends(),
      refetchRequests(),
      refetchFollow()
    ]);
  }, [refetchFriends, refetchRequests, refetchFollow]);

  // Fetch data khi component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle sending a friend request
  const handleSendRequest = async (userId) => {
    setLocalActionLoading(prev => ({ ...prev, [`add_${userId}`]: true }));
    
    try {
      const result = await sendFriendRequest(userId);
      if (result.success) {
        setMessage('Đã gửi lời mời kết bạn thành công');
        // Remove user from recently unfriended list
        setRecentlyUnfriended(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
        // Now refetch to get updated data
        await fetchAllData();
      } else {
        console.error('Error sending friend request:', result.message || 'Unknown error');
        setMessage('Có lỗi xảy ra khi gửi lời mời kết bạn');
      }
    } catch (err) {
      console.error('handleSendRequest error', err);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
        console.error('Error handling friend request:', result.message || 'Unknown error');
        setMessage('Có lỗi xảy ra khi xử lý lời mời kết bạn');
      }
    } catch (err) {
      console.error('handleRequestResponse error', err);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
    
    // Find friend info before removing
    const friendInfo = friends?.find(f => f.id === friendId);
    if (!friendInfo) {
      console.error('Friend not found');
      return;
    }
    
    setLocalActionLoading(prev => ({ ...prev, [`remove_${friendId}`]: true }));
    
    try {
      const result = await removeFriend(friendId);
      if (result.success) {
        setMessage('Đã xóa khỏi danh sách bạn bè');
        // Store friend info temporarily so user can add them back
        setRecentlyUnfriended(prev => new Map(prev.set(friendId, friendInfo)));
        // Don't refetch immediately to avoid duplicate display
      } else {
        console.error('Error removing friend:', result.message || 'Unknown error');
        setMessage('Có lỗi xảy ra khi xóa bạn bè');
      }
    } catch (err) {
      console.error('handleRemoveFriend error', err);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
        console.error('Error with follow action:', result.message || 'Unknown error');
        setMessage('Có lỗi xảy ra với thao tác theo dõi');
      }
    } catch (err) {
      console.error('handleFollowToggle error', err);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`follow_${userId}`]: false }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Compute display list để tránh duplicate keys
  const displayFriends = useMemo(() => {
    // Filter out recently unfriended users from friends list
    const currentFriends = (friends || []).filter(friend => !recentlyUnfriended.has(friend.id));
    
    // Create suggestion cards for recently unfriended users
    const unfriendedCards = Array.from(recentlyUnfriended.entries()).map(([userId, userInfo]) => ({
      ...userInfo,
      id: `unfriended-${userId}`, // Change ID to avoid duplicate
      originalId: userId, // Keep original ID for actions
      isSuggestion: true
    }));
    
    console.log('Current friends:', currentFriends.map(f => f.id));
    console.log('Recently unfriended:', Array.from(recentlyUnfriended.keys()));
    console.log('Unfriended cards:', unfriendedCards.map(f => f.id));
    
    const result = [...currentFriends, ...unfriendedCards];
    console.log('Final display list:', result.map(f => f.id));
    
    return result;
  }, [friends, recentlyUnfriended]);

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
                        Danh sách bạn bè ({(friends || []).length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaFilter} />
                          </button>
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      {!(friends?.length) && !recentlyUnfriended.size ? (
                        <div className="empty-state">
                          <p>Bạn chưa có người bạn nào. Hãy tìm và kết bạn với mọi người!</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {displayFriends.map((friend, index) => {
                            const isSuggestion = friend.isSuggestion;
                            const friendId = isSuggestion ? friend.originalId : friend.id;
                            // Ensure absolutely unique keys using type prefix + id + index
                            const uniqueKey = isSuggestion ? `suggestion-${friendId}-${index}` : `friend-${friend.id}-${index}`;
                            
                            return (
                              <FriendCard
                                key={uniqueKey}
                                user={friend}
                                type={isSuggestion ? "suggestion" : "friend"}
                                isFollowing={!isSuggestion ? isUserFollowed(friend.id) : undefined}
                                onRemove={!isSuggestion ? () => handleRemoveFriend(friendId) : undefined}
                                onAdd={isSuggestion ? () => handleSendRequest(friendId) : undefined}
                                onFollow={!isSuggestion ? () => handleFollowToggle(friendId, false) : undefined}
                                onUnfollow={!isSuggestion ? () => handleFollowToggle(friendId, true) : undefined}
                                loading={{
                                  remove: !isSuggestion ? localActionLoading[`remove_${friendId}`] : false,
                                  add: isSuggestion ? localActionLoading[`add_${friendId}`] : false,
                                  follow: !isSuggestion ? localActionLoading[`follow_${friendId}`] : false
                                }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'requests' && (
                    <div className="requests-list">
                      <h2>
                        Lời mời kết bạn ({(receivedRequests || []).length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      {!(receivedRequests?.length) ? (
                        <div className="empty-state">
                          <p>Không có lời mời kết bạn nào.</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {(receivedRequests || []).map((request, index) => {
                            // Safe access to request data with multiple fallbacks
                            const requester = request?.Requester || request?.requester;
                            
                            // Ensure requester exists and has required properties
                            if (!requester || !requester.id) {
                              console.warn('Invalid request data:', request);
                              return null;
                            }
                            
                            return (
                              <FriendCard
                                key={`request-${requester.id}-${index}`}
                                user={{
                                  ...requester,
                                  createdAt: request.created_at || request.createdAt
                                }}
                                type="request"
                                onAccept={() => handleRequestResponse(requester.id, 'accept')}
                                onReject={() => handleRequestResponse(requester.id, 'reject')}
                                loading={{
                                  accept: localActionLoading[`accept_${requester.id}`] || false,
                                  reject: localActionLoading[`reject_${requester.id}`] || false
                                }}
                              />
                            );
                          }).filter(Boolean)}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'followers' && (
                    <div className="followers-list">
                      <h2>Người theo dõi ({(followers || []).length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div></h2>
                      {!(followers?.length) ? (
                        <div className="empty-state">
                          <p>Chưa có ai theo dõi bạn.</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {(followers || []).map(follower => (
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
                      <h2>Đang theo dõi ({(following || []).length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div></h2>
                      {!(following?.length) ? (
                        <div className="empty-state">
                          <p>Bạn chưa theo dõi ai.</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {(following || []).map(followedUser => (
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