import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Users, 
  ShoppingCart, 
  BarChart2, 
  Bell, 
  Menu, 
  X,
  Home
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import NotificationPanel from './NotificationPanel';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Layout: React.FC = () => {
  const location = useLocation();
  const { notifications } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { t } = useTranslation();
  
  const unreadNotifications = notifications.filter(notification => !notification.read);

  const navItems = [
    { path: '/', label: t('dashboard'), icon: <Home size={20} /> },
    { path: '/suppliers', label: t('suppliers'), icon: <Users size={20} /> },
    { path: '/products', label: t('products'), icon: <Package size={20} /> },
    { path: '/orders', label: t('orders'), icon: <ShoppingCart size={20} /> },
    { path: '/shipments', label: t('shipments'), icon: <Truck size={20} /> },
    { path: '/reports', label: t('reports'), icon: <BarChart2 size={20} /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-indigo-800 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed h-full`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          <h1 className={`font-bold text-xl ${isSidebarOpen ? 'block' : 'hidden'}`}>
            {t('appName')}
          </h1>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-indigo-700"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-4 ${
                    location.pathname === item.path
                      ? 'bg-indigo-700 border-l-4 border-white'
                      : 'hover:bg-indigo-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className={isSidebarOpen ? 'block' : 'hidden'}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => item.path === location.pathname)?.label || t('dashboard')}
            </h2>
            <div className="flex items-center">
              <LanguageSwitcher />
              <div className="relative ml-4">
                <button
                  onClick={toggleNotificationPanel}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                {isNotificationPanelOpen && (
                  <NotificationPanel onClose={toggleNotificationPanel} />
                )}
              </div>
              <div className="ml-4 flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;