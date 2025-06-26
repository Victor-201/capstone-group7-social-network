import { useState, useEffect } from "react";
import CreatePost from "../../../../../components/createPost";
import PostCard from "../../../../../components/postCard";
import photo1Image from "../../../../../assets/images/logo192.png";
import photo2Image from "../../../../../assets/images/logo192.png";
import friend1Image from "../../../../../assets/images/logo192.png";
import { FaBriefcase, FaHome as FaHomeAddress, FaHeart } from "react-icons/fa";
import { IoIosSchool, IoIosLocate } from "react-icons/io";
import { FiX, FiEdit2 } from "react-icons/fi";
import "./style.scss";
import { useUserPosts } from "../../../../../hooks/posts/useUserPosts";
import { useEditDetails } from "../../../../../hooks/profile/useEditDetails";
import { getUserInfo } from "../../../../../api/userApi";
import { useUserImages } from "../../../../../hooks/media/useUserImages";
import MediaCard from "../../../../../components/mediaCard";

const relationshipOptions = [
  { label: "Độc thân", value: "single" },
  { label: "Đang hẹn hò", value: "in_a_relationship" },
  { label: "Đã đính hôn", value: "engaged" },
  { label: "Đã kết hôn", value: "married" },
];

const PostsTab = ({ userInfo, isOwner }) => {
  const { posts } = useUserPosts();
  const totalPosts = posts?.length || 0;
  const { images, loading: loadingImages } = useUserImages(userInfo?.id);



  const getVisible = (field, data) =>
    data?.ProfileDetails?.visibleFields?.find((f) => f.field_name === field)?.is_visible ?? true;

  const [bio, setBio] = useState(userInfo?.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});

  const [provinceList, setProvinceList] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

  const { saveProfileDetails, loading, error } = useEditDetails();

  const loadProfileDetails = async () => {
    const token = localStorage.getItem("token");
    const data = await getUserInfo(token);

    setBio(data?.bio || "");
    setProfileDetails({
      job: { value: data?.ProfileDetails?.job || "", is_visible: getVisible("job", data) },
      education: { value: data?.ProfileDetails?.education || "", is_visible: getVisible("education", data) },
      location: { value: data?.ProfileDetails?.location || "", is_visible: getVisible("location", data) },
      hometown: { value: data?.ProfileDetails?.hometown || "", is_visible: getVisible("hometown", data) },
      relationship_status: {
        value: data?.ProfileDetails?.relationship_status || "single",
        is_visible: getVisible("relationship_status", data),
      },
    });
  };

  useEffect(() => {
    loadProfileDetails();
  }, []);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinceList(data));
  }, []);

  const handleEditModalOpen = async () => {
    await loadProfileDetails();
    setIsEditModalOpen(true);
  };

  const handleChangeDetail = (field, key, value) => {
    setProfileDetails((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value,
      },
    }));
  };

  const handleProvinceInput = (field, input) => {
    handleChangeDetail(field, "value", input);
    const filtered = provinceList.filter((province) =>
      province.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredProvinces(filtered);
    setFocusedField(field);
  };

  const handleSelectProvince = (field, name) => {
    handleChangeDetail(field, "value", name);
    setFilteredProvinces([]);
    setFocusedField(null);
  };

  const handleSaveDetails = async () => {
    const token = localStorage.getItem("token");
    const userId = userInfo?.id;

    const result = await saveProfileDetails(token, userId, profileDetails);
    if (result.success) {
      setIsEditModalOpen(false);
    } else {
      alert("Lỗi: " + result.message);
    }
  };

  const renderVisibleItem = (field, label, Icon) => {
    const isVisible = profileDetails[field]?.is_visible;
    const value = profileDetails[field]?.value;
    return isVisible && value ? (
      <li>
        <Icon className="about-icon" />
        {label} <strong>{value}</strong>
      </li>
    ) : null;
  };

  return (
    <section id="posts" className="tab-content tab-content--active">
      <div className="content-grid">
        <div className="content__sidebar">
          <div className="about-card">
            <h3>Giới thiệu</h3>
            <div className="about-card__bio-wrapper">
              {isEditingBio && isOwner ? (
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
                  {isOwner && (
                    <button className="about-card__edit-btn" onClick={() => setIsEditingBio(true)}>
                      <FiEdit2 />
                    </button>
                  )}
                </p>
              )}
            </div>
            <ul className="about-card__list">
              {renderVisibleItem("job", "Làm việc tại", FaBriefcase)}
              {renderVisibleItem("education", "Học tại", IoIosSchool)}
              {renderVisibleItem("location", "Sống tại", FaHomeAddress)}
              {renderVisibleItem("hometown", "Đến từ", IoIosLocate)}
              {renderVisibleItem("relationship_status", "Tình trạng", FaHeart)}
            </ul>
            {isOwner && (
              <button className="btn btn--secondary btn--full-width" onClick={handleEditModalOpen}>
                Chỉnh sửa chi tiết
              </button>
            )}
          </div>

          <div className="photos-card">
            <div className="photos-card__header">
              <h3>Ảnh</h3>
              <a href="#photos" className="photos-card__see-all">Xem tất cả ảnh</a>
            </div>
            <div className="photos-card__grid">
              {loadingImages ? (
                <p>Đang tải ảnh...</p>
              ) : images.length === 0 ? (
                <p>Chưa có ảnh nào</p>
              ) : (
                images.map((img) => (
                  <div className="photos-card__item">
                    <MediaCard media_id={img.media_id} media_type={"image"} />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="friends-card">
            <div className="friends-card__header">
              <h3>Bạn bè</h3>
              <a href="#friends" className="friends-card__see-all">Xem tất cả bạn bè</a>
            </div>
            <p className="friends-card__count">1.5K bạn bè</p>
            <div className="friends-card__grid">
              {[friend1Image].map((img, idx) => (
                <div key={idx} className="friends-card__item">
                  <img src={img} alt="Friend" />
                  <p>Nguyễn Văn B</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content__main">
          {isOwner && <CreatePost userInfo={userInfo} />}
          <div className="posts">
            {totalPosts === 0 ? <p>Chưa có bài đăng nào</p> : posts.map((post) => (
              <PostCard key={post.id} post={post} userInfo={userInfo} />
            ))}
          </div>
        </div>
      </div>

      {isOwner && isEditModalOpen && (
        <div className="edit-details-modal">
          <div className="edit-details-modal__overlay" onClick={() => setIsEditModalOpen(false)} />
          <div className="edit-details-modal__panel">
            <div className="edit-details-modal__header">
              <h2>🛠️ Chỉnh sửa chi tiết cá nhân</h2>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <FiX size={24} />
              </button>
            </div>

            <div className="edit-details-modal__section">
              <label className="edit-details-modal__label">📝 Tiểu sử</label>
              <textarea
                className="edit-details-modal__input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Giới thiệu đôi nét về bản thân..."
              />
            </div>

            {Object.entries(profileDetails).map(([field, { value, is_visible }]) => (
              <div key={field} className="edit-details-modal__section">
                <div className="edit-details-modal__row">
                  <label className="edit-details-modal__label">
                    {field === "job" && "💼 Công việc"}
                    {field === "education" && "🎓 Học vấn"}
                    {field === "location" && "📍 Nơi sống"}
                    {field === "hometown" && "🏡 Quê quán"}
                    {field === "relationship_status" && "❤️ Tình trạng"}
                  </label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={is_visible}
                      onChange={(e) => handleChangeDetail(field, "is_visible", e.target.checked)}
                    />
                    <span className="slider round" />
                  </label>
                </div>

                {field === "relationship_status" ? (
                  <select
                    className="edit-details-modal__input"
                    value={value}
                    onChange={(e) => handleChangeDetail(field, "value", e.target.value)}
                  >
                    {relationshipOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : ["location", "hometown"].includes(field) ? (
                  <div className="relative">
                    <input
                      className="edit-details-modal__input"
                      value={value}
                      onChange={(e) => handleProvinceInput(field, e.target.value)}
                      placeholder={`Nhập ${field === "location" ? "nơi sống" : "quê quán"}...`}
                    />
                    {focusedField === field && filteredProvinces.length > 0 && (
                      <ul className="autocomplete-dropdown">
                        {filteredProvinces.map((p) => (
                          <li
                            key={p.code}
                            className="autocomplete-option"
                            onClick={() => handleSelectProvince(field, p.name)}
                          >
                            {p.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <input
                    className="edit-details-modal__input"
                    value={value}
                    onChange={(e) => handleChangeDetail(field, "value", e.target.value)}
                    placeholder={`Nhập ${field}...`}
                  />
                )}
              </div>
            ))}

            <div className="edit-details-modal__footer">
              <button className="btn btn--secondary" onClick={() => setIsEditModalOpen(false)}>Hủy</button>
              <button className="btn btn--primary" onClick={handleSaveDetails} disabled={loading}>
                {loading ? "Đang lưu..." : "💾 Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostsTab;
