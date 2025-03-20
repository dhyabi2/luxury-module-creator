
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Package, Users, Settings, FileText, BarChart } from 'lucide-react';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === `/admin${path}` ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md fixed h-full">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">M&K Admin</h1>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-2">
              <Link to="/admin" className={`flex items-center gap-2 p-2 rounded-md ${isActive('/')}`}>
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/admin/products" className={`flex items-center gap-2 p-2 rounded-md ${isActive('/products')}`}>
                <Package size={18} />
                <span>Products</span>
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/admin/customers" className={`flex items-center gap-2 p-2 rounded-md ${isActive('/customers')}`}>
                <Users size={18} />
                <span>Customers</span>
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/admin/orders" className={`flex items-center gap-2 p-2 rounded-md ${isActive('/orders')}`}>
                <FileText size={18} />
                <span>Orders</span>
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/admin/analytics" className={`flex items-center gap-2 p-2 rounded-md ${isActive('/analytics')}`}>
                <BarChart size={18} />
                <span>Analytics</span>
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/admin/settings" className={`flex items-center gap-2 p-2 rounded-md ${isActive('/settings')}`}>
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {children}
      </div>
    </div>
  );
};
