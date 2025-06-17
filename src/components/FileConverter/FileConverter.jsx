import { useState, useCallback } from 'react';
import './FileConverter.css';

const FileConverter = ({ format, onConvert, onToggle, isActive, isLoading, darkMode }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [pages, setPages] = useState('');

    const processFiles = (selectedFiles) => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const oversized = Array.from(selectedFiles).some(file => file.size > 50 * 1024 * 1024);
        if (oversized) {
            onConvert('Некоторые файлы слишком большие. Максимальный размер: 50MB.');
            return;
        }

        const newFiles = format.multiple ? Array.from(selectedFiles) : [selectedFiles[0]];
        setFiles(newFiles);
        onConvert('');
    };

    const handleFileChange = (e) => processFiles(e.target.files);

    const handleDrag = useCallback((e, isEnter) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(isEnter);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    }, []);

    const handlePagesChange = (e) => {
        setPages(e.target.value);
    };

    const handleRemoveFile = (index) => (e) => {
        e.stopPropagation();
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleConvert = () => {
        if (format.minFiles && files.length < format.minFiles) {
            onConvert(`Пожалуйста, выберите хотя бы ${format.minFiles} файла`);
            return;
        }

        if (format.supportsPageRange && files.length === 1) {
            format.handler(files[0], pages);
        } else {
            format.handler(format.multiple ? files : files[0]);
        }
    };

    return (
        <div className={`converter-card ${isActive ? 'active' : ''} ${darkMode ? 'dark' : ''}`}>
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
                                multiple={format.multiple}
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <div
                                className={`upload-box ${isDragging ? 'dragging' : ''}`}
                                onDragEnter={(e) => handleDrag(e, true)}
                                onDragLeave={(e) => handleDrag(e, false)}
                                onDragOver={(e) => handleDrag(e, true)}
                                onDrop={handleDrop}
                            >
                                {files.length > 0 ? (
                                    <div className="files-list">
                                        {files.map((file, index) => (
                                            <div key={index} className="file-item">
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                                <button 
                                                    className="remove-file-btn"
                                                    onClick={handleRemoveFile(index)}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <span className="upload-icon">⬆️</span>
                                        <span>
                                            {format.multiple
                                                ? 'Перетащите файлы или нажмите для выбора'
                                                : 'Перетащите файл или нажмите для выбора'}
                                        </span>
                                        {format.multiple && format.minFiles && (
                                            <div className="min-files-hint">
                                                (минимум {format.minFiles} файла)
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </label>
                    </div>

                    {format.supportsPageRange && !format.multiple && (
                        <div className="page-range-input">
                            <label>Страницы (например: 1-3,5,7-10):</label>
                            <input
                                type="text"
                                value={pages}
                                onChange={handlePagesChange}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleConvert}
                        disabled={
                            isLoading ||
                            files.length === 0 ||
                            (format.minFiles && files.length < format.minFiles)
                        }
                        className={`convert-btn ${isLoading ? 'loading' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Идет обработка...</span>
                            </>
                        ) : (
                            format.buttonText || `Конвертировать в ${format.title.split(' в ')[1] || format.title}`
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileConverter;