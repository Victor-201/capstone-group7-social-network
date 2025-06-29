import React, { useState } from "react";
import AccountsAdmin from "./accounts";
import PostsAdmin from "./posts";
import StateAdmin from "./state";
import { FaUserCog, FaFileAlt, FaChartBar } from "react-icons/fa";
import "./style.scss";

const actions = [
  {
    key: "accounts",
    title: "Quản lý tài khoản",
    desc: "Xem, chỉnh sửa, khóa tài khoản người dùng.",
    icon: <FaUserCog />
  },
  {
    key: "posts",
    title: "Quản lý bài đăng",
    desc: "Kiểm duyệt, xóa hoặc chỉnh sửa các bài đăng.",
    icon: <FaFileAlt />
  },
  {
    key: "state",
    title: "Thống kê truy cập",
    desc: "Xem biểu đồ số lượng người truy cập.",
    icon: <FaChartBar />
  }
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("state");

  const renderSection = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountsAdmin />;
      case "posts":
        return <PostsAdmin />;
      case "state":
        return <StateAdmin />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Trang quản trị</h1>

      <div className="admin-body">
        <div className="admin-sidebar">
          {["state", "posts", "accounts"].map((key) => {
            const action = actions.find((a) => a.key === key);
            return (
              <button
                key={action.key}
                className={`admin-switch-btn${activeSection === action.key ? " active" : ""}`}
                onClick={() => setActiveSection(action.key)}
              >
                <span className="admin-card-icon">{action.icon}</span>
                {action.title}
              </button>
            );
          })}
        </div>

        <div className="admin-content">{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
