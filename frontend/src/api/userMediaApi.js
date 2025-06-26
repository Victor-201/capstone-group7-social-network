import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = `${API_BASE_URL}/user`;

// Đổi avatar hoặc ảnh bìa
export const changeUserImage = async (token, file, imageType) => {
  const formData = new FormData();
  formData.append("media", file);

  const response = await fetch(`${BASE_URL}/${imageType}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
};

// ✅ Lấy danh sách ảnh của user theo userId
// Lấy danh sách ảnh của user theo userId
export const getUserImages = async (token, userId) => {
  if (!token) throw new Error("Token không hợp lệ.");
  if (!userId) throw new Error("Thiếu userId.");

  const response = await fetch(`${BASE_URL}/photos/${userId}`, {
    method: "GET", // 👈 Bổ sung dòng này cho rõ ràng
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Lỗi khi đọc dữ liệu ảnh.");
  }

  if (!response.ok) {
    throw new Error(data.message || `Lỗi server: ${response.status}`);
  }

  // ✅ Trường hợp trả về { images: [...] }
  if (data.images && Array.isArray(data.images)) {
    return data.images;
  }

  // ✅ Trường hợp trả về trực tiếp là mảng ảnh
  if (Array.isArray(data)) {
    return data;
  }

  throw new Error("Dữ liệu ảnh không đúng định dạng.");
};
