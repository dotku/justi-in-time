import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SupplierFormProps {
  supplierId: string | null;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplierId, onClose }) => {
  const { addSupplier, updateSupplier, getSupplierById } = useAppContext();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    leadTime: 1,
    reliability: 3,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (supplierId) {
      const supplier = getSupplierById(supplierId);
      if (supplier) {
        setFormData({
          name: supplier.name,
          contactPerson: supplier.contactPerson,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          category: supplier.category,
          leadTime: supplier.leadTime,
          reliability: supplier.reliability,
          active: supplier.active
        });
      }
    }
  }, [supplierId, getSupplierById]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('supplierName') + ' ' + t('isRequired');
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = t('contactPerson') + ' ' + t('isRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('email') + ' ' + t('isRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email') + ' ' + t('isInvalid');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('phone') + ' ' + t('isRequired');
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('address') + ' ' + t('isRequired');
    }
    
    if (!formData.category.trim()) {
      newErrors.category = t('category') + ' ' + t('isRequired');
    }
    
    if (formData.leadTime < 1) {
      newErrors.leadTime = t('leadTime') + ' ' + t('mustBeAtLeast') + ' 1 ' + t('day');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? Number(value) 
          : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (supplierId) {
      updateSupplier({
        id: supplierId,
        ...formData
      });
    } else {
      addSupplier(formData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {supplierId ? t('editSupplier') : t('addSupplier')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('supplierName')}*
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
                {t('contactPerson')}*
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contactPerson && <p className="mt-1 text-sm text-red-500">{errors.contactPerson}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')}*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('phone')}*
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('address')}*
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('category')}*
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
                {t('leadTime')} ({t('days')})*
              </label>
              <input
                type="number"
                name="leadTime"
                min="1"
                value={formData.leadTime}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.leadTime ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.leadTime && <p className="mt-1 text-sm text-red-500">{errors.leadTime}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('reliability')} (1-5)*
              </label>
              <select
                name="reliability"
                value={formData.reliability}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Below Average</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{t('active')} {t('supplier')}</span>
              </label>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
            >
              {supplierId ? t('update') : t('add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;