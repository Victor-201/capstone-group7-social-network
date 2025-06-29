import React, { useState, useEffect } from "react";
import { getSystemStats } from "../../../api/adminApi";
import { useAuth } from "../../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { 
  FaSpinner, 
  FaUsers, 
  FaUserPlus, 
  FaClipboard, 
  FaFileUpload, 
  FaComment, 
  FaThumbsUp 
} from "react-icons/fa";

const StateAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!auth || !auth.token) {
        setError("Vui lòng đăng nhập");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getSystemStats(auth.token);
        
        // Kiểm tra cấu trúc dữ liệu
        console.log("Stats API Response:", response);
        
        if (response && typeof response === 'object') {
          setStats(response);
        } else {
          console.error("Cấu trúc dữ liệu không đúng:", response);
          setStats(null);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [auth]);
  
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
  if (!stats) return <div className="admin-no-data">Không có dữ liệu thống kê</div>;
  
  // Lấy dữ liệu từ stats với xử lý fallback an toàn
  const {
    total_users = 0,
    new_users_today = 0,
    total_posts = 0,
    new_posts_today = 0,
    total_comments_today = 0,
    total_likes_today = 0,
    gender_distribution = [],
    userGrowth = [],
    postActivityByDay = []
  } = stats;
  
  console.log("Processed stats:", { 
    total_users, 
    new_users_today,
    total_posts,
    new_posts_today,
    total_comments_today,
    total_likes_today
  });
  
  return (
    <div className="admin-section">
      <h2>Thống kê hệ thống</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3><FaUsers className="stat-icon" /> Tổng người dùng</h3>
          <div className="stat-value">{total_users}</div>
        </div>
        
        <div className="stat-card">
          <h3><FaUserPlus className="stat-icon" /> Người dùng mới (hôm nay)</h3>
          <div className="stat-value">{new_users_today}</div>
        </div>
        
        <div className="stat-card">
          <h3><FaClipboard className="stat-icon" /> Tổng bài đăng</h3>
          <div className="stat-value">{total_posts}</div>
        </div>
        
        <div className="stat-card">
          <h3><FaFileUpload className="stat-icon" /> Bài đăng mới (hôm nay)</h3>
          <div className="stat-value">{new_posts_today}</div>
        </div>
        
        <div className="stat-card">
          <h3><FaComment className="stat-icon" /> Tổng bình luận (hôm nay)</h3>
          <div className="stat-value">{total_comments_today}</div>
        </div>
        
        <div className="stat-card">
          <h3><FaThumbsUp className="stat-icon" /> Tổng lượt thích (hôm nay)</h3>
          <div className="stat-value">{total_likes_today}</div>
        </div>
      </div>
      
      {userGrowth && userGrowth.length > 0 && (
        <div className="stat-chart">
          <h3>Biểu đồ tăng trưởng người dùng</h3>
          <div className="growth-bar-chart">
            {userGrowth.map((month, index) => (
              <div key={index} className="growth-bar-container">
                <div className="growth-bar-label">{month.label}</div>
                <div 
                  className="growth-bar" 
                  style={{ 
                    height: `${Math.min(month.value * 2, 200)}px`,
                    backgroundColor: `rgba(65, 105, 225, ${0.3 + (index / userGrowth.length) * 0.7})`
                  }}
                >
                  <span className="growth-bar-value">{month.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {postActivityByDay && postActivityByDay.length > 0 && (
        <div className="stat-chart">
          <h3>Hoạt động đăng bài theo ngày</h3>
          <div className="activity-chart">
            {postActivityByDay.map((day, index) => (
              <div key={index} className="activity-day">
                <div className="activity-day-label">{day.day}</div>
                <div 
                  className="activity-indicator"
                  style={{ 
                    height: `${Math.min(day.count * 5, 150)}px` 
                  }}
                >
                  <span className="activity-count">{day.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StateAdmin;