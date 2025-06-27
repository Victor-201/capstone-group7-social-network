import React, { useState } from "react";
import AccountsAdmin from "./accounts";
import PostsAdmin from "./posts";
import StateAdmin from "./state";
import "./style.scss";

const actions = [
  {
    key: "accounts",
    title: "Quản lý tài khoản",
    desc: "Xem, chỉnh sửa, khóa tài khoản người dùng.",
    icon: "👤"
  },
  {
    key: "posts",
    title: "Quản lý bài đăng",
    desc: "Kiểm duyệt, xóa hoặc chỉnh sửa các bài đăng.",
    icon: "📝"
  },
  {
    key: "state",
    title: "Thống kê truy cập",
    desc: "Xem biểu đồ số lượng người truy cập.",
    icon: "📊"
  }
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("accounts");

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
      <h1>Trang quản trị</h1>
      <section className="admin-actions-switch">
        {actions.map((action) => (
          <button
            key={action.key}
            className={`admin-switch-btn${activeSection === action.key ? " active" : ""}`}
            onClick={() => setActiveSection(action.key)}
          >
            <span className="admin-card-icon">{action.icon}</span>
            {action.title}
          </button>
        ))}
      </section>
      <div className="admin-section-content">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;