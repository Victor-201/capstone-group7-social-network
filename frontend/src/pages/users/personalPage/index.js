import { useState, useEffect, useRef } from "react";
import ProfileSection from "./modals/ProfileSection";
import PostsTab from "./modals/PostsTab";
import AboutTab from "./modals/AboutTab";
import {useUserInfo} from '../../../hooks/user';
import "./style.scss";

const PersonalPage = () => {
  
  const [activeTab, setActiveTab] = useState("posts");
  const tabsRef = useRef(null);
  const { userInfo, error } = useUserInfo();
  console.log("User Info:", userInfo, "Error:", error);


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

  return (
    <div className="container">
      <article className="personal-page">
        <main className="main">
          <ProfileSection tabsRef={tabsRef} activeTab={activeTab} handleTabClick={handleTabClick} userInfo={userInfo} />
          <div className="tab-contents">
            {activeTab === "posts" && <PostsTab userInfo={userInfo}/>}
            {activeTab === "about" && <AboutTab  />}
          </div>
        </main>
      </article>
    </div>
  );
};

export default PersonalPage;