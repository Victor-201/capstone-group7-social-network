import React, { useEffect } from 'react';
import Post from './Post';

const Tabs = ({ activeTab, setActiveTab, userData }) => {
  useEffect(() => {
    const handleScroll = () => {
      const tabs = document.querySelector('.tabs-nav');
      const header = document.querySelector('header');
      const headerHeight = header.offsetHeight;
      if (window.scrollY > tabs.offsetTop - headerHeight) {
        tabs.classList.add('sticky', 'top-[headerHeight]', 'bg-white', 'dark:bg-gray-800', 'shadow-md');
        tabs.style.top = `${headerHeight}px`;
      } else {
        tabs.classList.remove('sticky', 'top-[headerHeight]', 'bg-white', 'dark:bg-gray-800', 'shadow-md');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'posts', label: 'Bài viết' },
    { id: 'about', label: 'Giới thiệu' },
    { id: 'friends', label: 'Bạn bè' },
    { id: 'photos', label: 'Ảnh' },
    { id: 'videos', label: 'Video' },
    { id: 'reels', label: 'Reels' },
  ];

  return (
    <div className="mt-6">
      <nav className="tabs-nav flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="mt-6">
        {activeTab === 'posts' && userData.posts.map(post => <Post key={post.id} post={post} />)}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Giới thiệu</h3>
            <ul className="mt-3 space-y-2">
              {userData.about.map((item, index) => (
                <li key={index} className="flex items-center" dangerouslySetInnerHTML={{ __html: item.text }} />
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'friends' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Bạn bè</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {userData.friends.map(friend => (
                <div key={friend.id}>
                  <img src={friend.avatar} alt="Friend" className="w-full h-32 object-cover rounded" />
                  <p className="mt-2">{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'photos' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Ảnh</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {userData.photos.map((photo, index) => (
                <img key={index} src={photo} alt="Photo" className="w-full h-32 object-cover rounded" />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'videos' && <div>Chưa có video</div>}
        {activeTab === 'reels' && <div>Chưa có reels</div>}
      </div>
    </div>
  );
};

export default Tabs;