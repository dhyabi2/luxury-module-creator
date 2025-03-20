
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import Brands from './pages/Brands';
import NewIn from './pages/NewIn';
import Sale from './pages/Sale';
import StoreLocator from './pages/StoreLocator';
import NotFound from './pages/NotFound';
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CartDrawer />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </Router>
  );
}

export default App;
