import { useEffect, useState } from "react";
import { FaBriefcase, FaHome, FaHeart } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsPencil } from "react-icons/bs";
import "./style.scss";
import { getUserInfo } from "../../../../../api/userApi";

const AboutTab = ({ userInfo, isOwner }) => {
  const [profileDetails, setProfileDetails] = useState({});
  const [bio, setBio] = useState("");

  const getVisible = (field, data) =>
    data?.ProfileDetails?.visibleFields?.find((f) => f.field_name === field)?.is_visible ?? true;

  const loadProfileDetails = async () => {
    const token = localStorage.getItem("token");
    const data = await getUserInfo(token);

    setBio(data?.bio || "");
    setProfileDetails({
      job: getVisible("job", data) ? data?.ProfileDetails?.job : null,
      education: getVisible("education", data) ? data?.ProfileDetails?.education : null,
      location: getVisible("location", data) ? data?.ProfileDetails?.location : null,
      hometown: getVisible("hometown", data) ? data?.ProfileDetails?.hometown : null,
      relationship_status: getVisible("relationship_status", data) ? data?.ProfileDetails?.relationship_status : null,
      phone: data?.phone || "Không có số điện thoại",
    });
  };

  useEffect(() => {
    loadProfileDetails();
  }, []);

  const handleEditAction = (action) => {
    alert(`Tính năng ${action} đang được phát triển!`);
  };

  return (
    <section id="about" className="tab-content tab-content--active">
      <div className="about">
        <div className="about__sidebar">
          <ul className="about__nav">
            {[
              { id: "about-overview", label: "Tổng quan", active: true },
              { id: "about-work", label: "Công việc và học vấn" },
              { id: "about-places", label: "Nơi từng sống" },
              { id: "about-contact", label: "Thông tin liên hệ và cơ bản" },
              { id: "about-family", label: "Gia đình và mối quan hệ" },
              { id: "about-details", label: "Chi tiết về bạn" },
            ].map((item) => (
              <li
                key={item.id}
                className={`about__nav-item ${item.active ? "about__nav-item--active" : ""}`}
              >
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="about__content">
          <div id="about-overview" className="about__section about__section--active">
            {profileDetails.job && (
              <div className="about__card">
                <h3>Công việc</h3>
                <div className="about__item">
                  <FaBriefcase className="about-icon" />
                  <div className="about__text">
                    <p>Làm việc tại <strong>{profileDetails.job}</strong></p>
                  </div>
                  {isOwner && (
                    <button className="about__edit-btn" onClick={() => handleEditAction("chỉnh sửa công việc")}>
                      <BsPencil />
                    </button>
                  )}
                </div>
              </div>
            )}

            {profileDetails.education && (
              <div className="about__card">
                <h3>Học vấn</h3>
                <div className="about__item">
                  <IoSchool className="about-icon" />
                  <div className="about__text">
                    <p>Đã học tại <strong>{profileDetails.education}</strong></p>
                  </div>
                  {isOwner && (
                    <button className="about__edit-btn" onClick={() => handleEditAction("chỉnh sửa học vấn")}>
                      <BsPencil />
                    </button>
                  )}
                </div>
              </div>
            )}

            {(profileDetails.location || profileDetails.hometown) && (
              <div className="about__card">
                <h3>Nơi từng sống</h3>
                {profileDetails.location && (
                  <div className="about__item">
                    <FaHome className="about-icon" />
                    <div className="about__text">
                      <p>Sống tại <strong>{profileDetails.location}</strong></p>
                    </div>
                  </div>
                )}
                {profileDetails.hometown && (
                  <div className="about__item">
                    <FaHome className="about-icon" />
                    <div className="about__text">
                      <p>Đến từ <strong>{profileDetails.hometown}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {profileDetails.relationship_status && (
              <div className="about__card">
                <h3>Gia đình và mối quan hệ</h3>
                <div className="about__item">
                  <FaHeart className="about-icon" />
                  <div className="about__text">
                    <p><strong>
                      {profileDetails.relationship_status === "single"
                        ? "Độc thân"
                        : profileDetails.relationship_status === "in_a_relationship"
                        ? "Đang hẹn hò"
                        : profileDetails.relationship_status === "engaged"
                        ? "Đã đính hôn"
                        : "Đã kết hôn"}
                    </strong></p>
                  </div>
                </div>
              </div>
            )}

            {profileDetails.phone && (
              <div className="about__card">
                <h3>Thông tin liên hệ và cơ bản</h3>
                <div className="about__item">
                  <HiOutlineDocumentText className="about-icon" />
                  <div className="about__text">
                    <p>{profileDetails.phone}</p>
                    <span>Di động</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTab;
