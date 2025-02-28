import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Users, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { 
    suppliers, 
    products, 
    orders, 
    getLowStockProducts 
  } = useAppContext();
  const { t } = useTranslation();

  const activeSuppliers = suppliers.filter(supplier => supplier.active).length;
  const lowStockProducts = getLowStockProducts();
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('activeSuppliers')}</p>
            <p className="text-2xl font-semibold">{activeSuppliers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Package className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('products')}</p>
            <p className="text-2xl font-semibold">{products.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <ShoppingCart className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('pendingOrders')}</p>
            <p className="text-2xl font-semibold">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <Truck className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('shipmentsInTransit')}</p>
            <p className="text-2xl font-semibold">{shippedOrders}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            <h3 className="font-medium text-red-800">{t('lowStockAlerts')}</h3>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t('noLowStockAlerts')}</p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{t('sku')}: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-medium">{product.currentStock} / {product.minStockLevel}</p>
                      <p className="text-xs text-gray-500">{product.unitOfMeasure}s</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/products" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                {t('viewAllProducts')} →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center">
            <Clock className="text-indigo-500 mr-2" size={20} />
            <h3 className="font-medium text-indigo-800">{t('recentOrders')}</h3>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t('noRecentOrders')}</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(order => {
                  const supplier = suppliers.find(s => s.id === order.supplierId);
                  return (
                    <div key={order.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{supplier?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {t(order.status)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{order.orderDate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                {t('viewAllOrders')} →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="text-indigo-500 mr-2" size={20} />
          <h3 className="font-medium text-gray-800">{t('supplierPerformance')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('suppliers')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('leadTime')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reliability')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.slice(0, 5).map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                    <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {supplier.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {supplier.leadTime} {t('days')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-4 w-4 ${i < supplier.reliability ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.active ? t('active') : t('inactive')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link to="/suppliers" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            {t('viewAllSuppliers')} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;