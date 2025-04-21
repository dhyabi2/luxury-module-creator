
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Index from './pages/Index';
import Watches from './pages/Watches';
import Perfumes from './pages/Perfumes';
import Bags from './pages/Bags';
import Jewellery from './pages/Jewellery';
import Accessories from './pages/Accessories';
import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import Sale from './pages/Sale';
import NewIn from './pages/NewIn';
import Brands from './pages/Brands';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import StoreLocator from './pages/StoreLocator';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Returns from './pages/Returns';
import ShippingDelivery from './pages/ShippingDelivery';
import NotFound from './pages/NotFound';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCanceled from './pages/CheckoutCanceled';
import Tester from './pages/Tester';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';

import { CartProvider } from '@/contexts/CartContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { ThemeProvider } from '@/components/ui/theme-provider';

// Admin Routes
import AdminRoutes from './modules/admin/AdminRoutes';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/watches" element={<Watches />} />
              <Route path="/perfumes" element={<Perfumes />} />
              <Route path="/bags" element={<Bags />} />
              <Route path="/jewellery" element={<Jewellery />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/category/:categoryId" element={<ProductCategory />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/new-in" element={<NewIn />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping-delivery" element={<ShippingDelivery />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/tracking" element={<OrderTracking />} />
              <Route path="/tester" element={<Tester />} />
              <Route path="*" element={<NotFound />} />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
            <Toaster />
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
