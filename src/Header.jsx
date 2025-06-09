import React, { useState, useEffect } from 'react';
import './Header.css';
import Search from './Search';

function Header({ searchTerm, onSearchChange, onConverterSelect }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedConverter, setSelectedConverter] = useState(null);

  const formatOptions = {
    pdf: [
      { id: 'pdf-docx', label: '→ DOCX' },
      { id: 'pdf-jpg', label: '→ JPG' },
      { id: 'pdf-png', label: '→ PNG' },
      { id: 'pdf-csv', label: '→ CSV' },
      { id: 'pdf-xlsx', label: '→ XLSX' },
      { id: 'pdf-pptx', label: '→ PPTX' },
      { id: 'pdf-html', label: '→ HTML' },
      { id: 'pdf-svg', label: '→ SVG' },
      { id: 'pdf-tiff', label: '→ TIFF' },
      { id: 'pdf-txt', label: '→ TXT' },
      { id: 'pdf-webp', label: '→ WEBP' }
    ],
    docx: [
      { id: 'docx-pdf', label: '→ PDF' },
      { id: 'docx-jpg', label: '→ JPG' },
      { id: 'docx-html', label: '→ HTML' },
      { id: 'docx-pages', label: '→ PAGES' },
      { id: 'docx-txt', label: '→ TXT' },
      { id: 'docx-png', label: '→ PNG' },
      { id: 'docx-webp', label: '→ WEBP' },
      { id: 'docx-xml', label: '→ XML' },
      { id: 'docx-xps', label: '→ XPS' },
      { id: 'docx-tiff', label: '→ TIFF' },
      { id: 'docx-odt', label: '→ ODT' }
    ],
    xlsx: [
      { id: 'xlsx-pdf', label: '→ PDF' },
      { id: 'xlsx-webp', label: '→ WEBP' },
      { id: 'xlsx-numbers', label: '→ NUMBERS' },
      { id: 'xlsx-csv', label: '→ CSV' },
      { id: 'xlsx-jpg', label: '→ JPG' },
      { id: 'xlsx-png', label: '→ PNG' }
    ],
    html: [
      { id: 'html-pdf', label: '→ PDF' }
    ]
  };

  const handleMouseEnter = (format) => {
    setActiveDropdown(format);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleConverterSelect = (converterId) => {
    setSelectedConverter(converterId);
    onConverterSelect(converterId);
    onSearchChange('');
    setActiveDropdown(null);
  };


  useEffect(() => {
    if (searchTerm && selectedConverter) {
      setSelectedConverter(null);
      onConverterSelect(null);
    }
  }, [searchTerm, selectedConverter, onConverterSelect]);

  const handleSearchChange = (e) => {
    onSearchChange(e);
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
          <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        </div>
      </div>
    </header>
  );
}

export default Header;