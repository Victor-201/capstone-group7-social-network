import { FaBriefcase, FaHome } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import { BsPencil } from "react-icons/bs";
import "./style.scss";

const AboutTab = () => {
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
            <div className="about__card">
              <h3>Công việc</h3>
              <div className="about__item">
                <FaBriefcase className="about-icon" />
                <div className="about__text">
                  <p>
                    Làm việc tại <b>Truyền Thông Trùng Trung THPT Hàm Nghi</b>
                  </p>
                  <span>Từ 10 tháng 5, 2020 đến nay</span>
                </div>
                <button className="about__edit-btn" onClick={() => handleEditAction("chỉnh sửa công việc")}>
                  <BsPencil />
                </button>
              </div>
            </div>

            <div className="about__card">
              <h3>Học vấn</h3>
              <div className="about__item">
                <IoSchool className="about-icon" />
                <div className="about__text">
                  <p>
                    Đã học tại <strong>Trường THPT Hàm Nghi</strong>
                  </p>
                </div>
                <button className="about__edit-btn" onClick={() => handleEditAction("chỉnh sửa học vấn")}>
                  <BsPencil />
                </button>
              </div>
            </div>

            <div className="about__card">
              <h3>Nơi từng sống</h3>
              <div className="about__item">
                <FaHome className="about-icon" />
                <div className="about__text">
                  <p>
                    Sống tại <strong>Hương Khê, Hà Tĩnh, Việt Nam</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="about__card">
              <h3>Gia đình và mối quan hệ</h3>
              <div className="about__item">
                <FaHeart className="about-icon" />
                <div className="about__text">
                  <p>
                    <strong>Độc thân</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="about__card">
              <h3>Thông tin liên hệ và cơ bản</h3>
              <div className="about__item">
                <HiOutlineDocumentText className="about-icon" />
                <div className="about__text">
                  <p>036 624 1001</p>
                  <span>Di động</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTab;
