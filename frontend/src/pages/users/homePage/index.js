import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FaUsers, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import Post from '../../../components/postCard';
import AddFriendCard, { AddFriendSuggestion } from '../../../components/addFriendCard';
import './style.scss';

const HomePage = () => {
  return (
    //làm các thẻ div chứa các compoent
    //1 thẻ div chứa compoent createpost
    //2 thẻ div chuas list compoent post (ở trong list post chứa list addFriendCard random trong 10 bài viết đầu tiên sẽ xuất hiệnhiện)
    <div className="container">
      <div className='home-page'>
        
      </div>
    </div>
  );
};

export default HomePage;