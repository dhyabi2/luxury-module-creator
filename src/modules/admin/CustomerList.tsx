
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CustomerList = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    console.log('Fetching customers...');
    
    try {
      // For MVP, we're using a direct Supabase call without abstractions
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      
      console.log('Customers fetched successfully:', data?.length);
      setCustomers(data || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Customer Management</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">Customer data will appear here once available.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    {customer.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {customer.phone || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{customer.orders_count || 0}</TableCell>
                  <TableCell>OMR {(customer.total_spent || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye size={14} />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
