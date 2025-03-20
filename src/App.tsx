import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { CartProvider } from './modules/cart/CartContext';
import MainLayout from './layouts/MainLayout';
import IndexPage from './pages/IndexPage';
import WatchesPage from './pages/WatchesPage';
import JewelleryPage from './pages/JewelleryPage';
import BagsPage from './pages/BagsPage';
import AccessoriesPage from './pages/AccessoriesPage';
import PerfumesPage from './pages/PerfumesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductCategoryPage from './pages/ProductCategoryPage';
import NewInPage from './pages/NewInPage';
import BrandsPage from './pages/BrandsPage';
import SalePage from './pages/SalePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import ReturnsPage from './pages/ReturnsPage';
import ShippingDeliveryPage from './pages/ShippingDeliveryPage';
import StoreLocatorPage from './pages/StoreLocatorPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminRoutes from './modules/admin/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <Routes>
            {/* Existing routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<IndexPage />} />
              <Route path="watches" element={<WatchesPage />} />
              <Route path="jewellery" element={<JewelleryPage />} />
              <Route path="bags" element={<BagsPage />} />
              <Route path="accessories" element={<AccessoriesPage />} />
              <Route path="perfumes" element={<PerfumesPage />} />
              <Route path="product/:productId" element={<ProductDetailPage />} />
              <Route path="category/:categoryId" element={<ProductCategoryPage />} />
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

            {/* Admin Routes - New Addition */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
