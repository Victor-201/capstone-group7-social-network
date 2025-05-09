import { useState, useEffect, useRef } from "react";
import ProfileSection from "./modals/ProfileSection";
import PostsTab from "./modals/PostsTab";
import AboutTab from "./modals/AboutTab";
import "./style.scss";

const PersonalPage = () => {
  const user = {
    userName: "Văn Thắng",
    avatar: "cld-sample-5.jpg",
    cover: "cld-sample-4.jpg",
    friends: 100,
    followers: 200,
    following: 300,
  };
  const [activeTab, setActiveTab] = useState("posts");
  const tabsRef = useRef(null);


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
          <ProfileSection tabsRef={tabsRef} activeTab={activeTab} handleTabClick={handleTabClick} user={user} />
          <div className="tab-contents">
            {activeTab === "posts" && <PostsTab user={user}/>}
            {activeTab === "about" && <AboutTab  />}
          </div>
        </main>
      </article>
    </div>
  );
};

export default PersonalPage;