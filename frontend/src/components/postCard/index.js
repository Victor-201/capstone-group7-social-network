
import { AiFillLike, AiOutlineLike, AiFillHeart } from "react-icons/ai"; // Đúng thư viện 'ai'
import AvatarUser from "../avatarUser";
import { BiComment, BiShare, BiSmile } from "react-icons/bi"; // Đúng thư viện 'bi'
import { BsThreeDots, BsCameraFill } from "react-icons/bs"; // Đúng thư viện 'bs'
import { FaGlobe } from "react-icons/fa"; // Đúng thư viện 'fa'
import { ImAttachment } from "react-icons/im"; // Đúng thư viện 'im'
import { HiOutlineDocumentText } from "react-icons/hi"; // Đúng thư viện 'hi'
import "./style.scss";

const Post = ({ post, handleLike, user }) => {
  
  return (
    <div className="post">
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
                <FaGlobe /> {/* Biểu tượng FaGlobe */}
              </span>
            </div>
          </div>
        </div>
        <div className="post__actions">
          <button className="post__action">
            <BsThreeDots /> {/* Biểu tượng BsThreeDots */}
          </button>
        </div>
      </div>
      <div className="post__content">
        <p>{post.content}</p>
        {post.image && (
          <div className="post__image">
            <img src={post.image} alt="Post image" />
          </div>
        )}
      </div>
      <div className="post__stats">
        <div className="post__reactions">
          <div className="post__reaction-icons">
            <AiFillLike className="reaction-icon reaction-icon--like" /> {/* Biểu tượng AiFillLike */}
            <AiFillHeart className="reaction-icon reaction-icon--love" /> {/* Biểu tượng AiFillHeart */}
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
          {post.liked ? <AiFillLike /> : <AiOutlineLike />} {/* Biểu tượng AiFillLike hoặc AiOutlineLike */}
          Thích
        </button>
        <button className="post__button">
          <BiComment /> {/* Biểu tượng BiComment */}
          Bình luận
        </button>
        <button className="post__button">
          <BiShare /> {/* Biểu tượng BiShare */}
          Chia sẻ
        </button>
      </div>
      <div className="post__comments">
        <div className="comment">
          <div className="comment__avatar">
            <AvatarUser user={user} />
          </div>
          <div className="comment__box">
            <input type="text" placeholder="Viết bình luận..." />
            <div className="comment__actions">
              <BiSmile className="comment-icon" /> {/* Biểu tượng BiSmile */}
              <BsCameraFill className="comment-icon" /> {/* Biểu tượng BsCameraFill */}
              <ImAttachment className="comment-icon" /> {/* Biểu tượng ImAttachment */}
              <HiOutlineDocumentText className="comment-icon" /> {/* Biểu tượng HiOutlineDocumentText */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
