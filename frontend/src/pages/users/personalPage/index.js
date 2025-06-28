import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiUsers,
  FiEdit,
  FiCheckCircle,
  FiMoreHorizontal,
} from "react-icons/fi";
import { BsCameraFill } from "react-icons/bs";
import { useParams } from "react-router-dom";

import AvatarUser from "../../../components/avatarUser";
import MediaCard from "../../../components/mediaCard";
import CreatePost from "../../../components/createPost";
import { useCloudinaryFile } from "../../../hooks/useCloudinaryFile";
import { ChageUserImage } from "../../../hooks/media/useChageImage";
import { useUserImages } from "../../../hooks/media/useUserImages";
import { useFriends } from "../../../hooks/friends/useFriends";
import { useUserInfo } from "../../../hooks/user";
import { useAuth } from "../../../contexts/AuthContext";
import { useBatchMutualFriends } from "../../../hooks/friends/useMutualFriends";

import PostsTab from "./modals/PostsTab";
import AboutTab from "./modals/AboutTab";

import "./style.scss";

const PersonalPage = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const tabsRef = useRef(null);

  const { user_name } = useParams();

  const isOwner = auth.user_name === user_name;
  const { userInfo, isLoading } = useUserInfo(isOwner ? undefined : user_name);
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const coverImageUrl = useCloudinaryFile(userInfo?.cover, "image");
  const { isUploading, error, handleChangeUserImage } = ChageUserImage();
  const { images, loading: loadingImages } = useUserImages(userInfo?.id);
  const {
    friends,
    loading: loadingFriends,
    error: friendsError,
    refetch: refetchFriends,
  } = useFriends(userInfo?.id);

  // Lấy danh sách friendIds từ friends
  const friendIds = useMemo(() => friends.map(friend => friend.id), [friends]);
  // Sử dụng hook useBatchMutualFriends để lấy số lượng bạn chung
  const { mutualCounts, loading: loadingMutual, error: mutualError } = useBatchMutualFriends(friendIds);

  useEffect(() => {
    if (userInfo?.id) {
      refetchFriends(userInfo.id);
    }
  }, [userInfo?.id, refetchFriends]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
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

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "posts":
        return (
          <PostsTab
            userInfo={userInfo}
            isOwner={isOwner}
            handleTabClick={handleTabClick}
          />
        );
      case "photos":
        return (
          <div className="photos-tab-content">
            <h3>Tất cả ảnh</h3>
            {loadingImages ? (
              <p>Đang tải ảnh...</p>
            ) : images.length === 0 ? (
              <p>Chưa có ảnh nào</p>
            ) : (
              <div className="photos-card__grid">
                {images.map((img) => (
                  <div key={img.media_id} className="photos-card__item">
                    <MediaCard media_id={img.media_id} media_type="image" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "friends":
        return (
          <div className="friends-tab-content">
            <h3>Danh sách bạn bè</h3>
            {loadingFriends || loadingMutual ? (
              <p>Đang tải danh sách bạn bè...</p>
            ) : friendsError || mutualError ? (
              <p>Lỗi khi tải danh sách bạn bè: {friendsError || mutualError}</p>
            ) : friends.length === 0 ? (
              <p>Chưa có bạn bè nào</p>
            ) : (
              <div className="friends-list-rect">
                {friends.map((friend) => (
                  <div key={friend.id} className="friend-card-rect">
                    <div className="avatar-large">
                      <AvatarUser user={friend} />
                    </div>
                    <div className="friend-info">
                      <p className="friend-name">{friend.full_name}</p>
                      <p className="mutual-friends">
                        {mutualCounts[friend.id] !== undefined
                          ? `${mutualCounts[friend.id]} bạn chung`
                          : "Đang tải bạn chung..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "about":
        return <AboutTab userInfo={userInfo} isOwner={isOwner} />;
      default:
        return null;
    }
  }, [activeTab, images, loadingImages, friends, loadingFriends, friendsError, mutualCounts, loadingMutual, mutualError, userInfo, isOwner]);

  if (!userInfo || isLoading) {
    return <p className="loading-screen">⏳ Đang tải trang cá nhân...</p>;
  }

  return (
    <div className="container">
      <article className="personal-page">
        <main className="main">
          <section className="profile">
            <div className="viewer-mode-banner">
              <p className="viewer-mode-text">
                {isOwner
                  ? "🧑 Đây là trang cá nhân của bạn"
                  : "👀 Bạn đang xem trang cá nhân của người khác"}
              </p>
            </div>

            <div className="profile__cover-container">
              <img
                src={coverImageUrl}
                alt="Cover"
                className="profile__cover"
              />
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
                  <span>
                    {loadingFriends ? "Đang tải..." : `${friends.length} bạn bè`}
                  </span>
                  <div className="profile__friends-avatars">
                    {!loadingFriends &&
                      friends.slice(0, 3).map((friend) => (
                        <div
                          key={friend.id}
                          className="avatar-image"
                          title={friend.full_name}
                        >
                          <AvatarUser user={friend} />
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
                  {["posts", "about", "friends", "photos", "videos", "reels"].map(
                    (tabId) => (
                      <li
                        key={tabId}
                        className={`tabs__item ${activeTab === tabId ? "tabs__item--active" : ""}`}
                      >
                        <a href={`#${tabId}`} onClick={() => handleTabClick(tabId)}>
                          {tabId === "posts"
                            ? "Bài viết"
                            : tabId === "about"
                              ? "Giới thiệu"
                              : tabId === "friends"
                                ? "Bạn bè"
                                : tabId === "photos"
                                  ? "Ảnh"
                                  : tabId === "videos"
                                    ? "Video"
                                    : "Reels"}
                        </a>
                      </li>
                    )
                  )}
                  <li className="tabs__item tabs__item--more">
                    <a href="#">
                      Xem thêm <FiMoreHorizontal className="down-icon" />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {renderTabContent}
          </section>
        </main>
      </article>
    </div>
  );
};

export default PersonalPage;