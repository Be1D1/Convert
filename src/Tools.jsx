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
                `https://v2.convertapi.com/convert/pdf/to/merge?Secret=secret_KZTZ8nEF9oViP4GP`,
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
                    accept: '.pdf',
                    multiple: true,
                    minFiles: 2,
                    icon: '📂',  // Папка с файлами
                    description: 'Объедините несколько PDF файлов в один',
                    handler: handleMergePdf
                },
            ]
        },
        {
            name: 'PDF Конвертеры',
            formats: [
                { 
                    id: 'pdf-docx', 
                    title: 'PDF в DOCX', 
                    accept: '.pdf',
                    icon: '📑',  // Документ с загнутым уголком
                    handler: (file) => handleConvert('pdf/to/docx', 'docx', file)
                },
                { 
                    id: 'pdf-jpg', 
                    title: 'PDF в JPG', 
                    accept: '.pdf',
                    icon: '🖼️',  // Картина в рамке
                    handler: (file) => handleConvert('pdf/to/jpg', 'jpg', file)
                },
                { 
                    id: 'pdf-png', 
                    title: 'PDF в PNG', 
                    accept: '.pdf',
                    icon: '🏞️',  // Горный пейзаж
                    handler: (file) => handleConvert('pdf/to/png', 'png', file)
                },
                { 
                    id: 'pdf-csv', 
                    title: 'PDF в CSV', 
                    accept: '.pdf',
                    icon: '📊',  // Гистограмма
                    handler: (file) => handleConvert('pdf/to/csv', 'csv', file)
                },
                { 
                    id: 'pdf-xlsx', 
                    title: 'PDF в XLSX', 
                    accept: '.pdf',
                    icon: '📈',  // График роста
                    handler: (file) => handleConvert('pdf/to/xlsx', 'xlsx', file)
                },
                { 
                    id: 'pdf-pptx', 
                    title: 'PDF в PPTX', 
                    accept: '.pdf',
                    icon: '📽️',  // Проектор
                    handler: (file) => handleConvert('pdf/to/pptx', 'pptx', file)
                },
                { 
                    id: 'pdf-html', 
                    title: 'PDF в HTML', 
                    accept: '.pdf',
                    icon: '🖥️',  // Настольный компьютер
                    handler: (file) => handleConvert('pdf/to/html', 'html', file)
                },
                { 
                    id: 'pdf-svg', 
                    title: 'PDF в SVG', 
                    accept: '.pdf',
                    icon: '✏️',  // Карандаш
                    handler: (file) => handleConvert('pdf/to/svg', 'svg', file)
                },
                { 
                    id: 'pdf-tiff', 
                    title: 'PDF в TIFF', 
                    accept: '.pdf',
                    icon: '🖨️',  // Принтер
                    handler: (file) => handleConvert('pdf/to/tiff', 'tiff', file)
                },
                { 
                    id: 'pdf-txt', 
                    title: 'PDF в TXT', 
                    accept: '.pdf',
                    icon: '📝',  // Записка
                    handler: (file) => handleConvert('pdf/to/txt', 'txt', file)
                },
                { 
                    id: 'pdf-webp', 
                    title: 'PDF в WEBP', 
                    accept: '.pdf',
                    icon: '🌐',  // Глобус
                    handler: (file) => handleConvert('pdf/to/webp', 'webp', file)
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
                    icon: '📰',  // Газета
                    handler: (file) => handleConvert('docx/to/pdf', 'pdf', file)
                },
                { 
                    id: 'docx-jpg', 
                    title: 'DOCX в JPG', 
                    accept: '.docx',
                    icon: '🎨',  // Палитра художника
                    handler: (file) => handleConvert('docx/to/jpg', 'jpg', file)
                },
                { 
                    id: 'docx-html', 
                    title: 'DOCX в HTML', 
                    accept: '.docx',
                    icon: '💻',  // Ноутбук
                    handler: (file) => handleConvert('docx/to/html', 'html', file)
                },
                { 
                    id: 'docx-pages', 
                    title: 'DOCX в PAGES', 
                    accept: '.docx',
                    icon: '📓',  // Тетрадь
                    handler: (file) => handleConvert('docx/to/pages', 'pages', file)
                },
                { 
                    id: 'docx-txt', 
                    title: 'DOCX в TXT', 
                    accept: '.docx',
                    icon: '🗒️',  // Блокнот
                    handler: (file) => handleConvert('docx/to/txt', 'txt', file)
                },
                { 
                    id: 'docx-png', 
                    title: 'DOCX в PNG', 
                    accept: '.docx',
                    icon: '🖍️',  // Мелки
                    handler: (file) => handleConvert('docx/to/png', 'png', file)
                },
                { 
                    id: 'docx-webp', 
                    title: 'DOCX в WEBP', 
                    accept: '.docx',
                    icon: '🖱️',  // Компьютерная мышь
                    handler: (file) => handleConvert('docx/to/webp', 'webp', file)
                },
                { 
                    id: 'docx-xml', 
                    title: 'DOCX в XML', 
                    accept: '.docx',
                    icon: '📟',  // Пейджер
                    handler: (file) => handleConvert('docx/to/xml', 'xml', file)
                },
                { 
                    id: 'docx-xps', 
                    title: 'DOCX в XPS', 
                    accept: '.docx',
                    icon: '📠',  // Факс
                    handler: (file) => handleConvert('docx/to/xps', 'xps', file)
                },
                { 
                    id: 'docx-tiff', 
                    title: 'DOCX в TIFF', 
                    accept: '.docx',
                    icon: '🖩',  // Калькулятор
                    handler: (file) => handleConvert('docx/to/tiff', 'tiff', file)
                },
                { 
                    id: 'docx-odt', 
                    title: 'DOCX в ODT', 
                    accept: '.docx',
                    icon: '📋',  // Клипборд
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
                    icon: '🧾',  // Чек
                    handler: (file) => handleConvert('xlsx/to/pdf', 'pdf', file)
                },
                { 
                    id: 'xlsx-webp', 
                    title: 'XLSX в WEBP', 
                    accept: '.xlsx,.xls',
                    icon: '🖲️',  // Трекбол
                    handler: (file) => handleConvert('xlsx/to/webp', 'webp', file)
                },
                { 
                    id: 'xlsx-numbers', 
                    title: 'XLSX в NUMBERS', 
                    accept: '.xlsx,.xls',
                    icon: '🔢',  // Цифры
                    handler: (file) => handleConvert('xlsx/to/numbers', 'numbers', file)
                },
                { 
                    id: 'xlsx-csv', 
                    title: 'XLSX в CSV', 
                    accept: '.xlsx,.xls',
                    icon: '📜',  // Свиток
                    handler: (file) => handleConvert('xlsx/to/csv', 'csv', file)
                },
                { 
                    id: 'xlsx-jpg', 
                    title: 'XLSX в JPG', 
                    accept: '.xlsx,.xls',
                    icon: '🖌️',  // Кисть художника
                    handler: (file) => handleConvert('xlsx/to/jpg', 'jpg', file)
                },
                { 
                    id: 'xlsx-png', 
                    title: 'XLSX в PNG', 
                    accept: '.xlsx,.xls',
                    icon: '🎭',  // Театральные маски
                    handler: (file) => handleConvert('xlsx/to/png', 'png', file)
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
                    icon: '📰',  // Газета
                    handler: (file) => handleConvert('html/to/pdf', 'pdf', file)
                },
                { 
                    id: 'html-odt', 
                    title: 'HTML в ODT', 
                    accept: '.html,.htm',
                    icon: '📘',  // Синяя книга
                    handler: (file) => handleConvert('html/to/odt', 'odt', file)
                },
                { 
                    id: 'html-jpg', 
                    title: 'HTML в JPG', 
                    accept: '.html,.htm',
                    icon: '🖼️',  // Картина
                    handler: (file) => handleConvert('html/to/jpg', 'jpg', file)
                },
                { 
                    id: 'html-docx', 
                    title: 'HTML в DOCX', 
                    accept: '.html,.htm',
                    icon: '📙',  // Оранжевая книга
                    handler: (file) => handleConvert('html/to/docx', 'docx', file)
                },
                { 
                    id: 'html-png', 
                    title: 'HTML в PNG', 
                    accept: '.html,.htm',
                    icon: '🖍️',  // Мелки
                    handler: (file) => handleConvert('html/to/png', 'png', file)
                },
                { 
                    id: 'html-txt', 
                    title: 'HTML в TXT', 
                    accept: '.html,.htm',
                    icon: '📔',  // Тетрадь с обложкой
                    handler: (file) => handleConvert('html/to/txt', 'txt', file)
                },
                { 
                    id: 'html-xlsx', 
                    title: 'HTML в XLSX', 
                    accept: '.html,.htm',
                    icon: '📗',  // Зеленая книга
                    handler: (file) => handleConvert('html/to/xlsx', 'xlsx', file)
                },
                { 
                    id: 'html-xls', 
                    title: 'HTML в XLS', 
                    accept: '.html,.htm',
                    icon: '📕',  // Красная книга
                    handler: (file) => handleConvert('html/to/xls', 'xls', file)
                },
                { 
                    id: 'html-md', 
                    title: 'HTML в MD', 
                    accept: '.html,.htm',
                    icon: '📚',  // Книги
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
                    icon: '📷',  // Фотоаппарат
                    handler: (file) => handleConvert('gif/to/jpg', 'jpg', file)
                },
                { 
                    id: 'gif-pdf', 
                    title: 'GIF в PDF', 
                    accept: '.gif',
                    icon: '🎬',  // Киноклаппер
                    handler: (file) => handleConvert('gif/to/pdf', 'pdf', file)
                },
                { 
                    id: 'gif-png', 
                    title: 'GIF в PNG', 
                    accept: '.gif',
                    icon: '🎨',  // Палитра
                    handler: (file) => handleConvert('gif/to/png', 'png', file)
                },
                { 
                    id: 'gif-svg', 
                    title: 'GIF в SVG', 
                    accept: '.gif',
                    icon: '✒️',  // Перо
                    handler: (file) => handleConvert('gif/to/svg', 'svg', file)
                },
                { 
                    id: 'gif-tiff', 
                    title: 'GIF в TIFF', 
                    accept: '.gif',
                    icon: '🖋️',  // Ручка
                    handler: (file) => handleConvert('gif/to/tiff', 'tiff', file)
                },
                { 
                    id: 'gif-webp', 
                    title: 'GIF в WEBP', 
                    accept: '.gif',
                    icon: '📹',  // Видеокамера
                    handler: (file) => handleConvert('gif/to/webp', 'webp', file)
                }
            ]
        },
        {
            name: 'JPG Конвертеры',
            formats: [
                { 
                    id: 'jpg-png', 
                    title: 'JPG в PNG', 
                    accept: '.jpg,.jpeg',
                    icon: '🏙️',  // Городской пейзаж
                    handler: (file) => handleConvert('jpg/to/png', 'png', file)
                },
                { 
                    id: 'jpg-gif', 
                    title: 'JPG в GIF', 
                    accept: '.jpg,.jpeg',
                    icon: '🎥',  // Киноаппарат
                    handler: (file) => handleConvert('jpg/to/gif', 'gif', file)
                },
                { 
                    id: 'jpg-pdf', 
                    title: 'JPG в PDF', 
                    accept: '.jpg,.jpeg',
                    icon: '📸',  // Вспышка фотоаппарата
                    handler: (file) => handleConvert('jpg/to/pdf', 'pdf', file)
                },
                { 
                    id: 'jpg-svg', 
                    title: 'JPG в SVG', 
                    accept: '.jpg,.jpeg',
                    icon: '🖌️',  // Кисть
                    handler: (file) => handleConvert('jpg/to/svg', 'svg', file)
                },
                { 
                    id: 'jpg-tiff', 
                    title: 'JPG в TIFF', 
                    accept: '.jpg,.jpeg',
                    icon: '📐',  // Линейка
                    handler: (file) => handleConvert('jpg/to/tiff', 'tiff', file)
                },
                { 
                    id: 'jpg-webp', 
                    title: 'JPG в WEBP', 
                    accept: '.jpg,.jpeg',
                    icon: '🖱️',  // Компьютерная мышь
                    handler: (file) => handleConvert('jpg/to/webp', 'webp', file)
                }
            ]
        },
        {
            name: 'PNG Конвертеры',
            formats: [
                { 
                    id: 'png-gif', 
                    title: 'PNG в GIF', 
                    accept: '.png',
                    icon: '🎞️',  // Кинофильм
                    handler: (file) => handleConvert('png/to/gif', 'gif', file)
                },
                { 
                    id: 'png-jpg', 
                    title: 'PNG в JPG', 
                    accept: '.png',
                    icon: '🌅',  // Восход
                    handler: (file) => handleConvert('png/to/jpg', 'jpg', file)
                },
                { 
                    id: 'png-tiff', 
                    title: 'PNG в TIFF', 
                    accept: '.png',
                    icon: '🏜️',  // Пустыня
                    handler: (file) => handleConvert('png/to/tiff', 'tiff', file)
                },
                { 
                    id: 'png-pdf', 
                    title: 'PNG в PDF', 
                    accept: '.png',
                    icon: '🌄',  // Горы на рассвете
                    handler: (file) => handleConvert('png/to/pdf', 'pdf', file)
                },
                { 
                    id: 'png-svg', 
                    title: 'PNG в SVG', 
                    accept: '.png',
                    icon: '🖍️',  // Мелки
                    handler: (file) => handleConvert('png/to/svg', 'svg', file)
                },
                { 
                    id: 'png-webp', 
                    title: 'PNG в WEBP', 
                    accept: '.png',
                    icon: '🌉',  // Мост ночью
                    handler: (file) => handleConvert('png/to/webp', 'webp', file)
                }
            ]
        },
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