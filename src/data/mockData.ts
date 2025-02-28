import { Supplier, Product, Order, Notification } from '../types';
import { format, addDays } from 'date-fns';

// Generate mock suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechComponents Inc.',
    contactPerson: 'John Smith',
    email: 'john@techcomponents.com',
    phone: '555-123-4567',
    address: '123 Tech Blvd, San Jose, CA 95123',
    category: 'Electronics',
    leadTime: 3,
    reliability: 4,
    active: true
  },
  {
    id: '2',
    name: 'Global Materials Ltd.',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@globalmaterials.com',
    phone: '555-987-6543',
    address: '456 Industry Way, Chicago, IL 60601',
    category: 'Raw Materials',
    leadTime: 5,
    reliability: 5,
    active: true
  },
  {
    id: '3',
    name: 'FastLogistics Co.',
    contactPerson: 'Michael Chen',
    email: 'michael@fastlogistics.com',
    phone: '555-456-7890',
    address: '789 Shipping Lane, Atlanta, GA 30301',
    category: 'Packaging',
    leadTime: 2,
    reliability: 3,
    active: true
  },
  {
    id: '4',
    name: 'Quality Parts Supply',
    contactPerson: 'Emma Wilson',
    email: 'emma@qualityparts.com',
    phone: '555-234-5678',
    address: '321 Manufacturing St, Detroit, MI 48201',
    category: 'Automotive',
    leadTime: 4,
    reliability: 4,
    active: true
  },
  {
    id: '5',
    name: 'EcoPackage Solutions',
    contactPerson: 'David Lee',
    email: 'david@ecopackage.com',
    phone: '555-876-5432',
    address: '567 Green Ave, Portland, OR 97201',
    category: 'Packaging',
    leadTime: 3,
    reliability: 4,
    active: false
  }
];

// Generate mock products
export const products: Product[] = [
  {
    id: '1',
    name: 'Microchip A1',
    sku: 'MC-A1-001',
    description: 'High-performance microchip for electronic devices',
    price: 12.99,
    category: 'Electronics',
    supplierId: '1',
    minStockLevel: 50,
    currentStock: 75,
    unitOfMeasure: 'piece'
  },
  {
    id: '2',
    name: 'Aluminum Sheet',
    sku: 'AL-SH-002',
    description: 'Industrial grade aluminum sheet, 2mm thickness',
    price: 45.50,
    category: 'Raw Materials',
    supplierId: '2',
    minStockLevel: 20,
    currentStock: 15,
    unitOfMeasure: 'sheet'
  },
  {
    id: '3',
    name: 'Cardboard Box (Medium)',
    sku: 'CB-MD-003',
    description: 'Medium-sized cardboard box for product packaging',
    price: 2.25,
    category: 'Packaging',
    supplierId: '3',
    minStockLevel: 100,
    currentStock: 230,
    unitOfMeasure: 'piece'
  },
  {
    id: '4',
    name: 'Brake Pad Set',
    sku: 'BP-ST-004',
    description: 'Standard brake pad set for passenger vehicles',
    price: 35.75,
    category: 'Automotive',
    supplierId: '4',
    minStockLevel: 30,
    currentStock: 28,
    unitOfMeasure: 'set'
  },
  {
    id: '5',
    name: 'Biodegradable Wrap',
    sku: 'BW-RL-005',
    description: 'Eco-friendly packaging wrap, 100m roll',
    price: 18.99,
    category: 'Packaging',
    supplierId: '5',
    minStockLevel: 40,
    currentStock: 42,
    unitOfMeasure: 'roll'
  },
  {
    id: '6',
    name: 'Circuit Board X3',
    sku: 'CB-X3-006',
    description: 'Advanced circuit board for smart devices',
    price: 28.50,
    category: 'Electronics',
    supplierId: '1',
    minStockLevel: 25,
    currentStock: 18,
    unitOfMeasure: 'piece'
  },
  {
    id: '7',
    name: 'Steel Rod 10mm',
    sku: 'SR-10-007',
    description: 'Industrial steel rod, 10mm diameter',
    price: 8.75,
    category: 'Raw Materials',
    supplierId: '2',
    minStockLevel: 60,
    currentStock: 85,
    unitOfMeasure: 'meter'
  }
];

// Generate mock orders
const today = new Date();

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    supplierId: '1',
    status: 'delivered',
    orderDate: format(addDays(today, -10), 'yyyy-MM-dd'),
    expectedDeliveryDate: format(addDays(today, -7), 'yyyy-MM-dd'),
    actualDeliveryDate: format(addDays(today, -7), 'yyyy-MM-dd'),
    items: [
      {
        id: '1-1',
        productId: '1',
        quantity: 100,
        unitPrice: 12.99,
        totalPrice: 1299
      }
    ],
    totalAmount: 1299,
    notes: 'Regular monthly order'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    supplierId: '2',
    status: 'shipped',
    orderDate: format(addDays(today, -5), 'yyyy-MM-dd'),
    expectedDeliveryDate: format(addDays(today, 0), 'yyyy-MM-dd'),
    items: [
      {
        id: '2-1',
        productId: '2',
        quantity: 30,
        unitPrice: 45.50,
        totalPrice: 1365
      },
      {
        id: '2-2',
        productId: '7',
        quantity: 50,
        unitPrice: 8.75,
        totalPrice: 437.5
      }
    ],
    totalAmount: 1802.5
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    supplierId: '3',
    status: 'confirmed',
    orderDate: format(addDays(today, -2), 'yyyy-MM-dd'),
    expectedDeliveryDate: format(addDays(today, 0), 'yyyy-MM-dd'),
    items: [
      {
        id: '3-1',
        productId: '3',
        quantity: 200,
        unitPrice: 2.25,
        totalPrice: 450
      }
    ],
    totalAmount: 450,
    notes: 'Urgent order for upcoming product launch'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-004',
    supplierId: '4',
    status: 'pending',
    orderDate: format(addDays(today, -1), 'yyyy-MM-dd'),
    expectedDeliveryDate: format(addDays(today, 3), 'yyyy-MM-dd'),
    items: [
      {
        id: '4-1',
        productId: '4',
        quantity: 25,
        unitPrice: 35.75,
        totalPrice: 893.75
      }
    ],
    totalAmount: 893.75
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-005',
    supplierId: '1',
    status: 'pending',
    orderDate: format(today, 'yyyy-MM-dd'),
    expectedDeliveryDate: format(addDays(today, 3), 'yyyy-MM-dd'),
    items: [
      {
        id: '5-1',
        productId: '6',
        quantity: 40,
        unitPrice: 28.50,
        totalPrice: 1140
      }
    ],
    totalAmount: 1140
  }
];

// Generate mock notifications
export const notifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Aluminum Sheet stock is below minimum level',
    timestamp: format(addDays(today, -1), 'yyyy-MM-dd HH:mm:ss'),
    read: false
  },
  {
    id: '2',
    type: 'info',
    message: 'Order ORD-2025-002 has been shipped',
    timestamp: format(addDays(today, -1), 'yyyy-MM-dd HH:mm:ss'),
    read: true
  },
  {
    id: '3',
    type: 'success',
    message: 'Order ORD-2025-001 has been delivered',
    timestamp: format(addDays(today, -3), 'yyyy-MM-dd HH:mm:ss'),
    read: true
  },
  {
    id: '4',
    type: 'error',
    message: 'Failed to connect with FastLogistics Co. API',
    timestamp: format(addDays(today, -2), 'yyyy-MM-dd HH:mm:ss'),
    read: false
  },
  {
    id: '5',
    type: 'warning',
    message: 'Circuit Board X3 stock is below minimum level',
    timestamp: format(today, 'yyyy-MM-dd HH:mm:ss'),
    read: false
  }
];