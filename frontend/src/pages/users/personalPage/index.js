import { useState, useEffect, useRef } from "react";
import ProfileSection from "./modals/ProfileSection";
import PostsTab from "./modals/PostsTab";
import AboutTab from "./modals/AboutTab";
import { useUserInfo } from "../../../hooks/user";
import { useParams } from "react-router-dom";
import "./style.scss";
import { useAuth } from '../../../contexts/AuthContext';

const PersonalPage = () => {
  const {auth}= useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const tabsRef = useRef(null);
  const { userInfo, isLoading } = useUserInfo(); // Lấy thông tin người dùng từ hook
  const { user_name } = useParams(); // user đang đăng nhập

  const isOwner = auth.user_name === user_name; // Kiểm tra xem người dùng có phải là chủ sở hữu trang cá nhân không
  console.log("isOwner", auth.user_name, user_name, isOwner);
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
        if (window.scrollY > tabsRef.current.offsetTop - headerHeight) {
          tabsRef.current.classList.add("tabs--sticky");
          tabsRef.current.style.top = `${headerHeight}px`;
        } else {
          tabsRef.current.classList.remove("tabs--sticky");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!userInfo) {
    return <p className="loading-screen">⏳ Đang tải trang cá nhân...</p>;
  }

  return (
    <div className="container">
      <article className="personal-page">
        <main className="main">
          <ProfileSection
            tabsRef={tabsRef}
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            userInfo={userInfo}
            isOwner={isOwner}
          />
          <div className="tab-contents">
            {activeTab === "posts" && <PostsTab userInfo={userInfo} isOwner={isOwner} />}
            {activeTab === "about" && <AboutTab />}
          </div>
        </main>
      </article>
    </div>
  );
};

export default PersonalPage;
