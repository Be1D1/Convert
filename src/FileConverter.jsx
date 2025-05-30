import { useState, useCallback } from 'react';
import './FileConverter.css';

const FileConverter = ({ format, onConvert, onToggle, isActive, isLoading }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (selectedFile) => {
        if (!selectedFile) return;
        
        if (selectedFile.size > 50 * 1024 * 1024) {
            onConvert('Файл слишком большой. Максимальный размер: 50MB.');
            return;
        }
        
        setFile(selectedFile);
        onConvert('');
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        processFile(selectedFile);
    };

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    return (
        <div className={`converter-card ${isActive ? 'active' : ''}`}>
            <div className="card-header" onClick={() => onToggle(format.id)}>
                <span className="format-icon">{format.icon}</span>
                <h3>{format.title}</h3>
                <span className={`arrow ${isActive ? 'open' : ''}`}>▼</span>
            </div>
            
            {isActive && (
                <div className="card-content">
                    <div className="file-upload-area">
                        <label className="file-upload-label">
                            <input 
                                type="file" 
                                accept={format.accept} 
                                onChange={handleFileChange} 
                                className="file-input"
                            />
                            <div 
                                className={`upload-box ${isDragging ? 'dragging' : ''}`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                {file ? (
                                    <span className="file-info">
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </span>
                                ) : (
                                    <>
                                        <span className="upload-icon">⬆️</span>
                                        <span>Перетащите файл или нажмите для его выбора</span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                    
                    <button 
                        onClick={() => format.handler(file, onConvert)} 
                        disabled={isLoading || !file}
                        className={`convert-btn ${isLoading ? 'loading' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Идет конвертация...</span>
                            </>
                        ) : (
                            `Конвертировать в ${format.title.split(' в ')[1]}`
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileConverter;