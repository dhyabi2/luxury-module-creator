
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import CustomerList from './CustomerList';
import OrderList from './OrderList';
import Analytics from './Analytics';
import Settings from './Settings';
import { AdminLayout } from './AdminLayout';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
