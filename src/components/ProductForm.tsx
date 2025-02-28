import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';

interface ProductFormProps {
  productId: string | null;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productId, onClose }) => {
  const { addProduct, updateProduct, getProductById, suppliers } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: 0,
    category: '',
    supplierId: '',
    minStockLevel: 0,
    currentStock: 0,
    unitOfMeasure: 'piece'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setFormData({
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: product.price,
          category: product.category,
          supplierId: product.supplierId,
          minStockLevel: product.minStockLevel,
          currentStock: product.currentStock,
          unitOfMeasure: product.unitOfMeasure
        });
      }
    } else if (suppliers.length > 0) {
      // Set default supplier for new products
      setFormData(prev => ({
        ...prev,
        supplierId: suppliers[0].id
      }));
    }
  }, [productId, getProductById, suppliers]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    
    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }
    
    if (formData.currentStock < 0) {
      newErrors.currentStock = 'Current stock cannot be negative';
    }
    
    if (!formData.unitOfMeasure.trim()) {
      newErrors.unitOfMeasure = 'Unit of measure is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (productId) {
      updateProduct({
        id: productId,
        ...formData
      });
    } else {
      addProduct(formData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {productId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU*
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-7 p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier*
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
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
                Minimum Stock Level*
              </label>
              <input
                type="number"
                name="minStockLevel"
                min="0"
                value={formData.minStockLevel}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.minStockLevel ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.minStockLevel && <p className="mt-1 text-sm text-red-500">{errors.minStockLevel}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock*
              </label>
              <input
                type="number"
                name="currentStock"
                min="0"
                value={formData.currentStock}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.currentStock ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.currentStock && <p className="mt-1 text-sm text-red-500">{errors.currentStock}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit of Measure*
              </label>
              <select
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.unitOfMeasure ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="piece">Piece</option>
                <option value="set">Set</option>
                <option value="box">Box</option>
                <option value="roll">Roll</option>
                <option value="meter">Meter</option>
                <option value="liter">Liter</option>
                <option value="kilogram">Kilogram</option>
                <option value="sheet">Sheet</option>
              </select>
              {errors.unitOfMeasure && <p className="mt-1 text-sm text-red-500">{errors.unitOfMeasure}</p>}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
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
              {productId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;