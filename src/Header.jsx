import React, { useState } from 'react';
import './Header.css';
import Search from './Search';

function Header({ searchTerm, onSearchChange, onConverterSelect }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const formatOptions = {
    pdf: [
      { id: 'pdf-docx', label: '→ DOCX' },
      { id: 'pdf-jpg', label: '→ JPG' }
    ],
    docx: [
      { id: 'docx-pdf', label: '→ PDF' },
      { id: 'docx-jpg', label: '→ JPG' }
    ],
    jpg: [
      { id: 'jpg-pdf', label: '→ PDF' },
      { id: 'jpg-docx', label: '→ DOCX' }
    ]
  };

  const handleMouseEnter = (format) => {
    setActiveDropdown(format);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleConverterSelect = (converterId) => {
    onConverterSelect(converterId);
    setActiveDropdown(null);
  };

  return (
    <header>
      <div className="header-content">
        <div className="format-menus">
          {Object.keys(formatOptions).map((format) => (
            <div 
              key={format} 
              className="format-menu"
              onMouseEnter={() => handleMouseEnter(format)}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`format-button ${activeDropdown === format ? 'active' : ''}`}
              >
                {format.toUpperCase()}
              </button>
              
              {activeDropdown === format && (
                <div className="dropdown-options">
                  {formatOptions[format].map((option) => (
                    <button
                      key={option.id}
                      className="dropdown-option"
                      onClick={() => handleConverterSelect(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="search-input">
          <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
      </div>
    </header>
  );
}

export default Header;