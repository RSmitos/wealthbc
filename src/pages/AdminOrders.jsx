import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShoppingCart, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersData, usersData, productsData] = await Promise.all([
          base44.entities.Order.list('-created_date'),
          base44.entities.User.list(),
          base44.entities.Product.list()
        ]);
        setOrders(ordersData);
        setUsers(usersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getUserEmail = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Unknown';
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    paid: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    refunded: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="p-6 lg:p-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Orders</h1>
        <p className="text-slate-600">View and track all customer orders</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Status</label>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-64 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="animate-pulse">Loading orders...</div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50">
                  <TableCell>
                    <code className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {order.id.slice(0, 8)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">
                      {getUserEmail(order.user)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-slate-900">{getProductName(order.product)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    ${order.amount?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || statusColors.pending}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(order.created_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {statusFilter === 'all' ? 'No Orders Yet' : `No ${statusFilter} Orders`}
          </h3>
          <p className="text-slate-600">
            {statusFilter === 'all'
              ? 'Orders will appear here once customers start making purchases.'
              : `There are no orders with status "${statusFilter}".`}
          </p>
        </div>
      )}
    </div>
  );
}