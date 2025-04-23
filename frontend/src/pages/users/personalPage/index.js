import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import { useState, useEffect, useRef } from "react";
import "./style.scss";

const PersonalPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Nguyễn Văn A",
      time: "2 giờ trước",
      content: "Chào mọi người! Đây là bài đăng mẫu trên trang cá nhân của tôi. #facebook #profile",
      image: "https://via.placeholder.com/600x400",
      reactions: 243,
      comments: 42,
      shares: 12,
      liked: false,
    },
  ]);
  const tabsRef = useRef(null);

  // Handle tab navigation
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle like button
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

  // Handle profile edit actions
  const handleEditAction = (action) => {
    alert(`Tính năng ${action} đang được phát triển!`);
  };

  // Sticky tabs on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        if (window.scrollY > tabsRef.current.offsetTop - headerHeight) {
          tabsRef.current.classList.add("tabs--sticky");
          tabsRef.current.style.top = `${headerHeight}px`;
        } else {
          tabsRef.current.classList.remove("tabs--sticky");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lazy load images
  useEffect(() => {
    const images = document.querySelectorAll("img[data-src]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => observer.observe(img));
  }, []);

  return (
    <div className="personal-page">
      {/* Header */}
      <header className="header">
        <div className="header__left">
          <i className="fab fa-facebook"></i>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Tìm kiếm trên ..." />
          </div>
        </div>
        <div className="header__center">
          {["home", "play", "store", "users", "gamepad"].map((icon, index) => (
            <Link
              key={index}
              to={ROUTERS.HOME}
              className={`nav-icon ${icon === "home" ? "nav-icon--active" : ""}`}
            >
              <i className={`fas fa-${icon}`}></i>
            </Link>
          ))}
        </div>
        <div className="header__right">
          {["plus", "facebook-messenger", "bell"].map((icon, index) => (
            <div key={index} className="icon-btn">
              <i className={`fas fa-${icon}`}></i>
            </div>
          ))}
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="profile__avatar--small"
            onClick={() => navigate(ROUTERS.PROFILE)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Profile Section */}
        <section className="profile">
          <div className="profile__cover-container">
            <img
              data-src="https://via.placeholder.com/1200x400"
              alt="Cover"
              className="profile__cover"
            />
            <button
              className="profile__edit-cover-btn"
              onClick={() => handleEditAction("thay đổi ảnh bìa")}
            >
              <i className="fas fa-camera"></i>
              Chỉnh sửa ảnh bìa
            </button>
          </div>
          <div className="profile__main">
            <div className="profile__avatar-container">
              <div className="profile__avatar-wrapper">
                <img
                  data-src="https://via.placeholder.com/150"
                  alt="Avatar"
                  className="profile__avatar"
                />
                <div
                  className="profile__edit-avatar-overlay"
                  onClick={() => handleEditAction("thay đổi ảnh đại diện")}
                >
                  <i className="fas fa-camera"></i>
                </div>
              </div>
            </div>
            <div className="profile__info">
              <div className="profile__name-container">
                <h1 className="profile__name">Nguyễn Văn A</h1>
                <div className="profile__verified-badge">
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
              <p className="profile__bio">Xin chào! Đây là tiểu sử của tôi.</p>
              <div className="profile__friends-info">
                <i className="fas fa-user-friends"></i>
                <span>1.5K bạn bè</span>
                <div className="profile__friends-avatars">
                  {Array(6)
                    .fill()
                    .map((_, index) => (
                      <img
                        key={index}
                        data-src="https://via.placeholder.com/30"
                        alt="Friend"
                      />
                    ))}
                </div>
              </div>
            </div>
            <div className="profile__actions">
              <button className="btn btn--primary">
                <i className="fas fa-plus"></i>
                Thêm vào story
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => handleEditAction("chỉnh sửa trang cá nhân")}
              >
                <i className="fas fa-pen"></i>
                Chỉnh sửa trang cá nhân
              </button>
              <button className="btn btn--icon-only">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>

          {/* Profile Navigation Tabs */}
          <div className="tabs" ref={tabsRef}>
            <nav className="tabs__nav">
              <ul>
                {[
                  { id: "posts", label: "Bài viết" },
                  { id: "about", label: "Giới thiệu" },
                  { id: "friends", label: "Bạn bè" },
                  { id: "photos", label: "Ảnh" },
                  { id: "videos", label: "Video" },
                  { id: "reels", label: "Reels" },
                ].map((tab) => (
                  <li key={tab.id} className={`tabs__item ${activeTab === tab.id ? "tabs__item--active" : ""}`}>
                    <a href={`#${tab.id}`} onClick={() => handleTabClick(tab.id)}>
                      {tab.label}
                    </a>
                  </li>
                ))}
                <li className="tabs__item tabs__item--more">
                  <a href="#">
                    Xem thêm <i className="fas fa-caret-down"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        {/* Tab Contents */}
        <div className="tab-contents">
          {/* Posts Tab */}
          {activeTab === "posts" && (
            <section id="posts" className="tab-content tab-content--active">
              <div className="content-grid">
                <div className="content__sidebar">
                  <div className="about-card">
                    <h3>Giới thiệu</h3>
                    <ul className="about-card__list">
                      <li>
                        <i className="fas fa-briefcase"></i>
                        Làm việc tại <strong>Công ty ABC</strong>
                      </li>
                      <li>
                        <i className="fas fa-graduation-cap"></i>
                        Học tại <strong>Đại học XYZ</strong>
                      </li>
                      <li>
                        <i className="fas fa-home"></i>
                        Sống tại <strong>Hà Nội</strong>
                      </li>
                      <li>
                        <i className="fas fa-map-marker-alt"></i>
                        Đến từ <strong>Thành phố Hồ Chí Minh</strong>
                      </li>
                      <li>
                        <i className="fas fa-heart"></i>
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
                      <Link to="#photos" className="photos-card__see-all">
                        Xem tất cả ảnh
                      </Link>
                    </div>
                    <div className="photos-card__grid">
                      {Array(9)
                        .fill()
                        .map((_, index) => (
                          <img
                            key={index}
                            data-src="https://via.placeholder.com/100"
                            alt="Photo"
                          />
                        ))}
                    </div>
                  </div>
                  <div className="friends-card">
                    <div className="friends-card__header">
                      <h3>Bạn bè</h3>
                      <Link to="#friends" className="friends-card__see-all">
                        Xem tất cả bạn bè
                      </Link>
                    </div>
                    <p className="friends-card__count">1.5K bạn bè</p>
                    <div className="friends-card__grid">
                      {[
                        "Nguyễn Văn B",
                        "Trần Thị C",
                        "Lê Văn D",
                        "Phạm Thị E",
                        "Hoàng Văn F",
                        "Vũ Thị G",
                      ].map((name, index) => (
                        <div key={index} className="friends-card__item">
                          <img
                            data-src="https://via.placeholder.com/50"
                            alt="Friend"
                          />
                          <p>{name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="content__main">
                  <div className="create-post">
                    <div className="create-post__header">
                      <img
                        data-src="https://via.placeholder.com/40"
                        alt="Avatar"
                        className="create-post__avatar"
                      />
                      <div
                        className="create-post__input"
                        onClick={() => handleEditAction("đăng bài")}
                      >
                        <span>Bạn đang nghĩ gì?</span>
                      </div>
                    </div>
                    <div className="create-post__actions">
                      {[
                        { icon: "video", label: "Video trực tiếp" },
                        { icon: "images", label: "Ảnh/Video" },
                        { icon: "smile", label: "Cảm xúc/Hoạt động" },
                      ].map((action, index) => (
                        <button key={index} className="create-post__action">
                          <i className={`fas fa-${action.icon}`}></i>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="posts">
                    {posts.map((post) => (
                      <div key={post.id} className="post">
                        <div className="post__header">
                          <div className="post__author">
                            <img
                              data-src="https://via.placeholder.com/40"
                              alt="Author"
                              className="post__avatar"
                            />
                            <div className="post__info">
                              <h4 className="post__author-name">{post.author}</h4>
                              <div className="post__meta">
                                <span className="post__time">{post.time}</span>
                                <span className="post__privacy">
                                  <i className="fas fa-globe-asia"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="post__actions">
                            <button className="post__action">
                              <i className="fas fa-ellipsis-h"></i>
                            </button>
                          </div>
                        </div>
                        <div className="post__content">
                          <p>{post.content}</p>
                          {post.image && (
                            <div className="post__image">
                              <img data-src={post.image} alt="Post image" />
                            </div>
                          )}
                        </div>
                        <div className="post__stats">
                          <div className="post__reactions">
                            <div className="post__reaction-icons">
                              <i className="fas fa-thumbs-up"></i>
                              <i className="fas fa-heart"></i>
                            </div>
                            <span>{post.reactions}</span>
                          </div>
                          <div className="post__comments-shares">
                            <span>{post.comments} bình luận</span>
                            <span>{post.shares} lượt chia sẻ</span>
                          </div>
                        </div>
                        <div className="post__buttons">
                          <button
                            className={`post__button ${post.liked ? "post__button--active" : ""}`}
                            onClick={() => handleLike(post.id)}
                          >
                            <i className="far fa-thumbs-up"></i>
                            Thích
                          </button>
                          <button className="post__button">
                            <i className="far fa-comment"></i>
                            Bình luận
                          </button>
                          <button className="post__button">
                            <i className="far fa-share-square"></i>
                            Chia sẻ
                          </button>
                        </div>
                        <div className="post__comments">
                          <div className="comment">
                            <img
                              data-src="https://via.placeholder.com/40"
                              alt="Avatar"
                              className="comment__avatar"
                            />
                            <div className="comment__box">
                              <input type="text" placeholder="Viết bình luận..." />
                              <div className="comment__actions">
                                <i className="far fa-smile"></i>
                                <i className="fas fa-camera"></i>
                                <i className="fas fa-paperclip"></i>
                                <i className="far fa-sticky-note"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <section id="about" className="tab-content tab-content--active">
              <div className="about">
                <div className="about__sidebar">
                  <ul className="about__nav">
                    {[
                      { id: "about-overview", label: "Tổng quan" },
                      { id: "about-work", label: "Công việc và học vấn" },
                      { id: "about-places", label: "Nơi sống" },
                      { id: "about-contact", label: "Thông tin liên hệ" },
                      { id: "about-family", label: "Gia đình và mối quan hệ" },
                      { id: "about-details", label: "Chi tiết về bạn" },
                      { id: "about-events", label: "Sự kiện trong đời" },
                    ].map((item) => (
                      <li key={item.id} className="about__nav-item about__nav-item--active">
                        <a href={`#${item.id}`}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="about__content">
                  <div id="about-overview" className="about__section about__section--active">
                    <div className="about__card">
                      <h3>Công việc</h3>
                      <div className="about__item">
                        <i className="fas fa-briefcase"></i>
                        <div className="about__text">
                          <p>
                            Làm việc tại <strong>Công ty ABC</strong>
                          </p>
                          <span className="about__item-meta">
                            Từ tháng 1 năm 2020 đến hiện tại
                          </span>
                        </div>
                        <button
                          className="about__edit-btn"
                          onClick={() => handleEditAction("chỉnh sửa công việc")}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                      </div>
                      <button className="btn btn--secondary btn--full-width">
                        <i className="fas fa-plus"></i>
                        Thêm nơi làm việc
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__content">
          <div className="footer__links">
            {["Quyền riêng tư", "Điều khoản", "Quảng cáo", "Cookie", "Lựa chọn quảng cáo", "Thêm"].map(
              (link, index) => (
                <Link key={index} to="#">
                  {link}
                </Link>
              )
            )}
          </div>
          <div className="footer__copyright">Meta © 2023</div>
        </div>
      </footer>
    </div>
  );
};

export default PersonalPage;