import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import DefaultAvatar from '../../../components/DefaultAvatar';
import { FaUsers, FaSearch, FaPlus, FaUserPlus, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import './style.scss';

const GroupsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('yourGroups');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [recommendedGroups, setRecommendedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Fetch groups data from API
  useEffect(() => {
    const fetchGroups = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user's groups
        const userGroupsResponse = await fetch(`${API_URL}/api/groups/my-groups`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userGroupsResponse.ok) {
          throw new Error(`HTTP error! Status: ${userGroupsResponse.status}`);
        }
        
        const userGroupsData = await userGroupsResponse.json();
        setUserGroups(userGroupsData || []);
        
        // Fetch recommended groups
        const recommendedResponse = await fetch(`${API_URL}/api/groups/recommended`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!recommendedResponse.ok) {
          throw new Error(`HTTP error! Status: ${recommendedResponse.status}`);
        }
        
        const recommendedData = await recommendedResponse.json();
        setRecommendedGroups(recommendedData || []);
        
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setError("Không thể tải thông tin nhóm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, [isAuthenticated, API_URL]);

  // Handle joining a group
  const handleJoinGroup = async (groupId) => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Update local state
      setRecommendedGroups(prevGroups => 
        prevGroups.filter(group => group.id !== groupId)
      );
      
      // Refresh user groups
      const userGroupsResponse = await fetch(`${API_URL}/api/groups/my-groups`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userGroupsResponse.ok) {
        throw new Error(`HTTP error! Status: ${userGroupsResponse.status}`);
      }
      
      const userGroupsData = await userGroupsResponse.json();
      setUserGroups(userGroupsData || []);
      
    } catch (err) {
      console.error("Failed to join group:", err);
      setError("Không thể tham gia nhóm. Vui lòng thử lại sau.");
    }
  };

  // Handle leaving a group
  const handleLeaveGroup = async (groupId) => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update local state
      setUserGroups(prevGroups => 
        prevGroups.filter(group => group.id !== groupId)
      );
      
      // Refresh recommended groups
      const recommendedResponse = await fetch(`${API_URL}/api/groups/recommended`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!recommendedResponse.ok) {
        throw new Error(`HTTP error! Status: ${recommendedResponse.status}`);
      }
      
      const recommendedData = await recommendedResponse.json();
      setRecommendedGroups(recommendedData || []);
      
    } catch (err) {
      console.error("Failed to leave group:", err);
      setError("Không thể rời khỏi nhóm. Vui lòng thử lại sau.");
    }
  };

  // Handle creating a new group
  const handleCreateGroup = () => {
    // In a real app, this would open a modal or navigate to a create group page
    alert("Tính năng đang phát triển");
  };

  // Filter groups by search term
  const filteredUserGroups = userGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredRecommendedGroups = recommendedGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="groups-page">
      <div className="groups-container">
        <div className="groups-header">
          <h1>Nhóm</h1>
          <div className="groups-search">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhóm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="create-group-btn" onClick={handleCreateGroup}>
            <FaPlus className="btn-icon" /> Tạo nhóm mới
          </button>
        </div>

        <div className="groups-tabs">
          <button 
            className={`tab-btn ${activeTab === 'yourGroups' ? 'active' : ''}`}
            onClick={() => setActiveTab('yourGroups')}
          >
            Nhóm của bạn
          </button>
          <button 
            className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Khám phá
          </button>
        </div>

        {isLoading ? (
          <div className="loading-card">
            <div className="loader"></div>
            <p>Đang tải nhóm...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <p>{error}</p>
          </div>
        ) : (
          <div className="groups-content">
            {activeTab === 'yourGroups' && (
              <>
                {filteredUserGroups.length === 0 ? (
                  <div className="empty-groups">
                    <FaUsers className="empty-icon" />
                    <h3>Bạn chưa tham gia nhóm nào</h3>
                    <p>Hãy khám phá và tham gia các nhóm phù hợp với sở thích của bạn</p>
                    <button 
                      className="discover-btn"
                      onClick={() => setActiveTab('discover')}
                    >
                      Khám phá nhóm
                    </button>
                  </div>
                ) : (
                  <div className="groups-grid">
                    {filteredUserGroups.map(group => (
                      <div className="group-card" key={group.id}>
                        <div className="group-header">
                          {group.image ? (
                            <img src={group.image} alt={group.name} className="group-image" />
                          ) : (
                            <div className="default-group-image">
                              <FaUsers />
                            </div>
                          )}
                        </div>
                        <div className="group-info">
                          <h3 className="group-name">{group.name}</h3>
                          <p className="group-meta">
                            {group.memberCount?.toLocaleString() || '0'} thành viên • {group.privacy === 'public' ? 'Công khai' : 'Riêng tư'}
                          </p>
                          {group.unreadPosts > 0 && (
                            <div className="unread-badge">
                              {group.unreadPosts} bài viết mới
                            </div>
                          )}
                          {!group.isAdmin && (
                            <button 
                              className="leave-btn"
                              onClick={() => handleLeaveGroup(group.id)}
                            >
                              <FaSignOutAlt className="btn-icon" /> Rời nhóm
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {filteredUserGroups.length > 0 && filteredRecommendedGroups.length > 0 && (
                  <div className="section-divider"></div>
                )}
                
                {filteredRecommendedGroups.length > 0 && (
                  <div className="groups-section">
                    <h2>Nhóm đề xuất cho bạn</h2>
                    <div className="groups-grid">
                      {filteredRecommendedGroups.map(group => (
                        <div className="group-card" key={group.id}>
                          <div className="group-header">
                            {group.image ? (
                              <img src={group.image} alt={group.name} className="group-image" />
                            ) : (
                              <div className="default-group-image">
                                <FaUsers />
                              </div>
                            )}
                          </div>
                          <div className="group-info">
                            <h3 className="group-name">{group.name}</h3>
                            <p className="group-meta">
                              {group.memberCount?.toLocaleString() || '0'} thành viên • {group.privacy === 'public' ? 'Công khai' : 'Riêng tư'}
                            </p>
                            <button 
                              className="join-btn"
                              onClick={() => handleJoinGroup(group.id)}
                            >
                              <FaUserPlus className="btn-icon" /> Tham gia
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'discover' && (
              <div className="discover-groups">
                {filteredRecommendedGroups.length === 0 ? (
                  <div className="empty-groups">
                    <FaUsers className="empty-icon" />
                    <h3>Không có nhóm phù hợp</h3>
                    <p>Không tìm thấy nhóm nào phù hợp với tìm kiếm của bạn</p>
                  </div>
                ) : (
                  <div className="groups-grid">
                    {filteredRecommendedGroups.map(group => (
                      <div className="group-card" key={group.id}>
                        <div className="group-header">
                          {group.image ? (
                            <img src={group.image} alt={group.name} className="group-image" />
                          ) : (
                            <div className="default-group-image">
                              <FaUsers />
                            </div>
                          )}
                        </div>
                        <div className="group-info">
                          <h3 className="group-name">{group.name}</h3>
                          <p className="group-meta">
                            {group.memberCount?.toLocaleString() || '0'} thành viên • {group.privacy === 'public' ? 'Công khai' : 'Riêng tư'}
                          </p>
                          <button 
                            className="join-btn"
                            onClick={() => handleJoinGroup(group.id)}
                          >
                            <FaUserPlus className="btn-icon" /> Tham gia
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;