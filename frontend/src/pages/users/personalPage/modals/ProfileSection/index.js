import React, { useState, useRef } from "react";
import {
  FiPlus,
  FiUsers,
  FiEdit,
  FiCheckCircle,
  FiMoreHorizontal,
} from "react-icons/fi";
import { BsCameraFill } from "react-icons/bs";
import AvatarUser from "../../../../../components/avatarUser";
import coverImage from "../../../../../assets/images/logo192.png";
import friend1Image from "../../../../../assets/images/logo192.png";
import { useCloudinaryFile } from "../../../../../hooks/useCloudinaryFile";
import { ChageUserImage } from "../../../../../hooks/media/useChageImage";
import "./style.scss";

const ProfileSection = ({
  tabsRef,
  activeTab,
  handleTabClick,
  userInfo,
  token,
  isOwner,
}) => {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const coverImageUrl = useCloudinaryFile(userInfo?.cover, "image");
  const friendImages = [friend1Image];

  const { isUploading, error, handleChangeUserImage } = ChageUserImage();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleChangeUserImage(file, "avatar");
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleChangeUserImage(file, "cover");
    }
  };

  const handleEditAction = (action) => {
    alert(`Tính năng ${action} đang được phát triển!`);
  };

  if (!userInfo) {
    return <p>Đang tải dữ liệu người dùng...</p>;
  }

  return (
    <section className="profile">
      {/* ✅ Thông báo chế độ */}
      <div className="viewer-mode-banner">
        <p className="viewer-mode-text">
          {isOwner
            ? "🧑 Đây là trang cá nhân của bạn"
            : "👀 Bạn đang xem trang cá nhân của người khác"}
        </p>
      </div>

      {/* Cover ảnh */}
      <div className="profile__cover-container">
        <img
          src={coverImageUrl || coverImage}
          alt="Cover"
          className="profile__cover"
        />

        {/* Nút chỉnh sửa ảnh bìa */}
        {isOwner && (
          <>
            <div
              className="profile__edit-cover-btn"
              onClick={() => coverInputRef.current?.click()}
            >
              <BsCameraFill />
              Chỉnh sửa ảnh bìa
            </div>
            <input
              name="media"
              type="file"
              accept="image/*"
              ref={coverInputRef}
              style={{ display: "none" }}
              onChange={handleCoverChange}
            />
          </>
        )}
      </div>

      <div className="profile__main">
        <div className="profile__avatar-container">
          <div className="profile__avatar-wrapper">
            <div className="profile__avatar-image">
              <AvatarUser user={userInfo} />
            </div>

            {isOwner && (
              <>
                <div
                  className="profile__edit-avatar-overlay"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <BsCameraFill />
                </div>
                <input
                  name="media"
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>

          {isUploading && <p className="upload-status">Đang cập nhật ảnh...</p>}
          {error && <p className="upload-error">{error}</p>}
        </div>

        <div className="profile__info">
          <div className="profile__name-container">
            <h1 className="profile__name">{userInfo.full_name}</h1>
            <div className="profile__verified-badge">
              <FiCheckCircle />
            </div>
          </div>

          <div className="profile__friends-info">
            <FiUsers />
            <span>1.5K bạn bè</span>
            <div className="profile__friends-avatars">
              {friendImages.map((img, index) => (
                <div key={index} className="avatar-image">
                  <AvatarUser user={userInfo} />
                </div>
              ))}
            </div>
          </div>

          {isOwner && (
            <div className="profile__actions">
              <button className="btnlait btn--primary">
                <FiPlus />
                Thêm vào story
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => handleEditAction("chỉnh sửa trang cá nhân")}
              >
                <FiEdit />
                Chỉnh sửa trang cá nhân
              </button>
              <button className="btn btn--icon-only">
                <FiMoreHorizontal />
              </button>
            </div>
          )}
        </div>
      </div>

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
              <li
                key={tab.id}
                className={`tabs__item ${
                  activeTab === tab.id ? "tabs__item--active" : ""
                }`}
              >
                <a href={`#${tab.id}`} onClick={() => handleTabClick(tab.id)}>
                  {tab.label}
                </a>
              </li>
            ))}
            <li className="tabs__item tabs__item--more">
              <a href="#">
                Xem thêm <FiMoreHorizontal className="down-icon" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default ProfileSection;
