import './InfoBox.css';

const InfoBox = () => {
    return (
        <div className="info-box">
            <h4>Как это работает?</h4>
            <ol>
                <li>Выберите тип конвертации</li>
                <li>Загрузите ваш файл (до 50MB)</li>
                <li>Нажмите кнопку "Конвертировать"</li>
                <li>Скачайте преобразованный файл</li>
            </ol>
            
            <div className="tips">
                <h4>Подсказки:</h4>
                <ul>
                    <li>Все операции выполняются в вашем браузере, файлы не загружаются на сервер</li>
                    <li>Поддерживаемые форматы файлов:</li>
                    <ol>
                        <li>Документы: .pdf, .docx, .xlsx, .xls, .pptx</li>
                        <li>Веб-страницы: .html</li>
                        <li>Изображения: .jpg, .png, .gif</li>
                    </ol>
                </ul>
            </div>
        </div>
    );
};

export default InfoBox;