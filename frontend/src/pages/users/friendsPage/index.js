import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaFilter, FaEllipsisH, FaBars, FaTimes } from 'react-icons/fa';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, recent, online
  const [filterBy, setFilterBy] = useState('all'); // all, online, recent

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
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

  // Close filter dropdown when clicking outside - NOT NEEDED ANYMORE
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (filterOpen && !event.target.closest('.filter-dropdown')) {
  //       setFilterOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [filterOpen]);

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
    error: mutualError
  } = useBatchMutualFriends(allFriendIds);

  // Fetch detailed mutual friends data for all tabs that need it
  const {
    mutualFriendsData,
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

  // Handle follow user
  const handleFollowUser = async (userId) => {
    setLocalActionLoading(prev => ({ ...prev, [`follow_${userId}`]: true }));
    
    try {
      const result = await followUser(userId);
      if (result.success) {
        setMessage('Đã theo dõi người dùng');
        await fetchAllData(); // Refresh data
      } else {
        console.error('Error following user:', result.message || 'Unknown error');
        setMessage('Có lỗi xảy ra khi theo dõi người dùng');
      }
    } catch (err) {
      console.error('handleFollowUser error', err);
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
    setLocalActionLoading(prev => ({ ...prev, [`unfollow_${userId}`]: true }));
    
    try {
      const result = await unfollowUser(userId);
      if (result.success) {
        setMessage('Đã bỏ theo dõi người dùng');
        await fetchAllData(); // Refresh data
      } else {
        console.error('Error unfollowing user:', result.message || 'Unknown error');
        setMessage('Có lỗi xảy ra khi bỏ theo dõi người dùng');
      }
    } catch (err) {
      console.error('handleUnfollowUser error', err);
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLocalActionLoading(prev => ({ ...prev, [`unfollow_${userId}`]: false }));
      
      // Clear message after 3 seconds
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

  // Search and filter logic
  const filterAndSearchUsers = useCallback((userList, query = debouncedSearchQuery) => {
    if (!Array.isArray(userList)) return [];
    
    let filtered = [...userList];
    
    // Apply search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user?.full_name?.toLowerCase().includes(searchLower) ||
        user?.email?.toLowerCase().includes(searchLower) ||
        user?.bio?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filterBy === 'online') {
      filtered = filtered.filter(user => user?.isOnline === true);
    } else if (filterBy === 'recent') {
      // Sort by most recent interaction/creation
      filtered = filtered.filter(user => {
        const daysDiff = user?.created_at ? 
          (Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24) : 
          Infinity;
        return daysDiff <= 7; // Recent within 7 days
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a?.full_name || '').localeCompare(b?.full_name || '');
        case 'recent':
          return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
        case 'online':
          if (a?.isOnline && !b?.isOnline) return -1;
          if (!a?.isOnline && b?.isOnline) return 1;
          return (a?.full_name || '').localeCompare(b?.full_name || '');
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [debouncedSearchQuery, filterBy, sortBy]);

  // Apply filters to each list
  const filteredFriends = useMemo(() => 
    filterAndSearchUsers(displayFriends), 
    [displayFriends, filterAndSearchUsers]
  );
  
  const filteredRequests = useMemo(() => {
    const requestUsers = (receivedRequests || []).map(request => {
      const requester = request?.Requester || request?.requester || request?.user;
      return requester ? {
        ...requester,
        created_at: request.created_at || request.createdAt,
        requestData: request
      } : null;
    }).filter(Boolean);
    
    return filterAndSearchUsers(requestUsers);
  }, [receivedRequests, filterAndSearchUsers]);
  
  const filteredFollowers = useMemo(() => 
    filterAndSearchUsers(followers || []), 
    [followers, filterAndSearchUsers]
  );
  
  const filteredFollowing = useMemo(() => 
    filterAndSearchUsers(following || []), 
    [following, filterAndSearchUsers]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter toggle - NOT NEEDED ANYMORE
  // const handleFilterToggle = () => {
  //   setFilterOpen(!filterOpen);
  // };

  // Handle filter option change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleFilterChange = (newFilterBy) => {
    setFilterBy(newFilterBy);
  };

  // Clear search and filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterBy('all');
    setSortBy('name');
  };

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
          {/* Mobile sidebar overlay */}
          <div 
            className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />
          
          <div className={`friends-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
            {/* Mobile close button */}
            <button 
              className="mobile-close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <ThemedIcon icon={FaTimes} />
            </button>
            
            <h1 className="page-title">Bạn bè</h1>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          <div className="friends-main">
            <div className="content">
              {/* Mobile header with toggle */}
              <div className="mobile-header">
                <button 
                  className="mobile-toggle-btn"
                  onClick={() => setSidebarOpen(true)}
                >
                  <ThemedIcon icon={FaBars} />
                  <span>Menu</span>
                </button>
                <h2 className="mobile-title">Bạn bè</h2>
              </div>
              
              <div className="search-friends">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm bạn bè" 
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div className="search-icon">
                  {searchQuery && searchQuery !== debouncedSearchQuery ? (
                    <ThemedIcon icon={FaSpinner} className="spinner" />
                  ) : (
                    <ThemedIcon icon={FaSearch} />
                  )}
                </div>
                {searchQuery && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                    title="Xóa tìm kiếm"
                  >
                    <ThemedIcon icon={FaTimes} />
                  </button>
                )}
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
                        Danh sách bạn bè ({filteredFriends.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      
                      {/* Beautiful inline filter controls */}
                      <div className="search-controls">
                        <div className="search-row">
                          <div className="filter-buttons">
                            <span className="section-label">Lọc:</span>
                            <button 
                              className={`filter-btn ${filterBy === 'all' ? 'active' : ''}`}
                              onClick={() => handleFilterChange('all')}
                            >
                              Tất cả
                            </button>
                            <button 
                              className={`filter-btn ${filterBy === 'online' ? 'active' : ''}`}
                              onClick={() => handleFilterChange('online')}
                            >
                              Online
                            </button>
                            <button 
                              className={`filter-btn ${filterBy === 'recent' ? 'active' : ''}`}
                              onClick={() => handleFilterChange('recent')}
                            >
                              Gần đây
                            </button>
                          </div>
                          
                          <div className="sort-buttons">
                            <span className="section-label">Sắp xếp:</span>
                            <button 
                              className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                              onClick={() => handleSortChange('name')}
                            >
                              Tên A-Z
                            </button>
                            <button 
                              className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                              onClick={() => handleSortChange('recent')}
                            >
                              Gần đây
                            </button>
                            <button 
                              className={`sort-btn ${sortBy === 'online' ? 'active' : ''}`}
                              onClick={() => handleSortChange('online')}
                            >
                              Online
                            </button>
                          </div>
                          
                          {(filterBy !== 'all' || sortBy !== 'name') && (
                            <button 
                              className="clear-all-btn"
                              onClick={clearFilters}
                            >
                              ✨ Xóa bộ lọc
                            </button>
                          )}
                        </div>
                      </div>
                      {!filteredFriends.length && !recentlyUnfriended.size ? (
                        <div className="empty-state">
                          <p>{debouncedSearchQuery ? 'Không tìm thấy bạn bè nào phù hợp.' : 'Bạn chưa có người bạn nào. Hãy tìm và kết bạn với mọi người!'}</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {filteredFriends.length > 0 ? filteredFriends.map((friend, index) => {
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
                        Lời mời kết bạn ({filteredRequests.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div>
                      </h2>
                      {!filteredRequests.length ? (
                        <div className="empty-state">
                          <p>{debouncedSearchQuery ? 'Không tìm thấy lời mời kết bạn nào phù hợp.' : 'Không có lời mời kết bạn nào.'}</p>
                        </div>
                      ) : (
                        <div className="requests-cards-grid">
                          {filteredRequests.map((requestUser, index) => {
                            // Use the processed request user data
                            if (!requestUser || !requestUser.id) {
                              console.warn('Invalid request user data:', requestUser);
                              return null;
                            }
                            
                            return (
                              <UserCard
                                key={`request-${requestUser.id}-${index}`}
                                user={{
                                  ...requestUser,
                                  full_name: requestUser.full_name || requestUser.fullName || requestUser.name,
                                  createdAt: requestUser.created_at || requestUser.createdAt
                                }}
                                onPrimaryAction={() => handleRequestResponse(requestUser.id, 'accept')}
                                onSecondaryAction={() => handleRequestResponse(requestUser.id, 'reject')}
                                loading={{
                                  primary: localActionLoading[`accept_${requestUser.id}`] || false,
                                  secondary: localActionLoading[`reject_${requestUser.id}`] || false
                                }}
                                mutualFriendsCount={mutualCounts[requestUser.id] || 0}
                                mutualFriendsData={mutualFriendsData[requestUser.id]?.mutualFriends || []}
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
                      <h2>Người theo dõi ({filteredFollowers.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div></h2>
                      {!filteredFollowers.length ? (
                        <div className="empty-state">
                          <p>{debouncedSearchQuery ? 'Không tìm thấy người theo dõi nào phù hợp.' : 'Chưa có ai theo dõi bạn.'}</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {filteredFollowers.map(follower => (
                            <FriendCard
                              key={follower.id}
                              user={follower}
                              type="follower"
                              isFollowing={isUserFollowed(follower.id)}
                              onAdd={() => handleSendRequest(follower.id)}
                              onFollow={() => handleFollowUser(follower.id)}
                              onUnfollow={() => handleUnfollowUser(follower.id)}
                              onBlock={() => handleBlockUser(follower.id)}
                              onReport={() => handleReportUser(follower.id)}
                              loading={{
                                add: localActionLoading[`add_${follower.id}`],
                                follow: localActionLoading[`follow_${follower.id}`],
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
                      <h2>Đang theo dõi ({filteredFollowing.length})
                        <div className="section-actions">
                          <button className="action-btn">
                            <ThemedIcon icon={FaEllipsisH} />
                          </button>
                        </div></h2>
                      {!filteredFollowing.length ? (
                        <div className="empty-state">
                          <p>{debouncedSearchQuery ? 'Không tìm thấy ai bạn đang theo dõi phù hợp.' : 'Bạn chưa theo dõi ai.'}</p>
                        </div>
                      ) : (
                        <div className="cards-grid">
                          {filteredFollowing.map(followedUser => (
                            <FriendCard
                              key={followedUser.id}
                              user={followedUser}
                              type="following"
                              onAdd={() => handleSendRequest(followedUser.id)}
                              onUnfollow={() => handleUnfollowUser(followedUser.id)}
                              onBlock={() => handleBlockUser(followedUser.id)}
                              onReport={() => handleReportUser(followedUser.id)}
                              loading={{
                                add: localActionLoading[`add_${followedUser.id}`],
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