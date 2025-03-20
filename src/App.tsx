
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { CartProvider } from '@/modules/cart/context/CartContext';
import MainLayout from '@/modules/layout/MainLayout';
import IndexPage from '@/pages/Index';
import WatchesPage from '@/pages/Watches';
import JewelleryPage from '@/pages/Jewellery';
import BagsPage from '@/pages/Bags';
import AccessoriesPage from '@/pages/Accessories';
import PerfumesPage from '@/pages/Perfumes';
import ProductDetailPage from '@/pages/ProductDetail';
import ProductCategoryPage from '@/pages/ProductCategory';
import NewInPage from '@/pages/NewIn';
import BrandsPage from '@/pages/Brands';
import SalePage from '@/pages/Sale';
import AboutUsPage from '@/pages/AboutUs';
import ContactUsPage from '@/pages/ContactUs';
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';
import TermsConditionsPage from '@/pages/TermsConditions';
import ReturnsPage from '@/pages/Returns';
import ShippingDeliveryPage from '@/pages/ShippingDelivery';
import StoreLocatorPage from '@/pages/StoreLocator';
import NotFoundPage from '@/pages/NotFound';

import AdminRoutes from '@/modules/admin/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
              <Route index element={<IndexPage />} />
              <Route path="watches" element={<WatchesPage />} />
              <Route path="jewellery" element={<JewelleryPage />} />
              <Route path="bags" element={<BagsPage />} />
              <Route path="accessories" element={<AccessoriesPage />} />
              <Route path="perfumes" element={<PerfumesPage />} />
              <Route path="product/:productId" element={<ProductDetailPage />} />
              <Route path="category/:categoryId" element={<ProductCategoryPage gender="all" />} />
              <Route path="new-in" element={<NewInPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="sale" element={<SalePage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="contact-us" element={<ContactUsPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="terms-conditions" element={<TermsConditionsPage />} />
              <Route path="returns" element={<ReturnsPage />} />
              <Route path="shipping-delivery" element={<ShippingDeliveryPage />} />
              <Route path="store-locator" element={<StoreLocatorPage />} />
            </Route>

            <Route path="admin/*" element={<AdminRoutes />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
