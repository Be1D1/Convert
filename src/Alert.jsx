import './Alert.css';

const Alert = ({ message }) => {
    if (!message) return null;
    
    return (
        <div className={`alert ${message.includes('Ошибка') ? 'error' : 'success'}`}>
            {message}
        </div>
    );
};

export default Alert;