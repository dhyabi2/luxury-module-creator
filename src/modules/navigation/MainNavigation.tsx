
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MainNavigation = () => {
  const [activeCategory, setActiveCategory] = useState('women');

  return (
    <nav className="bg-brand text-white border-t border-brand-light">
      <div className="container mx-auto px-4 md:px-8">
        <ul className="flex justify-center space-x-12">
          <li>
            <Link 
              to="/"
              className={`nav-item py-3 px-6 font-display tracking-widest text-sm ${activeCategory === 'women' ? 'nav-item-active bg-sale' : ''}`}
              onClick={() => setActiveCategory('women')}
            >
              WOMEN
            </Link>
          </li>
          <li>
            <Link 
              to="/"
              className={`nav-item py-3 px-6 font-display tracking-widest text-sm ${activeCategory === 'men' ? 'nav-item-active bg-sale' : ''}`}
              onClick={() => setActiveCategory('men')}
            >
              MEN
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MainNavigation;
