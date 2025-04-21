
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Index from '@/pages/Index'
import ProductDetail from '@/pages/ProductDetail'
import ProductCategory from '@/pages/ProductCategory'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout' 
import CheckoutSuccess from '@/pages/CheckoutSuccess'
import CheckoutCanceled from '@/pages/CheckoutCanceled'
import OrderTracking from '@/pages/OrderTracking'
import AboutUs from '@/pages/AboutUs'
import ContactUs from '@/pages/ContactUs'
import NotFound from '@/pages/NotFound'
import Watches from '@/pages/Watches'
import Jewellery from '@/pages/Jewellery'
import Bags from '@/pages/Bags'
import Perfumes from '@/pages/Perfumes'
import Accessories from '@/pages/Accessories'
import Sale from '@/pages/Sale'
import NewIn from '@/pages/NewIn'
import Brands from '@/pages/Brands'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsConditions from '@/pages/TermsConditions'
import ShippingDelivery from '@/pages/ShippingDelivery'
import Returns from '@/pages/Returns'
import StoreLocator from '@/pages/StoreLocator'
import Tester from '@/pages/Tester'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ui/theme-provider'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<ProductCategory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
          <Route path="/tracking" element={<OrderTracking />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/jewellery" element={<Jewellery />} />
          <Route path="/bags" element={<Bags />} />
          <Route path="/perfumes" element={<Perfumes />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/new-in" element={<NewIn />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="/tester" element={<Tester />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  )
}

export default App
