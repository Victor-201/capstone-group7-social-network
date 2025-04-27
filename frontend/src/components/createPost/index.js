import { RiVideoAddLine } from "react-icons/ri";
import { MdPhotoLibrary, MdOutlineEmojiEmotions } from "react-icons/md";
import "./style.scss";
import avatarImage from "../../assets/images/logo192.png"; // Replace with your default avatar image path

const CreatePost = () => {
  const handleEditAction = (action) => {
    alert(`Tính năng ${action} đang được phát triển!`);
  };

  return (
    <div className="create-post">
      <div className="create-post__header">
        <img src={avatarImage} alt="Avatar" className="create-post__avatar" />
        <div className="create-post__input" onClick={() => handleEditAction("đăng bài")}>
          <span>Bạn đang nghĩ gì?</span>
        </div>
      </div>
      <div className="create-post__actions">
        <button className="create-post__action" onClick={() => handleEditAction("video trực tiếp")}>
          <RiVideoAddLine className="action-icon" />
          Video trực tiếp
        </button>
        <button className="create-post__action" onClick={() => handleEditAction("ảnh/video")}>
          <MdPhotoLibrary className="action-icon" />
          Ảnh/Video
        </button>
        <button className="create-post__action" onClick={() => handleEditAction("cảm xúc/hoạt động")}>
          <MdOutlineEmojiEmotions className="action-icon" />
          Cảm xúc/Hoạt động
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
