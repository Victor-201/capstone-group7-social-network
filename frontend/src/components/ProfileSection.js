import React from 'react';

const ProfileSection = ({ userData }) => {
  const handleEdit = (type) => {
    alert(`Tính năng thay đổi ${type} đang được phát triển!`);
  };

  return (
    <section className="mt-6">
      <div className="relative">
        <img src={userData.coverPhoto} alt="Cover" className="w-full h-64 object-cover rounded-t-lg" />
        <button
          onClick={() => handleEdit('ảnh bìa')}
          className="absolute bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded flex items-center"
        >
          <i className="fas fa-camera mr-2"></i>
          Chỉnh sửa ảnh bìa
        </button>
      </div>
      <div className="flex flex-col items-center md:flex-row md:items-end px-4 -mt-16">
        <div className="relative">
          <img src={userData.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white" />
          <div
            onClick={() => handleEdit('ảnh đại diện')}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer"
          >
            <i className="fas fa-camera text-white"></i>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            {userData.verified && <i className="fas fa-check-circle text-blue-600 ml-2"></i>}
          </div>
          <p className="text-gray-600 dark:text-gray-300">{userData.bio}</p>
          <div className="flex items-center justify-center md:justify-start mt-2">
            <i className="fas fa-user-friends mr-2"></i>
            <span>{userData.friendsCount} bạn bè</span>
            <div className="flex -space-x-2 ml-2">
              {userData.friends.map((friend, index) => (
                <img key={index} src={friend.avatar} alt="Friend" className="w-6 h-6 rounded-full border-2 border-white" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <i className="fas fa-plus mr-2"></i>
            Thêm vào story
          </button>
          <button
            onClick={() => handleEdit('trang cá nhân')}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded flex items-center"
          >
            <i className="fas fa-pen mr-2"></i>
            Chỉnh sửa trang cá nhân
          </button>
          <button className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;