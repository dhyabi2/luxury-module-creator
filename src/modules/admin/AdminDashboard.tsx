
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Users, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    console.log('Fetching dashboard data...');
    
    try {
      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (productsError) {
        console.error('Error fetching products count:', productsError);
      }
      
      // Fetch recent orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (ordersError) {
        console.error('Error fetching recent orders:', ordersError);
      }
      
      // Fetch dashboard stats
      const { data: statsData, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();
      
      if (statsError) {
        console.error('Error fetching dashboard stats:', statsError);
      }
      
      // Set the data
      setRecentOrders(ordersData || []);
      setStats({
        totalProducts: productsCount || 0,
        totalOrders: statsData?.total_orders || 0,
        totalCustomers: statsData?.total_customers || 0,
        totalRevenue: statsData?.total_revenue || 0
      });
      
      console.log('Dashboard data fetched successfully');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }: { title: string; value: string | number; icon: React.ReactNode; color: string; link: string }) => (
    <Link to={link} className="block">
      <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
          <div className="text-gray-400">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<Package size={24} />}
              color="border-blue-500"
              link="/admin/products"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingBag size={24} />}
              color="border-green-500"
              link="/admin/orders"
            />
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={<Users size={24} />}
              color="border-purple-500"
              link="/admin/customers"
            />
            <StatCard
              title="Total Revenue"
              value={`OMR ${stats.totalRevenue.toFixed(2)}`}
              icon={<TrendingUp size={24} />}
              color="border-orange-500"
              link="/admin/analytics"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Orders</h3>
                <Link to="/admin/orders" className="text-primary text-sm flex items-center">
                  View All <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent orders found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {recentOrders.map(order => (
                    <div key={order.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.order_number}</p>
                        <p className="text-sm text-gray-500">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">OMR {order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Quick Actions</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/admin/products/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Package size={16} className="mr-2" />
                    Add New Product
                  </Button>
                </Link>
                <Link to="/admin/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag size={16} className="mr-2" />
                    View Orders
                  </Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp size={16} className="mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Users size={16} className="mr-2" />
                    Store Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
