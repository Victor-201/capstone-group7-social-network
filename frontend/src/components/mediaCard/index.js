import "./style.scss";
import { useState } from "react";
import { useCloudinaryFile } from "../../hooks/useCloudinaryFile";

export const MediaUser = ({ media_id, media_type, className = "media-user" }) => {
  const blobUrl = useCloudinaryFile(media_id, media_type);
  const [showImage, setShowImage] = useState(true);

  if (!showImage || !blobUrl) return <div className="media-error"></div>;

  return (
    <img
      src={blobUrl}
      alt="media"
      className={className}
      onError={() => setShowImage(false)}
    />
  );
};

export default MediaUser;
