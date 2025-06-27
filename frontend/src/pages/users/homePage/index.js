import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import CreatePost from '../../../components/createPost';
import Post from '../../../components/postCard';
import FriendCard from '../../../components/friendCard';
import AddFriendCard from '../../../components/addFriendCard';
import { useFriendSuggestions } from '../../../hooks/friends/useFriendSuggestions';
import { useBatchMutualFriends, useBatchMutualFriendsDetailed } from '../../../hooks/friends/useMutualFriends';
import photo1Image from "../../../assets/images/logo192.png"
import './style.scss';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  
  // Hook để lấy friend suggestions từ database
  const { 
    suggestions: realFriendSuggestions, 
    loading: suggestionsLoading, 
    error: suggestionsError 
  } = useFriendSuggestions();
  
  // Prepare friend IDs for mutual friends
  const friendSuggestionIds = useMemo(() => {
    return realFriendSuggestions?.map(user => user.id).filter(Boolean) || [];
  }, [realFriendSuggestions]);

  // Fetch mutual friends counts và detailed data
  const {
    mutualCounts,
    loading: mutualLoading,
    error: mutualError
  } = useBatchMutualFriends(friendSuggestionIds);

  const {
    mutualFriendsData,
    loading: mutualDetailedLoading,
    error: mutualDetailedError
  } = useBatchMutualFriendsDetailed(friendSuggestionIds);
  
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

  // Xử lý friend suggestions từ database
  const friendSuggestions = useMemo(() => {
    if (suggestionsLoading || !realFriendSuggestions) {
      return [];
    }
    // Shuffle và giới hạn số lượng hiển thị
    return [...realFriendSuggestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // Hiển thị tối đa 10 suggestions
  }, [realFriendSuggestions, suggestionsLoading]);

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
                {suggestionsLoading ? (
                  <div className="suggestions-loading">
                    <span>Đang tải gợi ý kết bạn...</span>
                  </div>
                ) : suggestionsError ? (
                  <div className="suggestions-error">
                    <span>Không thể tải gợi ý kết bạn</span>
                  </div>
                ) : friendSuggestions.length > 0 ? (
                  friendSuggestions.map((user, idx) => (
                    <AddFriendCard 
                      key={user.id} 
                      user={user} 
                      type="compact"
                      mutualFriendsCount={mutualCounts[user.id] || 0}
                      mutualFriendsData={mutualFriendsData[user.id]?.mutualFriends || []}
                    />
                  ))
                ) : (
                  <div className="no-suggestions">
                    <span>Chưa có gợi ý kết bạn</span>
                  </div>
                )}
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
