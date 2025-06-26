import "./style.scss";
import { useCloudinaryFile } from "../../hooks/useCloudinaryFile";

export const MediaUser = ({ media_id, media_type }) => {
  const blobUrl = useCloudinaryFile(media_id, media_type);
  return (
    <img
      src={blobUrl || ''}
      alt="media"
      className="media-user"
    />
  );
};

export default MediaUser;
