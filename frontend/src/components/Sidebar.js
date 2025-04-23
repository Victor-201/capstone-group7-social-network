import React from 'react';

const Sidebar = ({ userData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Giới thiệu</h3>
        <ul className="mt-3 space-y-2">
          {userData.about.map((item, index) => (
            <li key={index} className="flex items-center" dangerouslySetInnerHTML={{ __html: item.text }} />
          ))}
        </ul>
        <button className="mt-4 w-full bg-gray-200 dark:bg-gray-700 p-2 rounded">
          Chỉnh sửa chi tiết
        </button>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Ảnh</h3>
          <a href="#photos" className="text-blue-600">Xem tất cả ảnh</a>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {userData.photos.slice(0, 9).map((photo, index) => (
            <img key={index} src={photo} alt="Photo" className="w-full h-20 object-cover rounded" />
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Bạn bè</h3>
          <a href="#friends" className="text-blue-600">Xem tất cả bạn bè</a>
        </div>
        <p className="mt-2">{userData.friendsCount} bạn bè</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {userData.friends.slice(0, 6).map((friend, index) => (
            <div key={index}>
              <img src={friend.avatar} alt="Friend" className="w-full h-20 object-cover rounded" />
              <p className="text-sm mt-1">{friend.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;