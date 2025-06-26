import { useState, useEffect } from "react";
import { getUserImages } from "../../api/userMediaApi";

export const useUserImages = (userId) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const imageList = await getUserImages(token, userId);
        setImages(imageList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userId]);

  return { images, loading, error };
};
