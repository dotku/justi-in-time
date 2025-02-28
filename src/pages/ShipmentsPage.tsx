import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Truck, CheckCircle } from 'lucide-react';

const ShipmentsPage: React.FC = () => {
  const { orders, suppliers, updateOrder } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('shipped');
  
  // Get orders that are shipped or confirmed (in transit)
  const shipments = orders.filter(order => 
    order.status === 'shipped' || order.status === 'confirmed'
  );
  
  const filteredShipments = shipments
    .filter(shipment => 
      (searchTerm === '' || 
        shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(shipment => 
      filterStatus === 'all' || shipment.status === filterStatus
    )
    .sort((a, b) => new Date(a.expectedDeliveryDate).getTime() - new Date(b.expectedDeliveryDate).getTime());

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown';
  };

  const handleMarkAsDelivered = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      updateOrder({
        ...order,
        status: 'delivered',
        actualDeliveryDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const getDaysRemaining = (expectedDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expected = new Date(expectedDate);
    expected.setHours(0, 0, 0, 0);
    
    const diffTime = expected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getDeliveryStatusClass = (expectedDate: string) => {
    const daysRemaining = getDaysRemaining(expectedDate);
    
    if (daysRemaining < 0) {
      return 'text-red-600';
    } else if (daysRemaining === 0) {
      return 'text-amber-600';
    } else if (daysRemaining <= 2) {
      return 'text-amber-500';
    } else {
      return 'text-green-600';
    }
  };

  const getDeliveryStatusText = (expectedDate: string) => {
    const daysRemaining = getDaysRemaining(expectedDate);
    
    if (daysRemaining < 0) {
      return `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''}`;
    } else if (daysRemaining === 0) {
      return 'Due today';
    } else {
      return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shipments</h1>
        <p className="text-gray-600 mt-1">Track and manage incoming shipments</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search order number..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Shipments</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
            </select>
          </div>
        </div>

        {filteredShipments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Truck size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No shipments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-indigo-600">{shipment.orderNumber}</div>
                      <div className="text-xs text-gray-500">Ordered: {shipment.orderDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSupplierName(shipment.supplierId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        shipment.status === 'shipped' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.expectedDeliveryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getDeliveryStatusClass(shipment.expectedDeliveryDate)}`}>
                        {getDeliveryStatusText(shipment.expectedDeliveryDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleMarkAsDelivered(shipment.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-800 transition ease-in-out duration-150"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Mark as Delivered
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentsPage;