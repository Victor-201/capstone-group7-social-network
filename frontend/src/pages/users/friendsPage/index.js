import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaFilter, FaEllipsisH } from 'react-icons/fa';
import FriendCard from '../../../components/friendCard';
import UserCard from '../../../components/userCard';
import FriendSuggestions from '../../../components/friendSuggestions';
import Sidebar from './modals/Sidebar/index';
import { useFriends } from '../../../hooks/friends/useFriends';
import { useFriendRequests } from '../../../hooks/friends/useFriendRequests';
import { useFollow } from '../../../hooks/friends/useFollow';
import { useFriendActions } from '../../../hooks/friends/useFriendActions';
import { useBatchMutualFriends, useBatchMutualFriendsDetailed } from '../../../hooks/friends/useMutualFriends';
import './style.scss';

// Custom styled icon component
const ThemedIcon = ({ icon: Icon, className }) => {
  const themeClass = `themed-icon ${className || ''}`;
  return <Icon className={themeClass} />;
};

const FriendsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
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

  // Initialize activeTab state before using it in hooks
  const [activeTab, setActiveTab] = useState(() => {
    // Check URL params for initial tab
    const tabParam = searchParams.get('tab');
    return tabParam && ['friends', 'suggestions', 'requests', 'followers', 'following', 'recent', 'birthdays', 'custom'].includes(tabParam) 
      ? tabParam 
      : 'friends';
  });
  
  // Update tab when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['friends', 'suggestions', 'requests', 'followers', 'following', 'recent', 'birthdays', 'custom'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Prepare friend IDs for batch mutual friends fetching
  const allFriendIds = useMemo(() => {
    const ids = new Set();
    
    // Add friends
    if (Array.isArray(friends)) {
      friends.forEach(friend => friend?.id && ids.add(friend.id));
    }
    
    // Add received requests
    if (Array.isArray(receivedRequests)) {
      receivedRequests.forEach(request => {
        const requester = request?.Requester || request?.requester || request?.user;
        if (requester?.id) ids.add(requester.id);
      });
    }
    
    // Add followers
    if (Array.isArray(followers)) {
      followers.forEach(follower => follower?.id && ids.add(follower.id));
    }
    
    // Add following
    if (Array.isArray(following)) {
      following.forEach(followed => followed?.id && ids.add(followed.id));
    }
    
    return Array.from(ids);
  }, [friends, receivedRequests, followers, following]);

  // Fetch mutual friends counts for all users
  const {
    mutualCounts,
    loading: mutualLoading,
    error: mutualError
  } = useBatchMutualFriends(allFriendIds);

  // Fetch detailed mutual friends data for all tabs that need it
  const {
    mutualFriendsData,
    loading: mutualDetailedLoading,
    error: mutualDetailedError
  } = useBatchMutualFriendsDetailed(allFriendIds);

  // Debug log for mutual counts
  useEffect(() => {
    console.log('FriendsPage: mutualCounts updated:', mutualCounts);
    console.log('FriendsPage: mutualFriendsData updated:', mutualFriendsData);
    console.log('FriendsPage: allFriendIds:', allFriendIds);
  }, [mutualCounts, mutualFriendsData, allFriendIds]);

  const [localActionLoading, setLocalActionLoading] = useState({});
  const [message, setMessage] = useState(null);
  const [recentlyUnfriended, setRecentlyUnfriended] = useState(new Map());

  // Fetch tất cả dữ liệu
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      refetchFriends(),
      refetchRequests(),
      refetchFollow()
    ]);
  }, [refetchFriends, refetchRequests, refetchFollow]);

  // Fetch data khi component mount
  useEffect(() => {
    console.log('FriendsPage: Fetching initial data...');
    fetchAllData();
  }, [fetchAllData]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('FriendsPage state update:', {
      friendsCount: friends?.length || 0,
      requestsCount: receivedRequests?.length || 0,
      followersCount: followers?.length || 0,
      followingCount: following?.length || 0,
      activeTab
    });
  }, [friends, receivedRequests, followers, following, activeTab]);

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
        setMessage('Đã xóa khỏi danh sách bạn bè. Chuyển sang tab "Gợi ý kết bạn" để thêm lại.');
        // Store friend info temporarily so user can add them back
        setRecentlyUnfriended(prev => new Map(prev.set(friendId, friendInfo)));
        // Auto switch to suggestions tab
        setActiveTab('suggestions');
        navigate('/friends?tab=suggestions');
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

  // Handle unfollow user
  const handleUnfollowUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ theo dõi người này?')) {
      return;
    }
    
    setLocalActionLoading(prev => ({ ...prev, [`unfollow_${userId}`]: true }));
    
    try {
      const result = await unfollowUser(userId);
      if (result.success) {
        setMessage('Đã huỷ theo dõi người dùng');
        await fetchAllData();
      } else {
        setMessage('Có lỗi xảy ra khi huỷ theo dõi');
      }
    } catch (err) {
      console.error('handleUnfollowUser error', err);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`unfollow_${userId}`]: false }));
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle block user
  const handleBlockUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn chặn người này? Họ sẽ không thể xem trang cá nhân và tương tác với bạn.')) {
      return;
    }
    
    setLocalActionLoading(prev => ({ ...prev, [`block_${userId}`]: true }));
    
    try {
      // TODO: Implement block API call
      // const result = await blockUser(userId);
      setMessage('Đã chặn người dùng (Chức năng đang phát triển)');
    } catch (err) {
      console.error('handleBlockUser error', err);
      setMessage('Đã xảy ra lỗi khi chặn người dùng.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`block_${userId}`]: false }));
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Handle report user
  const handleReportUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn báo cáo người dùng này?')) {
      return;
    }
    
    setLocalActionLoading(prev => ({ ...prev, [`report_${userId}`]: true }));
    
    try {
      // TODO: Implement report API call
      // const result = await reportUser(userId);
      setMessage('Đã gửi báo cáo (Chức năng đang phát triển)');
    } catch (err) {
      console.error('handleReportUser error', err);
      setMessage('Đã xảy ra lỗi khi báo cáo.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`report_${userId}`]: false }));
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Compute display list để tránh duplicate keys
  const displayFriends = useMemo(() => {
    // Ensure friends is always an array
    const friendsList = Array.isArray(friends) ? friends : [];
    
    // Filter out recently unfriended users from friends list
    const currentFriends = friendsList.filter(friend => 
      friend && friend.id && !recentlyUnfriended.has(friend.id)
    );
    
    // For suggestions tab, show recently unfriended as suggestions
    // For friends tab, only show current friends
    if (activeTab === 'suggestions') {
      const unfriendedSuggestions = Array.from(recentlyUnfriended.entries())
        .filter(([userId, userInfo]) => userId && userInfo)
        .map(([userId, userInfo]) => ({
          ...userInfo,
          id: userId, // Keep original ID
          isSuggestion: true
        }));
      
      console.log('Suggestions mode - unfriended as suggestions:', unfriendedSuggestions.map(f => f.id));
      return unfriendedSuggestions;
    }
    
    console.log('Friends mode - current friends only:', currentFriends.map(f => f.id));
    console.log('Recently unfriended (hidden):', Array.from(recentlyUnfriended.keys()));
    
    return currentFriends;
  }, [friends, recentlyUnfriended, activeTab]);

  return (
    <div className="friends-page">
      <div className="container">
        {message && (<div className="message success-message">{message}</div>)}
        {(friendsError || requestsError || followError || actionError || mutualError) && (
          <div className="message error-message">
            <ThemedIcon icon={FaExclamationTriangle} className="error-icon" /> 
            {friendsError || requestsError || followError || actionError || mutualError}
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
                          {displayFriends.length > 0 ? displayFriends.map((friend, index) => {
                            // Validate friend object
                            if (!friend || !friend.id) {
                              console.warn('Invalid friend object:', friend);
                              return null;
                            }
                            
                            const isSuggestion = friend.isSuggestion;
                            const friendId = friend.id; // Use the actual ID
                            // Ensure absolutely unique keys using type prefix + id + index
                            const uniqueKey = isSuggestion ? `suggestion-${friendId}-${index}` : `friend-${friend.id}-${index}`;
                            
                            return (
                              <FriendCard
                                key={uniqueKey}
                                user={friend}
                                type={isSuggestion ? "suggestion" : "friend"}
                                onRemove={isSuggestion ? undefined : () => handleRemoveFriend(friendId)}
                                onAdd={isSuggestion ? () => handleSendRequest(friendId) : undefined}
                                onUnfollow={() => handleUnfollowUser(friendId)}
                                onBlock={() => handleBlockUser(friendId)}
                                onReport={() => handleReportUser(friendId)}
                                loading={{
                                  remove: localActionLoading[`remove_${friendId}`],
                                  add: localActionLoading[`add_${friendId}`],
                                  unfollow: localActionLoading[`unfollow_${friendId}`],
                                  block: localActionLoading[`block_${friendId}`],
                                  report: localActionLoading[`report_${friendId}`]
                                }}
                                mutualFriendsCount={mutualCounts[friendId] || 0}
                                mutualFriendsData={mutualFriendsData[friendId]?.mutualFriends || []}
                              />
                            );
                          }).filter(Boolean) : (
                            <div className="empty-state">
                              <p>Đang tải danh sách bạn bè...</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'suggestions' && (
                    <div className="suggestions-section">
                      <h2>
                        Gợi ý kết bạn
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      
                      {/* Show recently unfriended users first */}
                      {recentlyUnfriended.size > 0 && (
                        <div className="recent-unfriended">
                          <h3>Người bạn vừa xóa kết bạn</h3>
                          <div className="cards-grid">
                            {displayFriends.map((friend, index) => (
                              <FriendCard
                                key={`recent-${friend.id}-${index}`}
                                user={friend}
                                type="suggestion"
                                onAdd={() => handleSendRequest(friend.id)}
                                onUnfollow={() => handleUnfollowUser(friend.id)}
                                onBlock={() => handleBlockUser(friend.id)}
                                onReport={() => handleReportUser(friend.id)}
                                loading={{
                                  add: localActionLoading[`add_${friend.id}`],
                                  unfollow: localActionLoading[`unfollow_${friend.id}`],
                                  block: localActionLoading[`block_${friend.id}`],
                                  report: localActionLoading[`report_${friend.id}`]
                                }}
                                mutualFriendsCount={mutualCounts[friend.id] || 0}
                                mutualFriendsData={mutualFriendsData[friend.id]?.mutualFriends || []}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Show regular suggestions */}
                      <div className="regular-suggestions">
                        {recentlyUnfriended.size > 0 && <h3>Gợi ý khác</h3>}
                        <FriendSuggestions />
                      </div>
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
                        <div className="requests-cards-grid">
                          {(receivedRequests || []).map((request, index) => {
                            // Safe access to request data with multiple fallbacks
                            const requester = request?.Requester || request?.requester || request?.user;
                            
                            // Ensure requester exists and has required properties
                            if (!requester || !requester.id) {
                              console.warn('Invalid request data:', request);
                              return null;
                            }
                            
                            return (
                              <UserCard
                                key={`request-${requester.id}-${index}`}
                                user={{
                                  ...requester,
                                  full_name: requester.full_name || requester.fullName || requester.name,
                                  createdAt: request.created_at || request.createdAt
                                }}
                                onPrimaryAction={() => handleRequestResponse(requester.id, 'accept')}
                                onSecondaryAction={() => handleRequestResponse(requester.id, 'reject')}
                                loading={{
                                  primary: localActionLoading[`accept_${requester.id}`] || false,
                                  secondary: localActionLoading[`reject_${requester.id}`] || false
                                }}
                                mutualFriendsCount={mutualCounts[requester.id] || 0}
                                mutualFriendsData={mutualFriendsData[requester.id]?.mutualFriends || []}
                                primaryButtonText="Xác nhận"
                                secondaryButtonText="Xóa"
                                type="request"
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
                              onUnfollow={() => handleUnfollowUser(follower.id)}
                              onBlock={() => handleBlockUser(follower.id)}
                              onReport={() => handleReportUser(follower.id)}
                              loading={{
                                add: actionLoading[`add_${follower.id}`],
                                follow: actionLoading[`follow_${follower.id}`],
                                unfollow: localActionLoading[`unfollow_${follower.id}`],
                                block: localActionLoading[`block_${follower.id}`],
                                report: localActionLoading[`report_${follower.id}`]
                              }}
                              mutualFriendsCount={mutualCounts[follower.id] || 0}
                              mutualFriendsData={mutualFriendsData[follower.id]?.mutualFriends || []}
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
                              onUnfollow={() => handleUnfollowUser(followedUser.id)}
                              onBlock={() => handleBlockUser(followedUser.id)}
                              onReport={() => handleReportUser(followedUser.id)}
                              loading={{
                                add: actionLoading[`add_${followedUser.id}`],
                                follow: actionLoading[`follow_${followedUser.id}`],
                                unfollow: localActionLoading[`unfollow_${followedUser.id}`],
                                block: localActionLoading[`block_${followedUser.id}`],
                                report: localActionLoading[`report_${followedUser.id}`]
                              }}
                              mutualFriendsCount={mutualCounts[followedUser.id] || 0}
                              mutualFriendsData={mutualFriendsData[followedUser.id]?.mutualFriends || []}
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