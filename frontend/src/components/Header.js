import React from 'react';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-3 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <i className="fab fa-facebook text-blue-600 text-3xl"></i>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
            <input
              type="text"
              placeholder="Tìm kiếm trên ..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex space-x-6">
          <i className="fas fa-home text-2xl text-blue-600"></i>
          <i className="fas fa-play text-2xl text-gray-500"></i>
          <i className="fas fa-store text-2xl text-gray-500"></i>
          <i className="fas fa-users text-2xl text-gray-500"></i>
          <i className="fas fa-gamepad text-2xl text-gray-500"></i>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <i className="fas fa-plus"></i>
          </button>
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <i className="fab fa-facebook-messenger"></i>
          </button>
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <i className="fas fa-bell"></i>
          </button>
          <img src="assets/images/avatar-default.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;