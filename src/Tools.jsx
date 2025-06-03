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

    const formatGroups = [
        {
            name: 'PDF Конвертеры',
            icon: '📄',
            formats: [
                { 
                    id: 'pdf-docx', 
                    title: 'PDF в DOCX', 
                    accept: '.pdf',
                    icon: '📝',
                    handler: (file) => handleConvert('pdf/to/docx', 'docx', file)
                },
                { 
                    id: 'pdf-jpg', 
                    title: 'PDF в JPG', 
                    accept: '.pdf',
                    icon: '🖼️',
                    handler: (file) => handleConvert('pdf/to/jpg', 'jpg', file)
                },
                { 
                    id: 'pdf-png', 
                    title: 'PDF в PNG', 
                    accept: '.pdf',
                    icon: '🖼️',
                    handler: (file) => handleConvert('pdf/to/png', 'png', file)
                },
                { 
                    id: 'pdf-csv', 
                    title: 'PDF в CSV', 
                    accept: '.pdf',
                    icon: '📊',
                    handler: (file) => handleConvert('pdf/to/csv', 'csv', file)
                },
                { 
                    id: 'pdf-xlsx', 
                    title: 'PDF в XLSX', 
                    accept: '.pdf',
                    icon: '📈',
                    handler: (file) => handleConvert('pdf/to/xlsx', 'xlsx', file)
                },
                { 
                    id: 'pdf-pptx', 
                    title: 'PDF в PPTX', 
                    accept: '.pdf',
                    icon: '📊',
                    handler: (file) => handleConvert('pdf/to/pptx', 'pptx', file)
                },
                { 
                    id: 'pdf-html', 
                    title: 'PDF в HTML', 
                    accept: '.pdf',
                    icon: '🌐',
                    handler: (file) => handleConvert('pdf/to/html', 'html', file)
                },
                { 
                    id: 'pdf-svg', 
                    title: 'PDF в SVG', 
                    accept: '.pdf',
                    icon: '🖌️',
                    handler: (file) => handleConvert('pdf/to/svg', 'svg', file)
                },
                { 
                    id: 'pdf-tiff', 
                    title: 'PDF в TIFF', 
                    accept: '.pdf',
                    icon: '🏞️',
                    handler: (file) => handleConvert('pdf/to/tiff', 'tiff', file)
                },
                { 
                    id: 'pdf-txt', 
                    title: 'PDF в TXT', 
                    accept: '.pdf',
                    icon: '📝',
                    handler: (file) => handleConvert('pdf/to/txt', 'txt', file)
                },
                { 
                    id: 'pdf-webp', 
                    title: 'PDF в WEBP', 
                    accept: '.pdf',
                    icon: '🖼️',
                    handler: (file) => handleConvert('pdf/to/webp', 'webp', file)
                }
            ]
        },
        {
            name: 'DOCX Конвертеры',
            icon: '📝',
            formats: [
                { 
                    id: 'docx-pdf', 
                    title: 'DOCX в PDF', 
                    accept: '.docx',
                    icon: '📄',
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
                    id: 'docx-html', 
                    title: 'DOCX в HTML', 
                    accept: '.docx',
                    icon: '🌐',
                    handler: (file) => handleConvert('docx/to/html', 'html', file)
                },
                { 
                    id: 'docx-pages', 
                    title: 'DOCX в PAGES', 
                    accept: '.docx',
                    icon: '📑',
                    handler: (file) => handleConvert('docx/to/pages', 'pages', file)
                },
                { 
                    id: 'docx-txt', 
                    title: 'DOCX в TXT', 
                    accept: '.docx',
                    icon: '📝',
                    handler: (file) => handleConvert('docx/to/txt', 'txt', file)
                },
                { 
                    id: 'docx-png', 
                    title: 'DOCX в PNG', 
                    accept: '.docx',
                    icon: '🖼️',
                    handler: (file) => handleConvert('docx/to/png', 'png', file)
                },
                { 
                    id: 'docx-webp', 
                    title: 'DOCX в WEBP', 
                    accept: '.docx',
                    icon: '🖼️',
                    handler: (file) => handleConvert('docx/to/webp', 'webp', file)
                },
                { 
                    id: 'docx-xml', 
                    title: 'DOCX в XML', 
                    accept: '.docx',
                    icon: '</>',
                    handler: (file) => handleConvert('docx/to/xml', 'xml', file)
                },
                { 
                    id: 'docx-xps', 
                    title: 'DOCX в XPS', 
                    accept: '.docx',
                    icon: '📄',
                    handler: (file) => handleConvert('docx/to/xps', 'xps', file)
                },
                { 
                    id: 'docx-tiff', 
                    title: 'DOCX в TIFF', 
                    accept: '.docx',
                    icon: '🏞️',
                    handler: (file) => handleConvert('docx/to/tiff', 'tiff', file)
                },
                { 
                    id: 'docx-odt', 
                    title: 'DOCX в ODT', 
                    accept: '.docx',
                    icon: '📝',
                    handler: (file) => handleConvert('docx/to/odt', 'odt', file)
                }
            ]
        },
        {
            name: 'Excel Конвертеры',
            icon: '📊',
            formats: [
                { 
                    id: 'xlsx-pdf', 
                    title: 'XLSX в PDF', 
                    accept: '.xlsx,.xls',
                    icon: '📄',
                    handler: (file) => handleConvert('xlsx/to/pdf', 'pdf', file)
                },
                { 
                    id: 'xlsx-webp', 
                    title: 'XLSX в WEBP', 
                    accept: '.xlsx,.xls',
                    icon: '🖼️',
                    handler: (file) => handleConvert('xlsx/to/webp', 'webp', file)
                },
                { 
                    id: 'xlsx-numbers', 
                    title: 'XLSX в NUMBERS', 
                    accept: '.xlsx,.xls',
                    icon: '📊',
                    handler: (file) => handleConvert('xlsx/to/numbers', 'numbers', file)
                },
                { 
                    id: 'xlsx-csv', 
                    title: 'XLSX в CSV', 
                    accept: '.xlsx,.xls',
                    icon: '📝',
                    handler: (file) => handleConvert('xlsx/to/csv', 'csv', file)
                },
                { 
                    id: 'xlsx-jpg', 
                    title: 'XLSX в JPG', 
                    accept: '.xlsx,.xls',
                    icon: '🖼️',
                    handler: (file) => handleConvert('xlsx/to/jpg', 'jpg', file)
                },
                { 
                    id: 'xlsx-png', 
                    title: 'XLSX в PNG', 
                    accept: '.xlsx,.xls',
                    icon: '🖼️',
                    handler: (file) => handleConvert('xlsx/to/png', 'png', file)
                }
            ]
        },
        {
            name: 'Web Конвертеры',
            icon: '🌐',
            formats: [
                { 
                    id: 'html-pdf', 
                    title: 'HTML в PDF', 
                    accept: '.html,.htm',
                    icon: '📄',
                    handler: (file) => handleConvert('html/to/pdf', 'pdf', file)
                }
            ]
        }
    ];

     const getFilteredGroups = () => {
        if (selectedConverter) {
            return formatGroups.map(group => ({
                ...group,
                formats: group.formats.filter(format => format.id === selectedConverter)
            })).filter(group => group.formats.length > 0);
        }

        if (searchTerm) {
            return formatGroups.map(group => ({
                ...group,
                formats: group.formats.filter(format => 
                    format.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    format.id.toLowerCase().includes(searchTerm.toLowerCase())
                )
            })).filter(group => group.formats.length > 0);
        }

        return formatGroups;
    };

    const filteredGroups = getFilteredGroups();

    return (
        <div className="tools-container">
            <div className="header">
                <h1>Конвертер документов</h1>
                <p className="subtitle">Быстрое преобразование файлов между разными форматами</p>
            </div>

            <div className="alert-container">
                <Alert message={message} />
            </div>

            <div className="converter-groups">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                        <div key={group.name} className="converter-group">
                            <h2 className="group-title">
                                <span className="group-icon">{group.icon}</span>
                                {group.name}
                            </h2>
                            <div className="converter-grid">
                                {group.formats.map((format) => (
                                    <FileConverter
                                        key={format.id}
                                        format={format}
                                        onConvert={setMessage}
                                        onToggle={toggleContainer}
                                        isActive={activeContainer === format.id}
                                        isLoading={isLoading}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        {selectedConverter 
                            ? 'Выбранный конвертер не найден' 
                            : 'Нет результатов, соответствующих вашему запросу'}
                    </div>
                )}
            </div>

            <InfoBox />
        </div>
    );
};

export default Tools;