import { FaUserFriends, BsMessenger } from "react-icons/fa";
import "./FriendCard.scss";

const FriendCard = ({ friendImage, index }) => {
  return (
    <div className="friend-card">
      <img src={friendImage} alt={`Friend ${index + 1}`} className="friend-card__avatar" />
      <div className="friend-card__info">
        <h3>Người bạn {index + 1}</h3>
        <p className="friend-card__mutual">
          <FaUserFriends className="small-icon" /> 5 bạn chung
        </p>
        <div className="friend-card__actions">
          <button className="btn btn--primary">
            <FaUserFriends /> Bạn bè
          </button>
          <button className="btn btn--secondary">
            <BsMessenger /> Nhắn tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;