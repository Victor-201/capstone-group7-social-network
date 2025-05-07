import "./style.scss";
import avatarDefault from "../../assets/images/default_avatar/default_avatar.jpg";
import { useCloudinaryFile } from "../../hooks/useCloudinaryFile";


export const AvatarUser = ({ user }) => {
  const fileUrl = `https://res.cloudinary.com/victor201/image/upload/${user.avatar}`;
  const BlobUrl = useCloudinaryFile(fileUrl);

  return (
    <img src={BlobUrl || avatarDefault} alt="avatar" className="avatar-user"/>
  );
};

export default AvatarUser;
