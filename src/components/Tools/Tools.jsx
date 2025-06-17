import { useState } from 'react';
import './Tools.css';
import FileConverter from '../FileConverter/FileConverter';
import InfoBox from '../InfoBox/InfoBox';
import Alert from '../Alert/Alert';


const Tools = ({ searchTerm, selectedConverter, darkMode }) => {
    const [activeContainer, setActiveContainer] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pageRange, setPageRange] = useState('');

    const onChangePage = (e) => {
        setPageRange(e.target.value)
    }

    const apiSecret = import.meta.env.VITE_CONVERTAPI_SECRET;
    const handleConvert = async (endpoint, targetFormat, file, pages = '') => {
        if (!file) {
            setMessage('Пожалуйста, выберите файл для конвертации.');
            return;
        }

        setIsLoading(true);
        setMessage(`Конвертация в ${targetFormat.toUpperCase()}...`);

        try {
            const formData = new FormData();
            formData.append('File', file);
            if (pages) {
                formData.append('PageRange', pages);
            }

            const response = await fetch(
            `https://v2.convertapi.com/convert/${endpoint}?Secret=${apiSecret}`,
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

    const handleDeletePages = async (file) => {
        if (!file) {
            setMessage('Пожалуйста, выберите PDF файл.');
            return;
        }

        if (!pageRange) {
            setMessage('Пожалуйста, укажите диапазон страниц для удаления.');
            return;
        }

        setIsLoading(true);
        setMessage(`Удаление страниц ${pageRange} из PDF...`);

        try {
            const formData = new FormData();
            formData.append('File', file);
            formData.append('PageRange', pageRange);

            const response = await fetch(
                `https://v2.convertapi.com/convert/pdf/to/delete-pages?Secret=${apiSecret}`,
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
            a.download = `pdf_without_pages_${pageRange}_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        
            setMessage(`Страницы ${pageRange} успешно удалены из PDF!`);
        } catch (error) {
            setMessage(`Ошибка: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleContainer = (formatId) => {
        setActiveContainer(activeContainer === formatId ? null : formatId);
        setMessage('');
        setPageRange('');
    };

    const handleMergePdf = async (files) => {
        if (!files || files.length < 2) {
            setMessage('Пожалуйста, выберите хотя бы 2 PDF файла для объединения.');
            return;
        }

        const invalidFiles = Array.from(files).filter(file => 
            !file.name.toLowerCase().endsWith('.pdf')
        );
        
        if (invalidFiles.length > 0) {
            setMessage('Пожалуйста, выберите только PDF файлы для объединения.');
            return;
        }

        setIsLoading(true);
        setMessage(`Объединение ${files.length} PDF файлов...`);

        try {
            const formData = new FormData();
            Array.from(files).forEach((file, index) => {
                formData.append(`Files[${index}]`, file);
            });

            const response = await fetch(
                `https://v2.convertapi.com/convert/pdf/to/merge?Secret=${apiSecret}`,
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
            a.download = `merged_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        
            setMessage(`Успешно объединено ${files.length} PDF файлов!`);
        } catch (error) {
            setMessage(`Ошибка при объединении: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
        const formatGroups = [
        {
            name: 'PDF Операции',
            formats: [
                {
                    id: 'pdf-merge',
                    title: 'Объединить PDF',
                    buttonText: 'Объединить PDF файлы',
                    accept: '.pdf',
                    multiple: true,
                    minFiles: 2,
                    icon: '📂',
                    description: 'Объедините несколько PDF файлов в один',
                    handler: handleMergePdf
                },
                {
                    id: 'pdf-delete-pages',
                    title: 'Удалить страницы из PDF',
                    buttonText: 'Удалить страницы',
                    icon: '✂️',
                    description: 'Удалите страницы из PDF файла',
                    handler: handleDeletePages,
                    showPageRangeInput: true
                }
            ]
        },
        {   
            name: 'PDF Конвертеры',
            formats: [
                { 
                    id: 'pdf-docx', 
                    title: 'PDF в DOCX', 
                    accept: '.pdf',
                    icon: '📑',
                    handler: (file) => handleConvert('pdf/to/docx', 'docx', file)
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
                    icon: '📽️',
                    handler: (file) => handleConvert('pdf/to/pptx', 'pptx', file)
                },
                { 
                    id: 'pdf-html', 
                    title: 'PDF в HTML', 
                    accept: '.pdf',
                    icon: '🖥️',
                    handler: (file) => handleConvert('pdf/to/html', 'html', file)
                },
                { 
                    id: 'pdf-tiff', 
                    title: 'PDF в TIFF', 
                    accept: '.pdf',
                    icon: '🖨️',
                    handler: (file) => handleConvert('pdf/to/tiff', 'tiff', file)
                },
                { 
                    id: 'pdf-txt', 
                    title: 'PDF в TXT', 
                    accept: '.pdf',
                    icon: '📝',
                    handler: (file) => handleConvert('pdf/to/txt', 'txt', file)
                },
            ]
        },
        {
            name: 'DOCX Конвертеры',
            formats: [
                { 
                    id: 'docx-pdf', 
                    title: 'DOCX в PDF', 
                    accept: '.docx',
                    icon: '📰',
                    handler: (file) => handleConvert('docx/to/pdf', 'pdf', file)
                },
                { 
                    id: 'docx-html', 
                    title: 'DOCX в HTML', 
                    accept: '.docx',
                    icon: '💻',
                    handler: (file) => handleConvert('docx/to/html', 'html', file)
                },
                { 
                    id: 'docx-txt', 
                    title: 'DOCX в TXT', 
                    accept: '.docx',
                    icon: '🗒️',
                    handler: (file) => handleConvert('docx/to/txt', 'txt', file)
                },
                { 
                    id: 'docx-xml', 
                    title: 'DOCX в XML', 
                    accept: '.docx',
                    icon: '📟',
                    handler: (file) => handleConvert('docx/to/xml', 'xml', file)
                },
                { 
                    id: 'docx-tiff', 
                    title: 'DOCX в TIFF', 
                    accept: '.docx',
                    icon: '🖩',
                    handler: (file) => handleConvert('docx/to/tiff', 'tiff', file)
                },
                { 
                    id: 'docx-odt', 
                    title: 'DOCX в ODT', 
                    accept: '.docx',
                    icon: '📋',
                    handler: (file) => handleConvert('docx/to/odt', 'odt', file)
                }
            ]
        },
        {
            name: 'Excel Конвертеры',
            formats: [
                { 
                    id: 'xlsx-pdf', 
                    title: 'XLSX в PDF', 
                    accept: '.xlsx,.xls',
                    icon: '🧾',
                    handler: (file) => handleConvert('xlsx/to/pdf', 'pdf', file)
                },
                { 
                    id: 'xlsx-numbers', 
                    title: 'XLSX в NUMBERS', 
                    accept: '.xlsx,.xls',
                    icon: '🔢',
                    handler: (file) => handleConvert('xlsx/to/numbers', 'numbers', file)
                },
                { 
                    id: 'xlsx-csv', 
                    title: 'XLSX в CSV', 
                    accept: '.xlsx,.xls',
                    icon: '📜',
                    handler: (file) => handleConvert('xlsx/to/csv', 'csv', file)
                },
                { 
                    id: 'xlsx-tiff', 
                    title: 'XLSX в TIFF', 
                    accept: '.xlsx,.xls',
                    icon: '📖',
                    handler: (file) => handleConvert('xlsx/to/tiff', 'tiff', file)
                },
                { 
                    id: 'xls-pdf', 
                    title: 'XLS в PDF', 
                    accept: '.xls',
                    icon: '📊',
                    handler: (file) => handleConvert('xls/to/pdf', 'pdf', file)
                },
                { 
                    id: 'xls-tiff', 
                    title: 'XLS в TIFF', 
                    accept: '.xls',
                    icon: '🖨️',
                    handler: (file) => handleConvert('xls/to/tiff', 'tiff', file)
                },
                { 
                    id: 'xls-xlsx', 
                    title: 'XLS в XLSX', 
                    accept: '.xls',
                    icon: '📈',
                    handler: (file) => handleConvert('xls/to/xlsx', 'xlsx', file)
                }
            ]
        },
        {
            name: 'Web Конвертеры',
            formats: [
                { 
                    id: 'html-pdf', 
                    title: 'HTML в PDF', 
                    accept: '.html,.htm',
                    icon: '📰',
                    handler: (file) => handleConvert('html/to/pdf', 'pdf', file)
                },
                { 
                    id: 'html-odt', 
                    title: 'HTML в ODT', 
                    accept: '.html,.htm',
                    icon: '📘',
                    handler: (file) => handleConvert('html/to/odt', 'odt', file)
                },
                { 
                    id: 'html-jpg', 
                    title: 'HTML в JPG', 
                    accept: '.html,.htm',
                    icon: '🖼️',
                    handler: (file) => handleConvert('html/to/jpg', 'jpg', file)
                },
                { 
                    id: 'html-docx', 
                    title: 'HTML в DOCX', 
                    accept: '.html,.htm',
                    icon: '📙',
                    handler: (file) => handleConvert('html/to/docx', 'docx', file)
                },
                { 
                    id: 'html-png', 
                    title: 'HTML в PNG', 
                    accept: '.html,.htm',
                    icon: '🖍️',
                    handler: (file) => handleConvert('html/to/png', 'png', file)
                },
                { 
                    id: 'html-txt', 
                    title: 'HTML в TXT', 
                    accept: '.html,.htm',
                    icon: '📔',
                    handler: (file) => handleConvert('html/to/txt', 'txt', file)
                },
                { 
                    id: 'html-xlsx', 
                    title: 'HTML в XLSX', 
                    accept: '.html,.htm',
                    icon: '📗',
                    handler: (file) => handleConvert('html/to/xlsx', 'xlsx', file)
                },
                { 
                    id: 'html-xls', 
                    title: 'HTML в XLS', 
                    accept: '.html,.htm',
                    icon: '📕',
                    handler: (file) => handleConvert('html/to/xls', 'xls', file)
                },
                { 
                    id: 'html-md', 
                    title: 'HTML в MD', 
                    accept: '.html,.htm',
                    icon: '📚',
                    handler: (file) => handleConvert('html/to/md', 'md', file)
                }
            ]
        },
        {
            name: 'GIF Конвертеры',
            formats: [
                { 
                    id: 'gif-jpg', 
                    title: 'GIF в JPG', 
                    accept: '.gif',
                    icon: '📷',
                    handler: (file) => handleConvert('gif/to/jpg', 'jpg', file)
                },
                { 
                    id: 'gif-pdf', 
                    title: 'GIF в PDF', 
                    accept: '.gif',
                    icon: '🎬',
                    handler: (file) => handleConvert('gif/to/pdf', 'pdf', file)
                },
                { 
                    id: 'gif-png', 
                    title: 'GIF в PNG', 
                    accept: '.gif',
                    icon: '🎨',
                    handler: (file) => handleConvert('gif/to/png', 'png', file)
                },
                { 
                    id: 'gif-svg', 
                    title: 'GIF в SVG', 
                    accept: '.gif',
                    icon: '✒️',
                    handler: (file) => handleConvert('gif/to/svg', 'svg', file)
                },
                { 
                    id: 'gif-tiff', 
                    title: 'GIF в TIFF', 
                    accept: '.gif',
                    icon: '🖋️',
                    handler: (file) => handleConvert('gif/to/tiff', 'tiff', file)
                },
            ]
        },
        {
            name: 'JPG Конвертеры',
            formats: [
                { 
                    id: 'jpg-png', 
                    title: 'JPG в PNG', 
                    accept: '.jpg,.jpeg',
                    icon: '🏙️',
                    handler: (file) => handleConvert('jpg/to/png', 'png', file)
                },
                { 
                    id: 'jpg-gif', 
                    title: 'JPG в GIF', 
                    accept: '.jpg,.jpeg',
                    icon: '🎥',
                    handler: (file) => handleConvert('jpg/to/gif', 'gif', file)
                },
                { 
                    id: 'jpg-pdf', 
                    title: 'JPG в PDF', 
                    accept: '.jpg,.jpeg',
                    icon: '📸',
                    handler: (file) => handleConvert('jpg/to/pdf', 'pdf', file)
                },
                { 
                    id: 'jpg-svg', 
                    title: 'JPG в SVG', 
                    accept: '.jpg,.jpeg',
                    icon: '🖌️',
                    handler: (file) => handleConvert('jpg/to/svg', 'svg', file)
                },
                { 
                    id: 'jpg-tiff', 
                    title: 'JPG в TIFF', 
                    accept: '.jpg,.jpeg',
                    icon: '📐',
                    handler: (file) => handleConvert('jpg/to/tiff', 'tiff', file)
                },
            ]
        },
        {
            name: 'PNG Конвертеры',
            formats: [
                { 
                    id: 'png-gif', 
                    title: 'PNG в GIF', 
                    accept: '.png',
                    icon: '🎞️',
                    handler: (file) => handleConvert('png/to/gif', 'gif', file)
                },
                { 
                    id: 'png-jpg', 
                    title: 'PNG в JPG', 
                    accept: '.png',
                    icon: '🌅',
                    handler: (file) => handleConvert('png/to/jpg', 'jpg', file)
                },
                { 
                    id: 'png-tiff', 
                    title: 'PNG в TIFF', 
                    accept: '.png',
                    icon: '🏜️',
                    handler: (file) => handleConvert('png/to/tiff', 'tiff', file)
                },
                { 
                    id: 'png-pdf', 
                    title: 'PNG в PDF', 
                    accept: '.png',
                    icon: '🌄',
                    handler: (file) => handleConvert('png/to/pdf', 'pdf', file)
                },
                { 
                    id: 'png-svg', 
                    title: 'PNG в SVG', 
                    accept: '.png',
                    icon: '🖍️',
                    handler: (file) => handleConvert('png/to/svg', 'svg', file)
                },
            ]
        },
        {
            name: 'PPTX Конвертеры',
            formats: [
                    { 
                    id: 'pptx-tiff', 
                    title: 'PPTX в TIFF', 
                    accept: '.pptx',
                    icon: '📧',
                    handler: (file) => handleConvert('pptx/to/tiff', 'tiff', file)
                },
                { 
                    id: 'pptx-pdf', 
                    title: 'PPTX в PDF', 
                    accept: '.pptx',
                    icon: '☑️',
                    handler: (file) => handleConvert('pptx/to/pdf', 'pdf', file)
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
         <div className={`tools-container ${darkMode ? 'dark-theme' : ''}`}>
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
                                    <div key={format.id}>
                                        <FileConverter
                                            format={format}
                                            onConvert={setMessage}
                                            onToggle={toggleContainer}
                                            isActive={activeContainer === format.id}
                                            isLoading={isLoading}
                                            darkMode={darkMode}
                                        />
                                        {format.showPageRangeInput && activeContainer === format.id && (
                                            <div className="page-range-input">
                                                <input
                                                    type="text"
                                                    placeholder="Пример: 1-5 или 1,3,5"
                                                    value={pageRange}
                                                    onChange={onChangePage}
                                                />
                                                <small>Укажите страницы для удаления (например: 1-10 или 1,3,5)</small>
                                            </div>
                                        )}
                                    </div>
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