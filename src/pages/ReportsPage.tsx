import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart2, PieChart, TrendingUp, Calendar } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { orders, suppliers, products } = useAppContext();
  const [reportType, setReportType] = useState<string>('supplier');
  
  // Calculate supplier performance metrics
  const supplierPerformance = suppliers.map(supplier => {
    const supplierOrders = orders.filter(order => order.supplierId === supplier.id);
    const totalOrders = supplierOrders.length;
    const deliveredOrders = supplierOrders.filter(order => order.status === 'delivered').length;
    const onTimeDeliveries = supplierOrders.filter(order => {
      if (order.status !== 'delivered' || !order.actualDeliveryDate) return false;
      return new Date(order.actualDeliveryDate) <= new Date(order.expectedDeliveryDate);
    }).length;
    
    const onTimeRate = totalOrders > 0 ? (onTimeDeliveries / totalOrders) * 100 : 0;
    const totalSpent = supplierOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      id: supplier.id,
      name: supplier.name,
      totalOrders,
      deliveredOrders,
      onTimeDeliveries,
      onTimeRate,
      totalSpent
    };
  }).sort((a, b) => b.totalOrders - a.totalOrders);

  // Calculate product order frequency
  const productOrderFrequency = products.map(product => {
    const orderItems = orders.flatMap(order => 
      order.items.filter(item => item.productId === product.id)
    );
    
    const totalOrdered = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalSpent = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      totalOrdered,
      totalSpent,
      currentStock: product.currentStock,
      minStockLevel: product.minStockLevel
    };
  }).sort((a, b) => b.totalOrdered - a.totalOrdered);

  // Calculate order status distribution
  const orderStatusCounts = {
    pending: orders.filter(order => order.status === 'pending').length,
    confirmed: orders.filter(order => order.status === 'confirmed').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length
  };

  // Calculate monthly order totals
  const getMonthlyOrderData = () => {
    const monthlyData: Record<string, { count: number, amount: number }> = {};
    
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { count: 0, amount: 0 };
      }
      
      monthlyData[monthYear].count += 1;
      monthlyData[monthYear].amount += order.totalAmount;
    });
    
    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const monthlyOrderData = getMonthlyOrderData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600 mt-1">Analyze your supply chain performance</p>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setReportType('supplier')}
              className={`px-4 py-2 rounded-md flex items-center ${
                reportType === 'supplier' 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp size={18} className="mr-2" />
              Supplier Performance
            </button>
            <button
              onClick={() => setReportType('product')}
              className={`px-4 py-2 rounded-md flex items-center ${
                reportType === 'product' 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart2 size={18} className="mr-2" />
              Product Analysis
            </button>
            <button
              onClick={() => setReportType('status')}
              className={`px-4 py-2 rounded-md flex items-center ${
                reportType === 'status' 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PieChart size={18} className="mr-2" />
              Order Status
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`px-4 py-2 rounded-md flex items-center ${
                reportType === 'monthly' 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar size={18} className="mr-2" />
              Monthly Trends
            </button>
          </div>
        </div>
      </div>

      {reportType === 'supplier' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Supplier Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    On-Time Rate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supplierPerformance.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {supplier.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {supplier.deliveredOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div 
                            className={`h-2.5 rounded-full ${
                              supplier.onTimeRate >= 90 ? 'bg-green-600' :
                              supplier.onTimeRate >= 75 ? 'bg-yellow-400' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${supplier.onTimeRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {supplier.onTimeRate.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      ${supplier.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'product' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Product Order Analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Ordered
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productOrderFrequency.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {product.totalOrdered}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className={`text-sm font-medium ${
                        product.currentStock <= product.minStockLevel 
                          ? 'text-red-600' 
                          : 'text-gray-700'
                      }`}>
                        {product.currentStock} / {product.minStockLevel}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      ${product.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'status' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Order Status Distribution</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="text-yellow-800 text-xl font-bold">{orderStatusCounts.pending}</div>
                <div className="text-yellow-600 text-sm">Pending</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-blue-800 text-xl font-bold">{orderStatusCounts.confirmed}</div>
                <div className="text-blue-600 text-sm">Confirmed</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="text-purple-800 text-xl font-bold">{orderStatusCounts.shipped}</div>
                <div className="text-purple-600 text-sm">Shipped</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="text-green-800 text-xl font-bold">{orderStatusCounts.delivered}</div>
                <div className="text-green-600 text-sm">Delivered</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="text-red-800 text-xl font-bold">{orderStatusCounts.cancelled}</div>
                <div className="text-red-600 text-sm">Cancelled</div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-700 mb-4">Status Distribution</h3>
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                {orders.length > 0 ? (
                  <>
                    <div 
                      className="h-full bg-yellow-400 float-left" 
                      style={{ width: `${(orderStatusCounts.pending / orders.length) * 100}%` }}
                      title={`Pending: ${orderStatusCounts.pending}`}
                    ></div>
                    <div 
                      className="h-full bg-blue-500 float-left" 
                      style={{ width: `${(orderStatusCounts.confirmed / orders.length) * 100}%` }}
                      title={`Confirmed: ${orderStatusCounts.confirmed}`}
                    ></div>
                    <div 
                      className="h-full bg-purple-500 float-left" 
                      style={{ width: `${(orderStatusCounts.shipped / orders.length) * 100}%` }}
                      title={`Shipped: ${orderStatusCounts.shipped}`}
                    ></div>
                    <div 
                      className="h-full bg-green-500 float-left" 
                      style={{ width: `${(orderStatusCounts.delivered / orders.length) * 100}%` }}
                      title={`Delivered: ${orderStatusCounts.delivered}`}
                    ></div>
                    <div 
                      className="h-full bg-red-500 float-left" 
                      style={{ width: `${(orderStatusCounts.cancelled / orders.length) * 100}%` }}
                      title={`Cancelled: ${orderStatusCounts.cancelled}`}
                    ></div>
                  </>
                ) : (
                  <div className="h-full bg-gray-300"></div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <div>0%</div>
                <div>100%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'monthly' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Monthly Order Trends</h2>
          </div>
          <div className="p-6">
            {monthlyOrderData.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No monthly data available</p>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Order Count by Month</h3>
                  <div className="h-64 flex items-end space-x-2">
                    {monthlyOrderData.map((data) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-indigo-500 rounded-t"
                          style={{ 
                            height: `${(data.count / Math.max(...monthlyOrderData.map(d => d.count))) * 100}%` 
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">{data.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Order Amount by Month</h3>
                  <div className="h-64 flex items-end space-x-2">
                    {monthlyOrderData.map((data) => (
                      <div key={`amount-${data.month}`} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-green-500 rounded-t"
                          style={{ 
                            height: `${(data.amount / Math.max(...monthlyOrderData.map(d => d.amount))) * 100}%` 
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">${data.amount.toFixed(0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;