// useLogout.js
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    alert("Đăng xuất thành công!");
    navigate('/login');
  };

  return logout;
};

export default useLogout;
