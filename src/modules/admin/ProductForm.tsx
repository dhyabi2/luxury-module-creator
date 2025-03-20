
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Save } from 'lucide-react';

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    category: 'watches',
    currency: 'OMR',
    price: 0,
    discount: 0,
    stock: 0,
    rating: 0,
    reviews: 0,
    description: '',
    image: '',
    specifications: {
      caseMaterial: '',
      caseSize: '',
      dialColor: '',
      movement: '',
      waterResistance: '',
      strapMaterial: '',
      strapColor: '',
      gender: '',
    }
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    console.log('Fetching product details for ID:', id);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product details:', error);
        throw error;
      }
      
      console.log('Product details fetched successfully:', data);
      
      // Initialize specifications if they don't exist or aren't in expected format
      let specifications = {
        caseMaterial: '',
        caseSize: '',
        dialColor: '',
        movement: '',
        waterResistance: '',
        strapMaterial: '',
        strapColor: '',
        gender: '',
      };
      
      // If data.specifications exists and is an object, merge with default values
      if (data.specifications && typeof data.specifications === 'object') {
        specifications = {
          ...specifications,
          ...(data.specifications as Record<string, string>)
        };
      }
      
      setFormData({
        ...data,
        specifications
      });
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    
    try {
      // Prepare the product data
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
      };
      
      // Generate a unique ID for new products
      if (!isEditMode) {
        productData.id = `watch-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      console.log('Saving product data:', productData);
      
      let result;
      if (isEditMode) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
      } else {
        // Insert new product
        result = await supabase
          .from('products')
          .insert([productData]);
      }
      
      const { error } = result;
      
      if (error) {
        console.error('Error saving product:', error);
        throw error;
      }
      
      console.log('Product saved successfully');
      navigate('/admin');
    } catch (err) {
      console.error('Failed to save product:', err);
    } finally {
      setSavingProduct(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        <Button variant="outline" onClick={() => navigate('/admin')} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="watches">Watches</option>
                  <option value="luxury-watches">Luxury Watches</option>
                  <option value="smart-watches">Smart Watches</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-40 h-40 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Pricing and Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Pricing & Inventory</h3>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (OMR)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount || 0}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reviews">Review Count</Label>
                  <Input
                    id="reviews"
                    name="reviews"
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium border-b pb-2 mt-6">Watch Specifications</h3>
              
              <div className="space-y-2">
                <Label htmlFor="caseMaterial">Case Material</Label>
                <Input
                  id="caseMaterial"
                  name="caseMaterial"
                  value={formData.specifications.caseMaterial || ''}
                  onChange={handleSpecificationChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="caseSize">Case Size (mm)</Label>
                <Input
                  id="caseSize"
                  name="caseSize"
                  value={formData.specifications.caseSize || ''}
                  onChange={handleSpecificationChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dialColor">Dial Color</Label>
                  <Input
                    id="dialColor"
                    name="dialColor"
                    value={formData.specifications.dialColor || ''}
                    onChange={handleSpecificationChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="movement">Movement</Label>
                  <Input
                    id="movement"
                    name="movement"
                    value={formData.specifications.movement || ''}
                    onChange={handleSpecificationChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="waterResistance">Water Resistance</Label>
                <Input
                  id="waterResistance"
                  name="waterResistance"
                  value={formData.specifications.waterResistance || ''}
                  onChange={handleSpecificationChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="strapMaterial">Strap Material</Label>
                  <Input
                    id="strapMaterial"
                    name="strapMaterial"
                    value={formData.specifications.strapMaterial || ''}
                    onChange={handleSpecificationChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strapColor">Strap Color</Label>
                  <Input
                    id="strapColor"
                    name="strapColor"
                    value={formData.specifications.strapColor || ''}
                    onChange={handleSpecificationChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.specifications.gender || ''}
                  onChange={handleSpecificationChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button 
              type="submit"
              disabled={savingProduct}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {savingProduct ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
