import React from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useAppContext();
  const { t } = useTranslation();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={18} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={18} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
      <div className="p-3 bg-indigo-800 text-white flex justify-between items-center">
        <h3 className="font-medium">{t('notifications')}</h3>
        <div className="flex items-center">
          <button 
            onClick={clearAllNotifications}
            className="text-xs mr-3 hover:underline"
          >
            {t('clearAll')}
          </button>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {t('noNotifications')}
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                notification.read ? 'opacity-60' : 'bg-indigo-50'
              }`}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(notification.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;