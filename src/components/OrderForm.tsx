import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Plus, Trash2 } from 'lucide-react';
import { OrderItem } from '../types';

interface OrderFormProps {
  orderId: string | null;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ orderId, onClose }) => {
  const { 
    addOrder, 
    updateOrder, 
    suppliers, 
    products, 
    getProductById,
    orders
  } = useAppContext();
  
  const emptyOrderItem: Omit<OrderItem, 'id'> = {
    productId: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  };
  
  const [formData, setFormData] = useState({
    supplierId: '',
    status: 'pending' as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date().toISOString().split('T')[0],
    actualDeliveryDate: '',
    items: [] as Array<OrderItem>,
    totalAmount: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (orderId) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setFormData({
          supplierId: order.supplierId,
          status: order.status,
          orderDate: order.orderDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          actualDeliveryDate: order.actualDeliveryDate || '',
          items: [...order.items],
          totalAmount: order.totalAmount,
          notes: order.notes || ''
        });
      }
    } else if (suppliers.length > 0) {
      // Set default supplier for new orders
      setFormData(prev => ({
        ...prev,
        supplierId: suppliers[0].id
      }));
    }
  }, [orderId, orders, suppliers]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newItemErrors: Record<string, Record<string, string>> = {};
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    
    if (!formData.orderDate) {
      newErrors.orderDate = 'Order date is required';
    }
    
    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = 'Expected delivery date is required';
    } else if (new Date(formData.expectedDeliveryDate) < new Date(formData.orderDate)) {
      newErrors.expectedDeliveryDate = 'Expected delivery date cannot be before order date';
    }
    
    if (formData.status === 'delivered' && !formData.actualDeliveryDate) {
      newErrors.actualDeliveryDate = 'Actual delivery date is required for delivered orders';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      formData.items.forEach((item, index) => {
        const itemError: Record<string, string> = {};
        
        if (!item.productId) {
          itemError.productId = 'Product is required';
        }
        
        if (item.quantity <= 0) {
          itemError.quantity = 'Quantity must be greater than 0';
        }
        
        if (Object.keys(itemError).length > 0) {
          newItemErrors[index] = itemError;
        }
      });
    }
    
    setErrors(newErrors);
    setItemErrors(newItemErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newItemErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `new-${Date.now()}`,
          ...emptyOrderItem
        }
      ]
    }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems)
    }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    
    if (name === 'productId') {
      const product = getProductById(value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          productId: value,
          unitPrice: product.price,
          totalPrice: product.price * newItems[index].quantity
        };
      }
    } else if (name === 'quantity') {
      const quantity = parseInt(value) || 0;
      newItems[index] = {
        ...newItems[index],
        quantity,
        totalPrice: newItems[index].unitPrice * quantity
      };
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotal(newItems)
    }));
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (orderId) {
      updateOrder({
        id: orderId,
        orderNumber: orders.find(o => o.id === orderId)?.orderNumber || '',
        ...formData
      });
    } else {
      addOrder(formData);
    }
    
    onClose();
  };

  const getProductOptions = () => {
    // If editing an order, show all products
    if (orderId) {
      return products;
    }
    
    // If creating a new order, filter products by selected supplier
    return products.filter(product => product.supplierId === formData.supplierId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {orderId ? 'Edit Order' : 'Create New Order'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier*
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                disabled={!!orderId} // Disable changing supplier when editing
                className={`w-full p-2 border rounded-md ${errors.supplierId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && <p className="mt-1 text-sm text-red-500">{errors.supplierId}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status*
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date*
              </label>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.orderDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.orderDate && <p className="mt-1 text-sm text-red-500">{errors.orderDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Delivery Date*
              </label>
              <input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.expectedDeliveryDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.expectedDeliveryDate && <p className="mt-1 text-sm text-red-500">{errors.expectedDeliveryDate}</p>}
            </div>
            
            {(formData.status === 'delivered' || formData.actualDeliveryDate) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Delivery Date{formData.status === 'delivered' ? '*' : ''}
                </label>
                <input
                  type="date"
                  name="actualDeliveryDate"
                  value={formData.actualDeliveryDate}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.actualDeliveryDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.actualDeliveryDate && <p className="mt-1 text-sm text-red-500">{errors.actualDeliveryDate}</p>}
              </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-800">Order Items*</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-indigo-600 text-white px-3 py-1 rounded-md flex items-center hover:bg-indigo-700 transition-colors text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Item
              </button>
            </div>
            
            {errors.items && <p className="mt-1 text-sm text-red-500 mb-2">{errors.items}</p>}
            
            <div className="bg-gray-50 rounded-md p-4">
              {formData.items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items added yet</p>
              ) : (
                <div className="space-y-4">
                  {formData.items.map((item, index) => {
                    const product = getProductById(item.productId);
                    return (
                      <div key={item.id} className="flex flex-wrap items-end gap-4 pb-4 border-b border-gray-200">
                        <div className="flex-grow min-w-[200px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product*
                          </label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, e)}
                            name="productId"
                            className={`w-full p-2 border rounded-md ${itemErrors[index]?.productId ? 'border-red-500' : 'border-gray-300'}`}
                          >
                            <option value="">Select a product</option>
                            {getProductOptions().map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name} (${product.price.toFixed(2)})
                              </option>
                            ))}
                          </select>
                          {itemErrors[index]?.productId && (
                            <p className="mt-1 text-sm text-red-500">{itemErrors[index].productId}</p>
                          )}
                        </div>
                        
                        <div className="w-24">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity*
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            name="quantity"
                            className={`w-full p-2 border rounded-md ${itemErrors[index]?.quantity ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {itemErrors[index]?.quantity && (
                            <p className="mt-1 text-sm text-red-500">{itemErrors[index].quantity}</p>
                          )}
                        </div>
                        
                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Price
                          </label>
                          <div className="p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                            ${item.unitPrice.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total
                          </label>
                          <div className="p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium">
                            ${item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                        
                        <div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="Remove Item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-end pt-2">
                    <div className="w-48">
                      <div className="flex justify-between font-medium">
                        <span>Total Amount:</span>
                        <span>${formData.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
            >
              {orderId ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;