import React from 'react';
import Header from '../../../components/Header';
import DarkModeToggle from '../../../components/DarkModeToggle';
import './style.scss';

const WatchPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header />
      <DarkModeToggle />
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Video</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          Chưa có video để hiển thị.
        </div>
      </main>
    </div>
  );
};

export default WatchPage;