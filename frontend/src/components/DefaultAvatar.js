import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const DefaultAvatar = ({ size = 40, color = "#1877f2" }) => {
  return (
    <FaUserCircle 
      size={size} 
      color={color}
      style={{ minWidth: size, minHeight: size }}
    />
  );
};

export default DefaultAvatar;