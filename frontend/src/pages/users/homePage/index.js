import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FaUsers, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import Post from '../../../components/postCard';
import AddFriendCard, { AddFriendSuggestion } from '../../../components/addFriendCard';
import { renderReelsSection } from './modals/reels';
import './style.scss';

const HomePage = () => {
  // Mock data for posts - replace with actual data from your API
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts here
    // setPosts(data);
    setLoading(false);
  }, []);

  // Function to randomly insert AddFriendCard
  const renderPostsWithSuggestions = () => {
    if (!posts.length) return null;

    return posts.map((post, index) => {
      // Insert AddFriendCard randomly in first 10 posts
      if (index < 10 && Math.random() < 0.3) { // 30% chance to show suggestion
        return (
          <React.Fragment key={`suggestion-${index}`}>
            <Post post={post} />
            <AddFriendCard />
          </React.Fragment>
        );
      }
      return <Post key={post.id} post={post} />;
    });
  };

  return (
    <div className="home-page">
      {/* Create Post Section */}
      <div className="create-post-section">
        <CreatePost />
      </div>
      {/* Posts Feed Section */}
      <div className="posts-feed">
        {loading ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner" />
            <span>Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <FaExclamationTriangle />
            <span>No posts to show</span>
          </div>
        ) : (
          renderPostsWithSuggestions()
        )}
      </div>

    </div>
  );
};

export default HomePage;
