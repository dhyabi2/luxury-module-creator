
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ProductForm from './ProductForm';
import { AdminLayout } from './AdminLayout';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
