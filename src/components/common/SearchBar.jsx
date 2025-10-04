import React from 'react';

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;