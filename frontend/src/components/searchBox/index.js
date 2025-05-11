import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './style.scss';

const SearchBox = ({ placeholder = 'Tìm kiếm...' }) => (
  <div className="search-container">
    <div className="search-box">
      <FaSearch className="search-icon" />
      <input type="text" placeholder={placeholder} />
    </div>
  </div>
);

export default SearchBox;
