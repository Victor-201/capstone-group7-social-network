import { useState, useRef } from "react";
import { RiVideoAddLine } from "react-icons/ri";
import { MdPhotoLibrary, MdOutlineEmojiEmotions } from "react-icons/md";
import "./style.scss";
import AvatarUser from "../avatarUser";
import { useCreatePost } from "../../hooks/posts/useCreatePost";
import { useUserInfo } from "../../hooks/user";
const CreatePost = ({ user_id }) => {
  const { userInfo } = useUserInfo(user_id);
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [accessModifier, setAccessModifier] = useState("public"); // NEW
  const fileInputRef = useRef(null);

  const {
    createPostWithMedia,
    loading,
    error,
    uploadProgress,
  } = useCreatePost();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const handleCreatePost = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    try {
      const postData = {
        content,
        access_modifier: accessModifier, // NEW
      };

      await createPostWithMedia(postData, mediaFiles);
      alert("✅ Đăng bài thành công!");

      setContent("");
      setMediaFiles([]);
      fileInputRef.current.value = null;
      setAccessModifier("public"); // Reset về mặc định
    } catch (err) {
      alert("❌ Đăng bài thất bại: " + err.message);
    }
  };

  const handleRemoveMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="create-post">
      <div className="create-post__header">
        <div className="create-post__avatar">
          <AvatarUser user={userInfo} />
        </div>
        <textarea
          className="create-post__input"
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Access Modifier Selector */}
      <div className="create-post__options">
        <select
          className="create-post__access"
          value={accessModifier}
          onChange={(e) => setAccessModifier(e.target.value)}
        >
          <option value="public">🌐 Công khai</option>
          <option value="friends">👥 Bạn bè</option>
          <option value="private">🔒 Chỉ mình tôi</option>
        </select>
      </div>

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="create-post__media-preview">
          {mediaFiles.map((file, index) => (
            <div key={index} className="media-preview-item">
              {file.type.startsWith("image") ? (
                <img src={URL.createObjectURL(file)} alt="preview" />
              ) : (
                <video src={URL.createObjectURL(file)} controls />
              )}
              <button onClick={() => handleRemoveMedia(index)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      {(content.trim() || mediaFiles.length > 0) && (
        <div className="create-post__submit">
          <button onClick={handleCreatePost} disabled={loading}>
            {loading ? `Đang đăng... (${uploadProgress}%)` : "Đăng bài"}
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="create-post__actions">
        <button className="create-post__action">
          <RiVideoAddLine className="action-icon" />
          Video trực tiếp
        </button>

        <button
          className="create-post__action"
          onClick={() => fileInputRef.current.click()}
        >
          <MdPhotoLibrary className="action-icon" />
          Ảnh/Video
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        <button className="create-post__action">
          <MdOutlineEmojiEmotions className="action-icon" />
          Cảm xúc/Hoạt động
        </button>
      </div>

      {/* Error */}
      {error && <div className="create-post__error">❌ {error}</div>}
    </div>
  );
};

export default CreatePost;
