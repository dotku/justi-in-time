export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  leadTime: number; // in days
  reliability: number; // 1-5 rating
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  category: string;
  supplierId: string;
  minStockLevel: number;
  currentStock: number;
  unitOfMeasure: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  supplierId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}