import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import Post from '../../../components/postCard';
import FriendCard from '../../../components/friendCard';
import './style.scss';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        author: "Nguyễn Văn A",
        time: "2 giờ trước",
        content: "Chào mọi người! Đây là bài đăng mẫu trên trang chủ của tôi. #socialnetwork",
        image: "https://via.placeholder.com/150",
        reactions: 243,
        comments: 42,
        shares: 12,
        liked: false,
      },
      {
        id: 2,
        author: "Nguyễn Văn B",
        time: "1 ngày trước",
        content: "Hôm nay là một ngày tuyệt vời! Đã hoàn thành xong dự án lớn.",
        image: "https://via.placeholder.com/150",
        reactions: 156,
        comments: 28,
        shares: 5,
        liked: true,
      },
      {
        id: 3,
        author: "Nguyễn Văn C",
        time: "3 ngày trước",
        content: "Vừa đọc xong một cuốn sách hay. Ai có thể giới thiệu thêm sách về chủ đề này không?",
        image: null,
        reactions: 89,
        comments: 31,
        shares: 2,
        liked: false,
      },
    ];
    setPosts(mockPosts);
  }, []);

  const friendSuggestions = [
    {
      id: 'friend-1',
      fullName: 'Nguyễn Xuân Hải',
      username: 'xuanhai0913',
      avatar: 'v1652278394/user_avatars/friend_1.jpg',
    },
    {
      id: 'friend-2',
      fullName: 'Nguyễn Ngọc Trung',
      username: 'hoangthie',
      avatar: 'v1652278394/user_avatars/friend_2.jpg',
    },
    {
      id: 'friend-3',
      fullName: 'Nguyễn Văn Thắng',
      username: 'tranminhf',
      avatar: 'v1652278394/user_avatars/friend_3.jpg',
    }
  ];

  const renderPostsWithSuggestions = () => {
    if (!posts.length) return null;

    let suggestionInserted = false;
    return posts.map((post, index) => {
      if (!suggestionInserted && index >= 2 && index < 10) {
        suggestionInserted = true;
        return (
          <React.Fragment key={`suggestion-${index}`}>
            <Post post={post} />
            <div className="friend-suggestions-horizontal">
              <div className="friend-suggestions-header">
                <span>Gợi ý kết bạn</span>
                <span className="friend-suggestions-desc">Kết nối với những người bạn có thể biết</span>
              </div>
              <div className="friend-suggestions-list">
                {friendSuggestions.map(user => (
                  <FriendCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          </React.Fragment>
        );
      }
      return <Post key={post.id} post={post} />;
    });
  };

  return (
    <div className="container">
      <article className="home-page">
        {/* Create Post Section */}
        <div className="create-post-section">
          <CreatePost />
        </div>
        {/* Newsfeed Section */}
        <div className="newsfeed">
          {posts.length === 0 ? (
            <div className="no-posts">
              <FaExclamationTriangle />
              <span>No posts to show</span>
            </div>
          ) : (
            renderPostsWithSuggestions()
          )}
        </div>
      </article>
    </div>
  );
};

export default HomePage;
