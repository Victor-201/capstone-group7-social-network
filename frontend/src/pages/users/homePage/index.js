import React from 'react';
import Header from '../../../components/Header';
import CreatePost from '../../../components/CreatePost';
import Post from '../../../components/Post';
import DarkModeToggle from '../../../components/DarkModeToggle';
import mockData from '../../../mockData';
import './style.scss';

const HomePage = () => {
  const posts = mockData.homePosts;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header />
      <DarkModeToggle />
      <main className="container mx-auto px-4 py-6">
        <CreatePost />
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
};

export default HomePage;