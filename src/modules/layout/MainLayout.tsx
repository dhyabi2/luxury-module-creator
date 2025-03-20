
import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '@/integrations/supabase/client';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [brandName, setBrandName] = useState("M&K Watches");
  
  // Fetch store settings on mount
  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('store_name')
          .single();
        
        if (error) {
          console.error('Error fetching store name:', error);
          return;
        }
        
        if (data && data.store_name) {
          setBrandName(data.store_name);
        }
      } catch (err) {
        console.error('Failed to fetch store settings:', err);
      }
    };
    
    fetchStoreSettings();
  }, []);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    // Update document title with the brand name
    document.title = `${brandName} - Luxury Watch Store`;
  }, [location.pathname, brandName]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow pt-[180px] xs:pt-[190px] sm:pt-[200px] md:pt-[205px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
