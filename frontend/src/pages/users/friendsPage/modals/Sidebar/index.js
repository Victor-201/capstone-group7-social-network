import React from 'react';
import { FaUserFriends, FaUserPlus, FaHistory, FaBirthdayCake, FaListUl, FaCog, FaUsers } from 'react-icons/fa';
import './style.scss';

const Sidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'friends', label: 'Tất cả bạn bè', icon: <FaUserFriends /> },
    { key: 'suggestions', label: 'Gợi ý kết bạn', icon: <FaUsers /> },
    { key: 'requests', label: 'Lời mời kết bạn', icon: <FaUserPlus /> },
    { key: 'recent', label: 'Gần đây', icon: <FaHistory /> },
    { key: 'birthdays', label: 'Sinh nhật', icon: <FaBirthdayCake /> },
    { key: 'custom', label: 'Danh sách tùy chỉnh', icon: <FaListUl /> }
  ];

  return (
    <div className="friends-sidebar">
      <div className="sidebar-header">
        <h3>Bạn bè</h3>
        <button className="settings-button">
          <FaCog />
        </button>
      </div>
      <ul>
        {tabs.map(tab => (
          <li
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => onTabChange(tab.key)}
          >
            <span className="icon">{tab.icon}</span>
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
