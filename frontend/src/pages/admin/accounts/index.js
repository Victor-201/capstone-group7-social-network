import React, { useState, useEffect } from "react";
import { getAllUsers, changeUserStatus } from "../../../api/adminApi";
import { useAuth } from "../../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { FaLock, FaLockOpen, FaSpinner } from "react-icons/fa";

const AccountsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!auth || !auth.token) {
        setError("Vui lòng đăng nhập");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getAllUsers(auth.token);
        
        // Debug để xem cấu trúc dữ liệu
        console.log("Users API Response:", response);
        
        if (Array.isArray(response)) {
          const formattedUsers = response.map(user => {
            // Kiểm tra nếu đã có UserInfo nhúng hoặc ở root level
            const userInfo = user.userInfo || user;
            
            return {
              id: user.id,
              username: user.user_name || '',
              email: user.email || '',
              status: user.status || 'active',
              created_at: user.created_at || '',
              role: user.role || 'user',
              // Thêm các trường từ userInfo nếu có
              display_name: userInfo?.full_name || user.user_name || '',
              full_name: userInfo?.full_name || '',
              avatar: userInfo?.avatar || '',
            };
          });
          setUsers(formattedUsers);
        } else {
          console.error("Cấu trúc dữ liệu không đúng:", response);
          setUsers([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [auth]);
  
  const handleStatusChange = async (userId, currentStatus) => {
    if (!auth || !auth.token) {
      setError("Vui lòng đăng nhập");
      return;
    }
    
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await changeUserStatus(auth.token, userId, newStatus);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
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
      <h2>Quản lý tài khoản</h2>
      
      <div className="admin-table-container">
        {Array.isArray(users) && users.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Tên hiển thị</th>
                <th>Email</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id || Math.random()} className={user.status !== 'active' ? 'inactive-row' : ''}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.display_name || user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : ''}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`status-toggle-btn ${user.status === 'active' ? 'lock' : 'unlock'}`}
                      onClick={() => handleStatusChange(user.id, user.status)}
                    >
                      {user.status === 'active' ? <><FaLock /> Khóa</> : <><FaLockOpen /> Mở khóa</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-no-data">
            Không có tài khoản nào để hiển thị
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsAdmin;