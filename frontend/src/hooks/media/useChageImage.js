import { useState } from "react";
import { changeUserImage } from "../../api/userMediaApi"; // cập nhật đường dẫn nếu khác

export const ChageUserImage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const token = localStorage.getItem("token");

  const handleChangeUserImage = async (file, imageType) => {
    setIsUploading(true);
    setError(null);
    try {
      const result = await changeUserImage(token, file, imageType);
      setUploadedData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    error,
    uploadedData,
    handleChangeUserImage,
  };
};
