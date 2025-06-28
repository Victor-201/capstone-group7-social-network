import React, { useState, useRef, useEffect } from "react";
import useTimeAgo from "../../hooks/useTimeAgo";
import EditPostPopup from "../postPopup";
import {
  AiFillLike,
  AiOutlineLike,
} from "react-icons/ai";
import {
  BiComment,
  BiShare,
  BiSmile
} from "react-icons/bi";
import { BsThreeDots, BsCameraFill } from "react-icons/bs";
import { FaGlobe } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

import AvatarUser from "../avatarUser";
import useCloudinaryFile from "../../hooks/useCloudinaryFile";
import { usePostLikes } from "../../hooks/posts/usePostLikes";
import { useUserInfo } from "../../hooks/user";
import "./style.scss";

// Component để hiển thị ảnh trong modal
const ModalImage = ({ mediaUrl, alt, className }) => {
  const fileUrl = useCloudinaryFile(mediaUrl, "image");

  if (!fileUrl) {
    return <div className="image-loading">Đang tải...</div>;
  }

  return <img src={fileUrl} alt={alt} className={className} />;
};

// Component Modal hiển thị ảnh
const ImageModal = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-modal" onClick={handleBackdropClick}>
      <div className="image-modal__content">
        {/* Header */}
        <div className="image-modal__header">
          <span className="image-modal__counter">
            {currentIndex + 1} / {images.length}
          </span>
          <button className="image-modal__close" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        {/* Main Image */}
        <div className="image-modal__main">
          {images.length > 1 && (
            <button className="image-modal__nav image-modal__nav--prev" onClick={prevImage}>
              <IoChevronBack />
            </button>
          )}

          <ModalImage
            mediaUrl={images[currentIndex].media_url}
            alt={`Ảnh ${currentIndex + 1}`}
            className="image-modal__image"
          />

          {images.length > 1 && (
            <button className="image-modal__nav image-modal__nav--next" onClick={nextImage}>
              <IoChevronForward />
            </button>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="image-modal__thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`image-modal__thumbnail ${index === currentIndex ? "image-modal__thumbnail--active" : ""
                  }`}
                onClick={() => setCurrentIndex(index)}
              >
                <ModalImage
                  mediaUrl={image.media_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="image-modal__thumbnail-img"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MediaItem = ({ mediaUrl, mediaType, onClick }) => {
  const fileUrl = useCloudinaryFile(mediaUrl, mediaType);
  if (!fileUrl) return <p>Đang tải {mediaType}...</p>;

  return (
    <div className="post__media-item">
      {mediaType === "image" ? (
        <img
          src={fileUrl}
          alt="Ảnh bài viết"
          onClick={onClick}
          style={{ cursor: "pointer" }}
        />
      ) : mediaType === "video" ? (
        <video controls>
          <source src={fileUrl} type="video/mp4" />
          Trình duyệt không hỗ trợ video.
        </video>
      ) : (
        <p>Không hỗ trợ media</p>
      )}
    </div>
  );
};

// Component hiển thị layout đặc biệt cho 4+ ảnh
const MultipleImagesLayout = ({ images, onImageClick, onShowAll }) => {
  const firstImage = images[0];
  const secondImage = images[1];
  const thirdImage = images[2];
  const remainingCount = images.length - 2;

  return (
    <div className="post__media-grid post__media-grid--multiple">
      {/* Ảnh lớn bên trái */}
      <div className="post__media-large">
        <ModalImage
          mediaUrl={firstImage.media_url}
          alt="Ảnh chính"
          className="post__media-image"
        />
        <div
          className="post__media-overlay"
          onClick={() => onImageClick(firstImage.media_url)}
        />
      </div>

      {/* Cột ảnh nhỏ bên phải */}
      <div className="post__media-column">
        {/* Ảnh nhỏ bên trên */}
        <div className="post__media-small post__media-small--top">
          <ModalImage
            mediaUrl={secondImage.media_url}
            alt="Ảnh phụ trên"
            className="post__media-image"
          />
          <div
            className="post__media-overlay"
            onClick={() => onImageClick(secondImage.media_url)}
          />
        </div>

        {/* Ảnh nhỏ bên dưới với overlay */}
        <div className="post__media-small post__media-small--bottom">
          <ModalImage
            mediaUrl={thirdImage.media_url}
            alt="Ảnh phụ dưới"
            className="post__media-image"
          />
          <div
            className="post__media-overlay post__media-overlay--with-text"
            onClick={onShowAll}
          >
            <span className="post__media-count">+{remainingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Post = ({ post, user_id }) => {
  const { userInfo } = useUserInfo(user_id);
  const { toggleLike, loading, error } = usePostLikes();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openActions, setOpenActions] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);

  // Lọc ra chỉ những media là ảnh và những media khác
  const images = post.media?.filter(media => media.media_type === "image") || [];
  const otherMedia = post.media?.filter(media => media.media_type !== "image") || [];

  const handleLike = async () => {
    try {
      await toggleLike(post.id, !post.isLiked);
      if (post.isLiked === false) {
        post.like_count++;
      }
      else {
        post.like_count--;
      }
      post.isLiked = !post.isLiked;
    } catch (err) {
      console.error("Lỗi like:", err);
    }
  };

  const handleImageClick = (clickedMediaUrl) => {
    // Tìm index của ảnh được click trong danh sách images
    const imageIndex = images.findIndex(img => img.media_url === clickedMediaUrl);
    if (imageIndex !== -1) {
      setSelectedImageIndex(imageIndex);
      setShowImageModal(true);
    }
  };

  const handleShowAllImages = () => {
    setSelectedImageIndex(0);
    setShowImageModal(true);
  };

  const renderImages = () => {
    if (images.length === 0) return null;

    if (images.length >= 4) {
      return (
        <MultipleImagesLayout
          images={images}
          onImageClick={handleImageClick}
          onShowAll={handleShowAllImages}
        />
      );
    }

    // Layout cho 1-3 ảnh (giữ nguyên như cũ)
    return (
      <div className="post__media-list">
        {images.map((image, index) => (
          <MediaItem
            key={index}
            mediaUrl={image.media_url}
            mediaType="image"
            onClick={() => handleImageClick(image.media_url)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="post__wrapper">
        <div className="post">
          {/* Header */}
          <div className="post__header">
            <div className="post__author">
              <div className="post__avatar">
                <AvatarUser user={userInfo} />
              </div>
              <div className="post__info">
                <h4 className="post__author-name">
                  {userInfo?.full_name || "Người dùng"}
                </h4>
                <div className="post__meta">
                  <span className="post__time">{useTimeAgo(post.created_at)}</span>
                  <span className="post__privacy">
                    <FaGlobe />
                  </span>
                </div>
              </div>
            </div>
            <div className="post__actions">
              <button className="post__action" onClick={() => { setOpenActions(true); }}>
                <BsThreeDots />
                {openActions && (
                  <div className="post__actions-menu">
                    <button className="post__action-item" onClick={() => { setOpenEditPopup(true); setOpenActions(false); }}>
                      Chỉnh sửa
                    </button>
                    <button className="post__action-item" onClick={() => { }}>
                      Xóa
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>
          {openEditPopup && (
            <EditPostPopup
              post={post}
              onClose={() => setOpenEditPopup(false)}
            />
          )}

          {/* Nội dung */}
          <div className="post__content">
            <p>{post.content}</p>

            {/* Hiển thị ảnh */}
            {images.length > 0 && renderImages()}

            {/* Hiển thị các media khác (video, etc.) */}
            {otherMedia.length > 0 && (
              <div className="post__media-list">
                {otherMedia.map((media, index) => (
                  <MediaItem
                    key={index}
                    mediaUrl={media.media_url}
                    mediaType={media.media_type}
                    onClick={() => { }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="post__stats">
            <div className="post__reactions">
              {post.like_count !== 0 && (
                <>
                  <div className="post__reaction-icons">
                    <AiFillLike className="reaction-icon reaction-icon--like" />
                  </div>
                  <span>{post.like_count}</span>
                </>
              )}
            </div>
            <div className="post__comments-shares">
              <span>{post.comments} bình luận</span>
              <span>{post.shares} lượt chia sẻ</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="post__buttons">
            <button
              className={`post__button ${post.isLiked ? "post__button--active" : ""}`}
              onClick={handleLike}
              disabled={loading}
            >
              {post.isLiked ? <AiFillLike /> : <AiOutlineLike />} Thích
            </button>
            <button className="post__button">
              <BiComment />
              Bình luận
            </button>
            <button className="post__button">
              <BiShare />
              Chia sẻ
            </button>
          </div>

          {error && (
            <p className="post__error" style={{ color: "red", marginLeft: "1rem" }}>
              Lỗi khi xử lý like: {error}
            </p>
          )}

          {/* Comment */}
          <div className="post__comments">
            <div className="comment">
              <div className="comment__avatar">
                <AvatarUser user={userInfo} />
              </div>
              <div className="comment__box">
                <input type="text" placeholder="Viết bình luận..." />
                <div className="comment__actions">
                  <BiSmile className="comment-icon" />
                  <BsCameraFill className="comment-icon" />
                  <ImAttachment className="comment-icon" />
                  <HiOutlineDocumentText className="comment-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <ImageModal
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  );
};

export default Post;