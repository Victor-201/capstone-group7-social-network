import { useEffect, useState } from 'react';
import { loadMediaCloud } from '../api/cloudApi';

export const useCloudinaryFile = (mediaId, mediaType) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!mediaId) return;

    let isMounted = true;
    let objectUrl = null;

    const fetchFile = async () => {
      try {
        const res = await loadMediaCloud(mediaId, mediaType); 
        const blob = await res.blob();                      
        objectUrl = URL.createObjectURL(blob);              
        if (isMounted) setBlobUrl(objectUrl);
      } catch (err) {
        console.error('Lỗi khi tải file từ Cloudinary:', err);
      }
    };

    fetchFile();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mediaId, mediaType]);

  return blobUrl;
};

export default useCloudinaryFile;
