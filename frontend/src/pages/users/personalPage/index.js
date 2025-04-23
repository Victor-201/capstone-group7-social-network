import React, { useState } from 'react';
import Header from '../../../components/Header';
import ProfileSection from '../../../components/ProfileSection';
import Sidebar from '../../../components/Sidebar';
import CreatePost from '../../../components/CreatePost';
import Tabs from '../../../components/Tabs';
import DarkModeToggle from '../../../components/DarkModeToggle';
import mockData from '../../../mockData';
import './style.scss';

const PersonalPage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const userData = mockData.profile;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header />
      <DarkModeToggle />
      <main className="container mx-auto px-4">
        <ProfileSection userData={userData} />
        <div className="mt-6 flex flex-col md:flex-row">
          <div className="md:w-1/3 md:pr-4">
            <Sidebar userData={userData} />
          </div>
          <div className="md:w-2/3 mt-4 md:mt-0">
            <CreatePost />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} userData={userData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalPage;