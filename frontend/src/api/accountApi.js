import { API_BASE_URL } from "../config/apiConfig";

// Đăng nhập
export const singin = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/public/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Đăng ký
export const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/public/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return await response.json();
};

// Đăng xuất
export const logout = async (token) => {
    const response = await fetch(`${API_BASE_URL}/public/logout`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Refresh token
export const refreshToken = async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/public/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
    const response = await fetch(`${API_BASE_URL}/public/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Reset mật khẩu
export const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new Error("Token and new password are both required");
    }
    
    const response = await fetch(`${API_BASE_URL}/public/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Xác minh OTP cho reset password
export const verifyOtp = async (email, otpCode) => {
    if (!email || !otpCode) {
        throw new Error("Email and OTP code are both required");
    }
    
    const response = await fetch(`${API_BASE_URL}/public/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp_code: otpCode }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};

// Xác thực email
export const verifyEmail = async (token) => {
    const response = await fetch(`${API_BASE_URL}/public/verify-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
};
