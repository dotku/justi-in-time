import React, { createContext, useContext, useState, useEffect } from 'react';
import { Supplier, Product, Order, Notification } from '../types';
import { suppliers as mockSuppliers, products as mockProducts, orders as mockOrders, notifications as mockNotifications } from '../data/mockData';

interface AppContextType {
  suppliers: Supplier[];
  products: Product[];
  orders: Order[];
  notifications: Notification[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber'>) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  getSupplierById: (id: string) => Supplier | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsBySupplier: (supplierId: string) => Product[];
  getOrdersBySupplier: (supplierId: string) => Order[];
  getLowStockProducts: () => Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Supplier operations
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = {
      ...supplier,
      id: Date.now().toString(),
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === updatedSupplier.id ? updatedSupplier : supplier
    ));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  // Product operations
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Order operations
  const addOrder = (order: Omit<Order, 'id' | 'orderNumber'>) => {
    const orderCount = orders.length + 1;
    const year = new Date().getFullYear();
    const orderNumber = `ORD-${year}-${orderCount.toString().padStart(3, '0')}`;
    
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      orderNumber,
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  // Notification operations
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper functions
  const getSupplierById = (id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsBySupplier = (supplierId: string) => {
    return products.filter(product => product.supplierId === supplierId);
  };

  const getOrdersBySupplier = (supplierId: string) => {
    return orders.filter(order => order.supplierId === supplierId);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.currentStock <= product.minStockLevel);
  };

  // Check for low stock and create notifications
  useEffect(() => {
    const lowStockProducts = getLowStockProducts();
    
    lowStockProducts.forEach(product => {
      const existingNotification = notifications.find(
        notification => notification.message.includes(product.name) && notification.type === 'warning'
      );
      
      if (!existingNotification) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'warning',
          message: `${product.name} stock is below minimum level`,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    });
  }, [products]);

  return (
    <AppContext.Provider
      value={{
        suppliers,
        products,
        orders,
        notifications,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        deleteOrder,
        markNotificationAsRead,
        clearAllNotifications,
        getSupplierById,
        getProductById,
        getProductsBySupplier,
        getOrdersBySupplier,
        getLowStockProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};