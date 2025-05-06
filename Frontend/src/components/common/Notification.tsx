// components/common/Notification.tsx
import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // Durée en millisecondes avant la fermeture automatique (optionnel)
  onClose?: () => void; // Fonction à appeler lors de la fermeture manuelle (optionnel)
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer); // Nettoyage du timer au démontage du composant
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  let backgroundColorClass = 'bg-blue-100 border-blue-400 text-blue-700';
  let borderColorClass = 'border';

  switch (type) {
    case 'success':
      backgroundColorClass = 'bg-green-100 border-green-400 text-green-700';
      borderColorClass = 'border-green-400';
      break;
    case 'error':
      backgroundColorClass = 'bg-red-100 border-red-400 text-red-700';
      borderColorClass = 'border-red-400';
      break;
    case 'warning':
      backgroundColorClass = 'bg-yellow-100 border-yellow-400 text-yellow-700';
      borderColorClass = 'border-yellow-400';
      break;
    case 'info':
    default:
      break;
  }

  return (
    <div
      className={`p-4 rounded-md shadow-md ${backgroundColorClass} ${borderColorClass} border-l-4 flex items-center justify-between`}
    >
      <span className="flex-grow">{message}</span>
      {onClose && (
        <button onClick={handleClose} className="ml-4 font-bold text-gray-700 hover:text-gray-900 focus:outline-none">
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;