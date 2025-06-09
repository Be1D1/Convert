import React, { useState, useEffect } from 'react';
import './Header.css';
import Search from './Search';

function Header({ searchTerm, onSearchChange, onConverterSelect }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedConverter, setSelectedConverter] = useState(null);

  const formatOptions = {
  Операции: [
    { id: 'pdf-merge', label: '→ Объединение' },
    { id: 'pdf-delete-pages', label: '→ Удаление страниц' },
  ],
  pdf: [
    { id: 'pdf-docx', label: '→ DOCX' },
    { id: 'pdf-xlsx', label: '→ XLSX' },
    { id: 'pdf-pptx', label: '→ PPTX' },
    { id: 'pdf-html', label: '→ HTML' },
    { id: 'pdf-tiff', label: '→ TIFF' },
    { id: 'pdf-txt', label: '→ TXT' }
  ],
  docx: [
    { id: 'docx-pdf', label: '→ PDF' },
    { id: 'docx-html', label: '→ HTML' },
    { id: 'docx-txt', label: '→ TXT' },
    { id: 'docx-xml', label: '→ XML' },
    { id: 'docx-tiff', label: '→ TIFF' },
    { id: 'docx-odt', label: '→ ODT' }
  ],
  xlsx: [
    { id: 'xlsx-pdf', label: '→ PDF' },
    { id: 'xlsx-numbers', label: '→ NUMBERS' },
    { id: 'xlsx-csv', label: '→ CSV' }
  ],
  html: [
    { id: 'html-pdf', label: '→ PDF' },
    { id: 'html-odt', label: '→ ODT' },
    { id: 'html-jpg', label: '→ JPG' },
    { id: 'html-docx', label: '→ DOCX' },
    { id: 'html-png', label: '→ PNG' },
    { id: 'html-txt', label: '→ TXT' },
    { id: 'html-xlsx', label: '→ XLSX' },
    { id: 'html-xls', label: '→ XLS' },
    { id: 'html-md', label: '→ MD' }
  ],
  gif: [
    { id: 'gif-jpg', label: '→ JPG' },
    { id: 'gif-pdf', label: '→ PDF' },
    { id: 'gif-png', label: '→ PNG' },
    { id: 'gif-svg', label: '→ SVG' },
    { id: 'gif-tiff', label: '→ TIFF' }
  ],
  jpg: [
    { id: 'jpg-png', label: '→ PNG' },
    { id: 'jpg-gif', label: '→ GIF' },
    { id: 'jpg-pdf', label: '→ PDF' },
    { id: 'jpg-svg', label: '→ SVG' },
    { id: 'jpg-tiff', label: '→ TIFF' }
  ],
  png: [
    { id: 'png-gif', label: '→ GIF' },
    { id: 'png-jpg', label: '→ JPG' },
    { id: 'png-tiff', label: '→ TIFF' },
    { id: 'png-pdf', label: '→ PDF' },
    { id: 'png-svg', label: '→ SVG' }
  ],
  pptx: [
    { id: 'pptx-tiff', label: '→ TIFF' },
    { id: 'pptx-pdf', label: '→ PDF' }
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