import React from 'react';
import Header from '../../../components/Header';
import DarkModeToggle from '../../../components/DarkModeToggle';
import mockData from '../../../mockData';
import './style.scss';

const FriendsPage = () => {
  const friends = mockData.profile.friends;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header />
      <DarkModeToggle />
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bạn bè</h2>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè"
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Tất cả bạn bè</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Bạn bè gần đây</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Từ quê hương</button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Theo dõi</button>
        </div>
        <p className="mb-4">{friends.length} bạn bè</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {friends.map(friend => (
            <div key={friend.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <img src={friend.avatar} alt="Friend" className="w-16 h-16 rounded-lg" />
                <button className="text-gray-500">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
              <h3 className="mt-2 font-semibold">{friend.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{friend.mutualFriends} bạn chung</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;