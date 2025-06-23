import React, { useState } from "react";
import { FiPlus, FiUsers, FiEdit, FiCheckCircle, FiMoreHorizontal } from "react-icons/fi";
import { BsCameraFill } from "react-icons/bs";
import AvatarUser from "../../../../../components/avatarUser";
import coverImage from "../../../../../assets/images/logo192.png";
import friend1Image from "../../../../../assets/images/logo192.png";
import "./style.scss";

const ProfileSection = ({ tabsRef, activeTab, handleTabClick, userInfo }) => {

  const handleEditAction = (action) => {
    alert(`Tính năng ${action} đang được phát triển!`);
  };

  const friendImages = [friend1Image];

  if (userInfo) {
  return (
    <section className="profile">
      <div className="profile__cover-container">
        <img src={coverImage} alt="Cover" className="profile__cover" />
        <button
          className="profile__edit-cover-btn"
          onClick={() => handleEditAction("thay đổi ảnh bìa")}
        >
          <BsCameraFill />
          Chỉnh sửa ảnh bìa
        </button>
      </div>
      <div className="profile__main">
        <div className="profile__avatar-container">
          <div className="profile__avatar-wrapper">
            <div className="profile__avatar-image">
              <AvatarUser user={userInfo} />
            </div>
            <div
              className="profile__edit-avatar-overlay"
              onClick={() => handleEditAction("thay đổi ảnh đại diện")}
            >
              <BsCameraFill />
            </div>
          </div>
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
              {friendImages.map((friendImage, index) => (
                <div key={index} className="avatar-image">
                  <AvatarUser user={userInfo} />
                </div>
              ))}
            </div>
          </div>
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
                className={`tabs__item ${activeTab === tab.id ? "tabs__item--active" : ""}`}
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
}

export default ProfileSection;
