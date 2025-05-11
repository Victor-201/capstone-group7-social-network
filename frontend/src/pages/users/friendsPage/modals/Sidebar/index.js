import React from 'react';
import './style.scss';

const Sidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'friends', label: 'Tất cả bạn bè' },
    { key: 'requests', label: 'Lời mời kết bạn' },
    { key: 'recent', label: 'Gần đây' },
    { key: 'birthdays', label: 'Sinh nhật' },
    { key: 'custom', label: 'Danh sách tùy chỉnh' }
  ];

  return (
    <div className="friends-sidebar">
      <ul>
        {tabs.map(tab => (
          <li
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
