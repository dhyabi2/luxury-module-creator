
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MainNavigation = () => {
  const [activeCategory, setActiveCategory] = useState('women');

  return (
    <nav className="bg-brand text-white border-t border-brand-light">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-6">
          <li>
            <Link 
              to="/"
              className={`nav-item ${activeCategory === 'women' ? 'nav-item-active bg-sale' : ''}`}
              onClick={() => setActiveCategory('women')}
            >
              WOMEN
            </Link>
          </li>
          <li>
            <Link 
              to="/"
              className={`nav-item ${activeCategory === 'men' ? 'nav-item-active bg-sale' : ''}`}
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
