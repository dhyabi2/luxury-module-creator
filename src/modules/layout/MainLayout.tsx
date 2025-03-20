
import React, { ReactNode, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
