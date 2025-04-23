import React from 'react';

const CreatePost = () => {
  const handleCreatePost = () => {
    alert('Tính năng đăng bài đang được phát triển!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="flex items-center space-x-4">
        <img src="assets/images/avatar-default.jpg" alt="Avatar" className="w-10 h-10 rounded-full" />
        <div
          onClick={handleCreatePost}
          className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-full cursor-pointer"
        >
          Bạn đang nghĩ gì?
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <i className="fas fa-video"></i>
          <span>Video trực tiếp</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <i className="fas fa-images"></i>
          <span>Ảnh/Video</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <i className="far fa-smile"></i>
          <span>Cảm xúc/Hoạt động</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;