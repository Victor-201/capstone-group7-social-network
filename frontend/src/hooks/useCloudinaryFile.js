import { useEffect, useState } from 'react';

export const useCloudinaryFile = (url) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    let objectUrl = null;

    const fetchBlob = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Tải file thất bại');
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        if (isMounted) setBlobUrl(objectUrl);
      } catch (err) {
        console.error('Lỗi khi tải file từ Cloudinary:', err);
      }
    };

    fetchBlob();

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return blobUrl;
};

export default useCloudinaryFile;
