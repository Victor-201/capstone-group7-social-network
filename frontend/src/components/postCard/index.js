import { useState } from "react";
import {
  AiFillLike,
  AiOutlineLike,
  AiFillHeart
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

import AvatarUser from "../avatarUser";
import useCloudinaryFile from "../../hooks/useCloudinaryFile";
import { usePostLikes } from "../../hooks/posts/usePostLikes";
import "./style.scss";

const MediaItem = ({ mediaUrl, mediaType }) => {
  const fileUrl = useCloudinaryFile(mediaUrl, mediaType);
  if (!fileUrl) return <p>Đang tải {mediaType}...</p>;

  return (
    <div className="post__media-item">
      {mediaType === "image" ? (
        <img src={fileUrl} alt="Ảnh bài viết" />
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

const Post = ({ post, user }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const { toggleLike, loading, error } = usePostLikes();

  const handleLike = async () => {
    try {
      await toggleLike(post.id, !isLiked); // gửi trạng thái đảo
      setIsLiked(!isLiked); // cập nhật UI
    } catch (err) {
      console.error("Lỗi like:", err);
    }
  };

  return (
    <div className="post__wrapper">
      <div className="post">
        {/* Header */}
        <div className="post__header">
          <div className="post__author">
            <div className="post__avatar">
              <AvatarUser user={user} />
            </div>
            <div className="post__info">
              <h4 className="post__author-name">{post.author}</h4>
              <div className="post__meta">
                <span className="post__time">{post.time}</span>
                <span className="post__privacy">
                  <FaGlobe />
                </span>
              </div>
            </div>
          </div>
          <div className="post__actions">
            <button className="post__action">
              <BsThreeDots />
            </button>
          </div>
        </div>

        {/* Nội dung */}
        <div className="post__content">
          <p>{post.content}</p>
          {post.media?.length > 0 && (
            <div className="post__media-list">
              {post.media.map((media, index) => (
                <MediaItem
                  key={media.media_url || index}
                  mediaUrl={media.media_url}
                  mediaType={media.media_type}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="post__stats">
          <div className="post__reactions">
            <div className="post__reaction-icons">
              <AiFillLike className="reaction-icon reaction-icon--like" />
              <AiFillHeart className="reaction-icon reaction-icon--love" />
            </div>
            <span>{post.countLike}</span>
          </div>
          <div className="post__comments-shares">
            <span>{post.comments} bình luận</span>
            <span>{post.shares} lượt chia sẻ</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="post__buttons">
          <button
            className={`post__button ${isLiked ? "post__button--active" : ""}`}
            onClick={handleLike}
            disabled={loading}
          >
            {isLiked ? <AiFillLike /> : <AiOutlineLike />} Thích
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
              <AvatarUser user={user} />
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
  );
};

export default Post;
