
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import Brands from './pages/Brands';
import NewIn from './pages/NewIn';
import Sale from './pages/Sale';
import StoreLocator from './pages/StoreLocator';
import NotFound from './pages/NotFound';
import Watches from './pages/Watches';
import Jewellery from './pages/Jewellery';
import Accessories from './pages/Accessories';
import Bags from './pages/Bags';
import Perfumes from './pages/Perfumes';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsConditions from './pages/TermsConditions';
import Returns from './pages/Returns';
import ShippingDelivery from './pages/ShippingDelivery';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { CartProvider } from './contexts/CartContext';
import { CartDrawer } from './modules/cart/components/CartDrawer';
import { Toaster } from 'sonner';

import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/women" element={<ProductCategory gender="women" />} />
          <Route path="/men" element={<ProductCategory gender="men" />} />
          <Route path="/brands/:brandId?" element={<Brands />} />
          <Route path="/new-in" element={<NewIn />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/stores" element={<StoreLocator />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/jewellery" element={<Jewellery />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/bags" element={<Bags />} />
          <Route path="/perfumes" element={<Perfumes />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<ShippingDelivery />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CartDrawer />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </Router>
  );
}

export default App;
