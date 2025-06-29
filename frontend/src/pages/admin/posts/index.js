import React, { useState, useEffect } from "react";
import { getAllPosts, deletePost } from "../../../api/adminApi";
import { useAuth } from "../../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";

const PostsAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  
  useEffect(() => {
    const fetchPosts = async () => {
      if (!auth || !auth.token) {
        setError("Vui lòng đăng nhập");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getAllPosts(auth.token);
        
        // Debug để xem cấu trúc dữ liệu
        console.log("Posts API Response:", response);
        
        if (Array.isArray(response)) {
          const formattedPosts = response.map(post => {
            // Xử lý các trường hợp cấu trúc khác nhau
            const userInfo = post.User_Info || post.UserInfo || post.userInfo || {};
            return {
              id: post.id,
              content: post.content || '',
              likes_count: post.like_count || 0,
              comments_count: post.comment_count || 0,
              created_at: post.created_at || '',
              user: {
                username: userInfo.full_name || '',
                id: userInfo.id || post.userId || '',
                avatar: userInfo.avatar || ''
              }
            };
          });
          setPosts(formattedPosts);
        } else {
          console.error("Cấu trúc dữ liệu không đúng:", response);
          setPosts([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [auth]);
  
  const handleDeletePost = async (postId) => {
    if (!auth || !auth.token) {
      setError("Vui lòng đăng nhập");
      return;
    }
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
      return;
    }
    
    try {
      await deletePost(auth.token, postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }
  
  if (loading) return (
    <div className="admin-loading">
      <FaSpinner className="spinner-icon" />
      <span>Đang tải dữ liệu...</span>
    </div>
  );
  
  if (error) return <div className="admin-error">Lỗi: {error}</div>;
  
  return (
    <div className="admin-section">
      <h2>Quản lý bài đăng</h2>
      
      <div className="admin-table-container">
        {Array.isArray(posts) && posts.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người đăng</th>
                <th>Nội dung</th>
                <th>Lượt thích</th>
                <th>Bình luận</th>
                <th>Ngày đăng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id || Math.random()}>
                  <td>{post.id}</td>
                  <td>{post.user?.username || post.user?.user_name || 'Không xác định'}</td>
                  <td className="post-content-cell">
                    {post.content && post.content.length > 100 
                      ? `${post.content.slice(0, 100)}...` 
                      : post.content || ''}
                  </td>
                  <td>{post.likes_count}</td>
                  <td>{post.comments_count}</td>
                  <td>{post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : ''}</td>
                  <td>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <FaTrashAlt /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-no-data">
            Không có bài đăng nào để hiển thị
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsAdmin;