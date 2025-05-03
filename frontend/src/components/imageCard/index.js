import { RiEdit2Fill } from "react-icons/ri";
import './style.scss';
const ImageCard = ({ image, alt = "Preview" }) => {
  return (
    <div className="image-card">
      <img src={image} alt={alt} className="image-card__image" />
      <span className="image-card__edit">
        <RiEdit2Fill className='edit-icon'/>
      </span>
    </div>
  );
};

export default ImageCard;
