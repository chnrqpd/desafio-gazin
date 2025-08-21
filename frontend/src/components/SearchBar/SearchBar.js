import { useState } from 'react';
import './SearchBar.scss';

const SearchBar = ({ onSearch, placeholder = "Buscar...", disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-group">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="search-input"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-btn"
            disabled={disabled}
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="search-btn"
          disabled={disabled}
        >
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;