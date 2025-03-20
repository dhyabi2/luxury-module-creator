
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    console.log('Fetching products for admin dashboard...');
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data?.length);
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    console.log('Deleting product with ID:', id);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      console.log('Product deleted successfully');
      // Refresh the product list
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products Management</h2>
        <Link to="/admin/products/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Add New Product
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          <div className="mt-6">
            <Link to="/admin/products/new">
              <Button>Add New Product</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image || 'https://via.placeholder.com/50'} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>OMR {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <PenLine size={14} />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
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

export default ProductList;
