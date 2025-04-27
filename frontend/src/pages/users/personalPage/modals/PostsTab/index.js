import { useState } from "react";
import CreatePost from "../../../../../components/createPost"; 
import PostCard from "../../../../../components/postCard";
import photo1Image from "../../../../../assets/images/logo192.png";
import photo2Image from "../../../../../assets/images/logo192.png";
import friend1Image from "../../../../../assets/images/logo192.png";
import { FaBriefcase, FaHome as FaHomeAddress, FaHeart } from "react-icons/fa";  
import { IoIosSchool, IoIosLocate } from "react-icons/io"; 

import "./style.scss";

const PostsTab = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Nguyễn Văn A",
      time: "2 giờ trước",
      content: "Chào mọi người! Đây là bài đăng mẫu trên trang cá nhân của tôi. #facebook #profile",
      image: photo1Image,
      reactions: 243,
      comments: 42,
      shares: 12,
      liked: false,
    },
    {
      id: 2,
      author: "Nguyễn Văn A",
      time: "1 ngày trước",
      content: "Hôm nay là một ngày tuyệt vời! Đã hoàn thành xong dự án lớn.",
      image: photo2Image,
      reactions: 156,
      comments: 28,
      shares: 5,
      liked: true,
    },
    {
      id: 3,
      author: "Nguyễn Văn A",
      time: "3 ngày trước",
      content: "Vừa đọc xong một cuốn sách hay. Ai có thể giới thiệu thêm sách về chủ đề này không?",
      image: photo1Image,
      reactions: 89,
      comments: 31,
      shares: 2,
      liked: false,
    },
  ]);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              reactions: post.liked ? post.reactions - 1 : post.reactions + 1,
            }
          : post
      )
    );
  };

  const handleEditAction = (action) => {
    alert(`Tính năng ${action} đang được phát triển!`);
  };

  const friendImages = [friend1Image];
  const photoImages = [photo1Image, photo2Image];

  return (
    <section id="posts" className="tab-content tab-content--active">
      <div className="content-grid">
        <div className="content__sidebar">
          <div className="about-card">
            <h3>Giới thiệu</h3>
            <ul className="about-card__list">
              <li>
                <FaBriefcase className="about-icon" />
                Làm việc tại <strong>Công ty ABC</strong>
              </li>
              <li>
                <IoIosSchool className="about-icon" />
                Học tại <strong>Đại học XYZ</strong>
              </li>
              <li>
                <FaHomeAddress className="about-icon" />
                Sống tại <strong>Hà Nội</strong>
              </li>
              <li>
                <IoIosLocate className="about-icon" />
                Đến từ <strong>Thành phố Hồ Chí Minh</strong>
              </li>
              <li>
                <FaHeart className="about-icon" />
                <strong>Độc thân</strong>
              </li>
            </ul>
            <button
              className="btn btn--secondary btn--full-width"
              onClick={() => handleEditAction("chỉnh sửa chi tiết")}
            >
              Chỉnh sửa chi tiết
            </button>
          </div>
          <div className="photos-card">
            <div className="photos-card__header">
              <h3>Ảnh</h3>
              <a href="#photos" className="photos-card__see-all">
                Xem tất cả ảnh
              </a>
            </div>
            <div className="photos-card__grid">
              {photoImages.map((photoImage, index) => (
                <img key={index} src={photoImage} alt={`Photo ${index + 1}`} />
              ))}
            </div>
          </div>
          <div className="friends-card">
            <div className="friends-card__header">
              <h3>Bạn bè</h3>
              <a href="#friends" className="friends-card__see-all">
                Xem tất cả bạn bè
              </a>
            </div>
            <p className="friends-card__count">1.5K bạn bè</p>
            <div className="friends-card__grid">
              {[{ name: "Nguyễn Văn B", image: friend1Image }].map((friend, index) => (
                <div key={index} className="friends-card__item">
                  <img src={friend.image} alt="Friend" />
                  <p>{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content__main">
          <CreatePost />
          <div className="posts">
            {posts.length === 0 ? (
              <p>Chưa có bài đăng nào</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} handleLike={handleLike} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostsTab;
