import "./style.scss";
import avatarDefault from "../../assets/images/default_avatar/default_avatar.jpg";
import { useCloudinaryFile } from "../../hooks/useCloudinaryFile";


export const AvatarUser = ({ user }) => {
  const fileUrl = user?.avatar
    ? `https://res.cloudinary.com/victor201/image/upload/${user.avatar}`
    : null;

  const BlobUrl = useCloudinaryFile(fileUrl);

  return (
    <img
      src={BlobUrl || avatarDefault}
      alt="avatar"
      className="avatar-user"
    />
  );
};

export default AvatarUser;

