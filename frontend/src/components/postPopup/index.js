import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import AvatarUser from "../avatarUser";
import { usePostActions } from "../../hooks/posts/usePostActions";

const EditPostPopup = ({ post, onClose, userInfo, onUpdateSuccess }) => {
  const { updateExistingPost, loading, error } = usePostActions();

  const [content, setContent] = useState(post?.content || "");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]); // Media đã có từ trước
  const [accessModifier, setAccessModifier] = useState(post?.access_modifier || "public");
  const fileInputRef = useRef(null);

  // Gán lại dữ liệu nếu post thay đổi
  useEffect(() => {
    setContent(post?.content || "");
    setAccessModifier(post?.access_modifier || "public");
    
    // Phân biệt media cũ và mới
    if (post?.media && Array.isArray(post.media)) {
      setExistingMedia(post.media);
      setMediaFiles([]); // Reset media files mới
    }
  }, [post]);

  // Thêm file mới
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...files]);
    fileInputRef.current.value = null; // clear input
  };

  // Xóa media cũ
  const handleRemoveExistingMedia = (index) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Xóa media mới
  const handleRemoveNewMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Gửi cập nhật bài viết
  const handleSave = async () => {
    if (!content.trim() && existingMedia.length === 0 && mediaFiles.length === 0) {
      alert("Vui lòng nhập nội dung hoặc thêm media!");
      return;
    }

    // Validate access_modifier
    if (!accessModifier || !['public', 'friends', 'private'].includes(accessModifier)) {
      alert("Vui lòng chọn quyền riêng tư hợp lệ!");
      return;
    }

    try {
      const formData = new FormData();
      
      // Đảm bảo content không null/undefined
      formData.append("content", content.trim());
      
      // Đảm bảo access_modifier được gửi chính xác
      formData.append("access_modifier", accessModifier);

      // Thêm media cũ còn lại (gửi dưới dạng JSON string hoặc ID)
      if (existingMedia.length > 0) {
        formData.append("existing_media", JSON.stringify(existingMedia));
      }

      // Thêm file mới
      if (mediaFiles.length > 0) {
        mediaFiles.forEach((file, index) => {
          formData.append("mediaFiles", file);
        });
      }

      // 🔍 DEBUG: kiểm tra dữ liệu gửi
      console.log("📤 Sending update for post ID:", post.id);
      console.log("📤 Access modifier:", accessModifier);
      console.log("📤 Content:", content);
      console.log("📤 Existing media count:", existingMedia.length);
      console.log("📤 New media files count:", mediaFiles.length);
      
      // Log tất cả FormData entries
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log("🧾 FormData:", key, `File: ${value.name} (${value.type})`);
        } else {
          console.log("🧾 FormData:", key, value);
        }
      }

      const result = await updateExistingPost(post.id, formData);
      
      // Gọi callback để cập nhật UI
      if (onUpdateSuccess) {
        onUpdateSuccess(result);
      }
      
      // Reset form
      setMediaFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      
      onClose();
      alert("✅ Cập nhật bài viết thành công!");
    } catch (err) {
      console.error("❌ Update error:", err);
      console.error("❌ Error details:", err);
      alert("❌ Lỗi khi cập nhật bài viết: " + err.message);
    }
  };

  const handleClose = () => {
    // Reset form khi đóng
    setContent(post?.content || "");
    setAccessModifier(post?.access_modifier || "public");
    setExistingMedia(post?.media || []);
    setMediaFiles([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    onClose();
  };

  // Helper function để kiểm tra file type
  const isVideoFile = (file) => {
    if (typeof file === "string") {
      return file.includes(".mp4") || file.includes(".webm") || file.includes(".mov");
    }
    return file.type && file.type.startsWith("video");
  };

  const isImageFile = (file) => {
    if (typeof file === "string") {
      return file.includes(".jpg") || file.includes(".jpeg") || file.includes(".png") || file.includes(".gif");
    }
    return file.type && file.type.startsWith("image");
  };

  return (
    <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="popup-content">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>

        <h2 className="popup-title">Chỉnh sửa bài viết</h2>

        <div className="create-post__header">
          <div className="create-post__avatar">
            <AvatarUser user={userInfo} />
          </div>
          <textarea
            className="create-post__input"
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>

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

        {/* Hiển thị media cũ */}
        {existingMedia.length > 0 && (
          <div className="create-post__media-preview">
            <h4>Media hiện tại:</h4>
            {existingMedia.map((mediaUrl, index) => (
              <div key={`existing-${index}`} className="media-preview-item">
                {isVideoFile(mediaUrl) ? (
                  <video src={mediaUrl} controls style={{ maxWidth: "200px", maxHeight: "200px" }} />
                ) : isImageFile(mediaUrl) ? (
                  <img src={mediaUrl} alt="existing media" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }} />
                ) : (
                  <div>📎 {mediaUrl}</div>
                )}
                <button 
                  className="remove-media-btn"
                  onClick={() => handleRemoveExistingMedia(index)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hiển thị media mới */}
        {mediaFiles.length > 0 && (
          <div className="create-post__media-preview">
            <h4>Media mới:</h4>
            {mediaFiles.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={`new-${index}`} className="media-preview-item">
                  {isVideoFile(file) ? (
                    <video src={url} controls style={{ maxWidth: "200px", maxHeight: "200px" }} />
                  ) : (
                    <img src={url} alt="new media" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }} />
                  )}
                  <button 
                    className="remove-media-btn"
                    onClick={() => handleRemoveNewMedia(index)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="create-post__actions">
          <button 
            className="create-post__action" 
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            📷 Thêm ảnh/video
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="create-post__submit">
          <button 
            onClick={handleSave} 
            disabled={loading || (!content.trim() && existingMedia.length === 0 && mediaFiles.length === 0)}
            type="button"
          >
            {loading ? "Đang lưu..." : "💾 Lưu bài viết"}
          </button>
        </div>

        {error && <div className="create-post__error">❌ {error}</div>}
      </div>
    </div>
  );
};

export default EditPostPopup;