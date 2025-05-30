import { useState } from 'react';
import './Tools.css';
import FileConverter from './FileConverter';
import InfoBox from './InfoBox';
import Alert from './Alert';

const Tools = ({ searchTerm, selectedConverter }) => {
    const [activeContainer, setActiveContainer] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleConvert = async (endpoint, targetFormat, file) => {
        if (!file) {
            setMessage('Пожалуйста, выберите файл для конвертации.');
            return;
        }

        setIsLoading(true);
        setMessage(`Конвертация в ${targetFormat.toUpperCase()}...`);

        try {
            const formData = new FormData();
            formData.append('File', file);

            const response = await fetch(
                `https://v2.convertapi.com/convert/${endpoint}?Secret=secret_KZTZ8nEF9oViP4GP`,
                {
                    method: 'POST',
                    headers: { 'Accept': 'application/octet-stream' },
                    body: formData
                }
            );

            if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted_${Date.now()}.${targetFormat}`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        
            setMessage(`Файл успешно конвертирован в ${targetFormat.toUpperCase()}!`);
        } catch (error) {
            setMessage(`Ошибка: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleContainer = (formatId) => {
        setActiveContainer(activeContainer === formatId ? null : formatId);
        setMessage('');
    };

    const formatOptions = [
        { 
            id: 'pdf-docx', 
            title: 'PDF в DOCX', 
            accept: '.pdf',
            icon: '📄',
            handler: (file) => handleConvert('pdf/to/docx', 'docx', file)
        },
        { 
            id: 'docx-pdf', 
            title: 'DOCX в PDF', 
            accept: '.docx',
            icon: '📝',
            handler: (file) => handleConvert('docx/to/pdf', 'pdf', file)
        },
        { 
            id: 'docx-jpg', 
            title: 'DOCX в JPG', 
            accept: '.docx',
            icon: '🖼️',
            handler: (file) => handleConvert('docx/to/jpg', 'jpg', file)
        },
        { 
            id: 'pdf-jpg', 
            title: 'PDF в JPG', 
            accept: '.pdf',
            icon: '📸',
            handler: (file) => handleConvert('pdf/to/jpg', 'jpg', file)
        }
    ];
    
    const filteredFormats = selectedConverter 
        ? formatOptions.filter(format => format.id === selectedConverter)
        : formatOptions.filter(format => 
            format.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            format.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="tools-container">
            <div className="header">
                <h1>Конвертер документов</h1>
                <p className="subtitle">Быстрое преобразование файлов между разными форматами</p>
            </div>

            <div className="converter-grid">
                {filteredFormats.length > 0 ? (
                    filteredFormats.map((format) => (
                        <FileConverter
                            key={format.id}
                            format={format}
                            onConvert={setMessage}
                            onToggle={toggleContainer}
                            isActive={activeContainer === format.id}
                            isLoading={isLoading}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        {selectedConverter 
                            ? 'Выбранный конвертер не найден' 
                            : 'Нет результатов, соответствующих вашему запросу'}
                    </div>
                )}
            </div>

            <Alert message={message} />

            <InfoBox />
        </div>
    );
};

export default Tools;