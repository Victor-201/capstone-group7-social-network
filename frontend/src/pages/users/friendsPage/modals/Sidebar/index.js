import React from 'react';
import { FaUserFriends, FaUserPlus, FaUsers, FaUserTimes, FaSpinner } from 'react-icons/fa';
import './style.scss';

const Sidebar = ({ activeTab, onTabChange, tabLoading = new Set() }) => {
  const tabs = [
    { key: 'friends', label: 'Tất cả bạn bè', icon: <FaUserFriends /> },
    { key: 'suggestions', label: 'Gợi ý kết bạn', icon: <FaUsers /> },
    { key: 'requests', label: 'Lời mời kết bạn', icon: <FaUserPlus /> },
    { key: 'followers', label: 'Người theo dõi', icon: <FaUserPlus /> },
    { key: 'following', label: 'Đang theo dõi', icon: <FaUserTimes /> }
  ];

  return (
    <div className="sidebar-navigation">
      <ul className="nav-list">
        {tabs.map(tab => (
          <li
            key={tab.key}
            className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            <div className="nav-link">
              <span className="nav-icon">
                {tabLoading.has(tab.key) ? <FaSpinner className="spinner" /> : tab.icon}
              </span>
              <span className="nav-label">{tab.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
