import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import Post from '../../../components/postCard';
import FriendCard from '../../../components/friendCard';
import AddFriendCard from '../../../components/addFriendCard';
import photo1Image from "../../../assets/images/logo192.png"
import './style.scss';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  // Tạo ref để giữ vị trí random, không bị random lại mỗi lần render
  const suggestionIndexRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        author: "Nguyễn Văn A",
        time: "2 giờ trước",
        content: "Chào mọi người! Đây là bài đăng mẫu trên trang chủ của tôi. #socialnetwork",
        image: photo1Image,
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
        image: photo1Image,
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
        image: photo1Image,
        reactions: 89,
        comments: 31,
        shares: 2,
        liked: false,
      },
      {
        id: 4,
        author: "Trần Minh Dũng",
        time: "5 giờ trước",
        content: "Cuối tuần này mọi người có kế hoạch gì chưa? Mình muốn đi dã ngoại.",
        image: photo1Image,
        reactions: 120,
        comments: 15,
        shares: 3,
        liked: false,
      },
      {
        id: 5,
        author: "Lê Thị Hồng",
        time: "8 giờ trước",
        content: "Hôm nay trời đẹp quá, ai đi cà phê không?",
        image: photo1Image,
        reactions: 98,
        comments: 22,
        shares: 4,
        liked: true,
      },
      {
        id: 6,
        author: "Phạm Văn Nam",
        time: "12 giờ trước",
        content: "Chúc mọi người một ngày làm việc hiệu quả!",
        image: photo1Image,
        reactions: 76,
        comments: 10,
        shares: 1,
        liked: false,
      },
      {
        id: 7,
        author: "Ngô Thị Mai",
        time: "1 ngày trước",
        content: "Mình vừa hoàn thành xong khóa học lập trình web, cảm thấy rất vui!",
        image: photo1Image,
        reactions: 134,
        comments: 18,
        shares: 6,
        liked: true,
      },
      {
        id: 8,
        author: "Đỗ Quang Huy",
        time: "2 ngày trước",
        content: "Có ai biết quán ăn ngon ở Hà Nội không? Gợi ý giúp mình với!",
        image: photo1Image,
        reactions: 65,
        comments: 9,
        shares: 2,
        liked: false,
      },
      {
        id: 9,
        author: "Vũ Thị Lan",
        time: "3 ngày trước",
        content: "Hôm nay mình nhận được tin vui, cảm ơn mọi người đã ủng hộ!",
        image: photo1Image,
        reactions: 150,
        comments: 30,
        shares: 7,
        liked: true,
      },
      {
        id: 10,
        author: "Nguyễn Văn Hùng",
        time: "4 ngày trước",
        content: "Ai có kinh nghiệm học tiếng Anh giao tiếp chia sẻ với mình nhé.",
        image: photo1Image,
        reactions: 80,
        comments: 12,
        shares: 2,
        liked: false,
      },
    ];
    setPosts(mockPosts);

    // Random vị trí chèn suggestion (0-9)
    if (suggestionIndexRef.current === null) {
      suggestionIndexRef.current = Math.floor(Math.random() * mockPosts.length);
    }
  }, []);

  const friendSuggestions = useMemo(() => {
    return [
      { id: 'friend-1', fullName: 'Nguyễn Xuân Hải', username: 'xuanhai0913', avatar: 'v1652278394/user_avatars/friend_1.jpg' },
      { id: 'friend-2', fullName: 'Nguyễn Ngọc Trung', username: 'hoangthie', avatar: 'v1652278394/user_avatars/friend_2.jpg' },
      { id: 'friend-3', fullName: 'Nguyễn Văn Thắng', username: 'tranminhf', avatar: 'v1652278394/user_avatars/friend_3.jpg' },
      { id: 'friend-4', fullName: 'Trần Thị Mai', username: 'maitran', avatar: 'v1652278394/user_avatars/friend_4.jpg' },
      { id: 'friend-5', fullName: 'Lê Văn Hòa', username: 'hoale', avatar: 'v1652278394/user_avatars/friend_5.jpg' },
      { id: 'friend-6', fullName: 'Phạm Minh Tuấn', username: 'minhtuan', avatar: 'v1652278394/user_avatars/friend_6.jpg' },
      { id: 'friend-7', fullName: 'Ngô Thị Hạnh', username: 'hanhngo', avatar: 'v1652278394/user_avatars/friend_7.jpg' },
      { id: 'friend-8', fullName: 'Đỗ Quang Huy', username: 'quanghuydo', avatar: 'v1652278394/user_avatars/friend_8.jpg' },
      { id: 'friend-9', fullName: 'Vũ Thị Lan', username: 'lanvu', avatar: 'v1652278394/user_avatars/friend_9.jpg' },
      { id: 'friend-10', fullName: 'Nguyễn Văn Hùng', username: 'hungnguyen', avatar: 'v1652278394/user_avatars/friend_10.jpg' },
    ].sort(() => Math.random() - 0.5); // shuffle
  }, []);

  const renderPostsWithSuggestions = () => {
    if (!posts.length) return null;

    const suggestionIndex = suggestionIndexRef.current;
    return posts.map((post, index) => {
      if (index === suggestionIndex) {
        return (
          <React.Fragment key={`suggestion-${index}`}>
            <Post post={post} />
            <div className="friend-suggestions-horizontal">
              <div className="friend-suggestions-header">
                <span>Gợi ý kết bạn</span>
                <span className="friend-suggestions-desc">Kết nối với những người bạn có thể biết</span>
              </div>
              <div className="friend-suggestions-list" ref={listRef}>
                {friendSuggestions.map((user, idx) => (
                  <AddFriendCard key={user.id} user={user} type="compact" />
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
