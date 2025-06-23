import "./style.scss";
import avatarDefault from "../../assets/images/default_avatar/default_avatar.jpg";
import { useCloudinaryFile } from "../../hooks/useCloudinaryFile";

export const AvatarUser = ({ user }) => {
  const blobUrl = useCloudinaryFile(user?.avatar, "image");

  return (
    <img
      src={blobUrl || avatarDefault}
      alt="avatar"
      className="avatar-user"
    />
  );
};

export default AvatarUser;
