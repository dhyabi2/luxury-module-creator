
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Analytics = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    console.log('Fetching analytics data...');
    
    try {
      // For MVP, we're making direct Supabase calls without abstraction
      // In a real application, this should be replaced with actual API calls
      const { data: salesData, error: salesError } = await supabase
        .from('sales_by_month')
        .select('*')
        .order('month', { ascending: true });
      
      if (salesError) {
        console.error('Error fetching sales data:', salesError);
        throw salesError;
      }
      
      // Get summary statistics
      const { data: statsData, error: statsError } = await supabase
        .from('sales_stats')
        .select('*')
        .single();
      
      if (statsError) {
        console.error('Error fetching stats data:', statsError);
        throw statsError;
      }
      
      console.log('Analytics data fetched successfully');
      setSalesData(salesData || generateDummyData());
      
      // If we have stats data, use it; otherwise use placeholder values
      if (statsData) {
        setStats({
          totalSales: statsData.total_sales || 0,
          totalOrders: statsData.total_orders || 0,
          totalCustomers: statsData.total_customers || 0,
          averageOrderValue: statsData.average_order_value || 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      // For MVP, use dummy data if the API fails
      setSalesData(generateDummyData());
    } finally {
      setLoading(false);
    }
  };

  // Dummy data generator for MVP testing
  const generateDummyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 10000) + 1000,
      orders: Math.floor(Math.random() * 100) + 10
    }));
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-xl font-semibold">{value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Analytics Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Sales"
              value={`OMR ${stats.totalSales.toFixed(2)}`}
              icon={<TrendingUp size={24} />}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingBag size={24} />}
              color="bg-green-500"
            />
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={<Users size={24} />}
              color="bg-purple-500"
            />
            <StatCard
              title="Average Order Value"
              value={`OMR ${stats.averageOrderValue.toFixed(2)}`}
              icon={<CreditCard size={24} />}
              color="bg-orange-500"
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Monthly Sales</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Sales (OMR)" fill="#4f46e5" />
                  <Bar dataKey="orders" name="Orders" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
