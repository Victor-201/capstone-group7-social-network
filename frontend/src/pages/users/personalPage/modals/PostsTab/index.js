import { useState } from "react";
import CreatePost from "../../../../../components/createPost";
import PostCard from "../../../../../components/postCard";
import photo1Image from "../../../../../assets/images/logo192.png";
import photo2Image from "../../../../../assets/images/logo192.png";
import friend1Image from "../../../../../assets/images/logo192.png";
import { FaBriefcase, FaHome as FaHomeAddress, FaHeart } from "react-icons/fa";
import { IoIosSchool, IoIosLocate } from "react-icons/io";
import { FiX, FiPlus, FiEdit2 } from "react-icons/fi";
import "./style.scss";
import { useUserPosts } from "../../../../../hooks/posts/useUserPosts";



const PostsTab = ({ userInfo }) => {
  const { posts, setPosts, error } = useUserPosts(
  );
  const totalPosts = posts ? posts.length : 0;
  console.log("anh mình cứ thế thôi hẹ hẹ: ", userInfo?.ProfileDetails.visibleFields[0] .profile_detail_id, userInfo?.ProfileDetails.visibleFields.is_visible);
  const [bio, setBio] = useState(userInfo?.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleLike = (postId) => {

  };


  const handleEditAction = (action) => {
    if (action === "chỉnh sửa chi tiết") {
      setIsEditModalOpen(true);
    } else {
      alert(`Tính năng ${action} đang được phát triển!`);
    }
  };

  const handleSaveDetails = () => {
    setIsEditModalOpen(false);
    alert("Tính năng chỉnh sửa trang cá nhân đang được phát triển!");
  };

  const friendImages = [friend1Image];
  const photoImages = [photo1Image, photo2Image];

  return (
    <section id="posts" className="tab-content tab-content--active">
      <div className="content-grid">
        <div className="content__sidebar">
          <div className="about-card">
            <h3>Giới thiệu</h3>
            <div className="about-card__bio-wrapper">
              {isEditingBio ? (
                <textarea
                  className="about-card__bio-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  onBlur={() => setIsEditingBio(false)}
                  autoFocus
                />
              ) : (
                <p className="about-card__bio">
                  {bio || "Chưa có tiểu sử"}
                  <button
                    className="about-card__edit-btn"
                    onClick={() => setIsEditingBio(true)}
                  >
                    <FiEdit2 />
                  </button>
                </p>
              )}
            </div>

            <ul className="about-card__list">
              { userInfo?.ProfileDetails.visibleFields.field_name=== "job" && userInfo?.ProfileDetails.visibleFields.is_visible===true && (
              <li>
                <FaBriefcase className="about-icon" />
                Làm việc tại<strong>{userInfo.ProfileDetails.job}</strong>
              </li>
              )}
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
          <CreatePost userInfo={userInfo} />

          <div className="posts">
            { totalPosts === 0 ? (
              <p>Chưa có bài đăng nào</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} handleLike={handleLike} userInfo={userInfo} />
              ))
            )} 
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="edit-details-modal">
          <div className="edit-details-modal__section">
            <div className="edit-details-modal__category">
              <span>Tiểu sử</span>
            </div>
            <textarea
              className="edit-details-modal__bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Nhập tiểu sử của bạn tại đây..."
            />
          </div>

          <div className="edit-details-modal__content">
            <div className="edit-details-modal__header">
              <h2>Chỉnh sửa chi tiết</h2>
              <button
                className="edit-details-modal__close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="edit-details-modal__body">
              <div className="edit-details-modal__section">
                <div className="edit-details-modal__category">
                  <span>Công việc</span>
                  <div className="edit-details-modal__category-actions">
                    <button className="edit-details-modal__add-btn">
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div className="edit-details-modal__item">
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                  <span>Làm việc tại Trường THPT Hàm Nghi</span>
                  <button className="edit-details-modal__edit-btn">
                    <FiEdit2 />
                  </button>
                </div>
              </div>
              <div className="edit-details-modal__section">
                <div className="edit-details-modal__category">
                  <span>Học vấn</span>
                  <div className="edit-details-modal__category-actions">
                    <button className="edit-details-modal__add-btn">
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div className="edit-details-modal__item">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                  <span>Làm việc tại Trường THPT Hàm Nghi</span>
                  <button className="edit-details-modal__edit-btn">
                    <FiEdit2 />
                  </button>
                </div>
              </div>
              <div className="edit-details-modal__section">
                <div className="edit-details-modal__category">
                  <span>Hiện tại</span>
                  <div className="edit-details-modal__category-actions">
                    <button className="edit-details-modal__add-btn">
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div className="edit-details-modal__item">
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                  <span>Đang ở tại Trường THPT Hàm Nghi</span>
                  <button className="edit-details-modal__edit-btn">
                    <FiEdit2 />
                  </button>
                </div>
                <div className="edit-details-modal__item">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                  <span>Thêm trường học</span>
                  <button className="edit-details-modal__edit-btn">
                    <FiEdit2 />
                  </button>
                </div>
              </div>
              <div className="edit-details-modal__section">
                <div className="edit-details-modal__category">
                  <span>Thông tin bổ sung</span>
                  <div className="edit-details-modal__category-actions">
                    <button className="edit-details-modal__add-btn">
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div className="edit-details-modal__item">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                  <span>Đang làm việc tại Hà Nội</span>
                  <button className="edit-details-modal__edit-btn">
                    <FiEdit2 />
                  </button>
                </div>
              </div>
            </div>
            <div className="edit-details-modal__footer">
              <button
                className="btn btn--secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Hủy
              </button>
              <button className="btn btn--primary" onClick={handleSaveDetails}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostsTab;