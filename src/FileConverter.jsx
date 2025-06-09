import { useState, useCallback } from 'react';
import './FileConverter.css';

const FileConverter = ({ format, onConvert, onToggle, isActive, isLoading }) => {
const [files, setFiles] = useState([]);
const [isDragging, setIsDragging] = useState(false);
const [pages, setPages] = useState(''); // Новое состояние для диапазона страниц

const processFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const oversizedFiles = Array.from(selectedFiles).filter(
        file => file.size > 50 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
        onConvert('Некоторые файлы слишком большие. Максимальный размер: 50MB.');
        return;
    }

    const filesToSet = format.multiple ? Array.from(selectedFiles) : [selectedFiles[0]];
    setFiles(filesToSet);
    onConvert('');
};

const handleFileChange = (event) => {
    processFiles(event.target.files);
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

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
        processFiles(droppedFiles);
    }
}, []);

const handleConvert = () => {
    if (format.minFiles && files.length < format.minFiles) {
        onConvert(`Пожалуйста, выберите хотя бы ${format.minFiles} файла`);
        return;
    }

    if (format.isSplitOperation) {
        // Обработка разделения PDF (если используется)
        return;
    }

    // Если формат поддерживает PageRange и выбран один файл
    if (format.supportsPageRange && files.length === 1) {
        format.handler(files[0], pages); // Передаём pages
    } else {
        format.handler(format.multiple ? files : files[0]);
    }
};

const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
};

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
                            multiple={format.multiple}
                        />
                        <div
                            className={`upload-box ${isDragging ? 'dragging' : ''}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {files.length > 0 ? (
                                <div className="files-list">
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            <span className="file-info">
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            </span>
                                            {format.multiple && (
                                                <button
                                                    className="remove-file-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(index);
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <span className="upload-icon">⬆️</span>
                                    <span>
                                        {format.multiple
                                            ? "Перетащите файлы или нажмите для выбора"
                                            : "Перетащите файл или нажмите для выбора"}
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

                {/* Поле для ввода диапазона страниц */}
                {format.supportsPageRange && !format.multiple && (
                    <div className="page-range-input">
                        <label>Страницы (например: 1-3,5,7-10):</label>
                        <input
                            type="text"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
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
                        format.buttonText ||
                        (format.isSplitOperation
                            ? 'Разделить PDF'
                            : `Конвертировать в ${format.title.split(' в ')[1]}`)
                    )}
                </button>
            </div>
        )}
    </div>
);
};

export default FileConverter;