import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#f8f8f8] pt-16 pb-8 mt-20 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-flex flex-col items-start">
              <svg className="w-10 h-10 mb-2 text-brand" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-serif tracking-wider text-xl text-brand">MKWatches</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Discover exclusive luxury items at MKWatches. We offer a curated collection of premium watches, jewelry, and accessories from world-renowned brands.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-600 hover:text-brand transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-brand transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-medium mb-4 text-gray-900">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/women" className="text-gray-600 hover:text-brand transition-colors text-sm">Women</Link></li>
              <li><Link to="/men" className="text-gray-600 hover:text-brand transition-colors text-sm">Men</Link></li>
              <li><Link to="/new-in" className="text-gray-600 hover:text-brand transition-colors text-sm">New Arrivals</Link></li>
              <li><Link to="/watches" className="text-gray-600 hover:text-brand transition-colors text-sm">Watches</Link></li>
              <li><Link to="/jewellery" className="text-gray-600 hover:text-brand transition-colors text-sm">Jewelry</Link></li>
              <li><Link to="/accessories" className="text-gray-600 hover:text-brand transition-colors text-sm">Accessories</Link></li>
              <li><Link to="/sale" className="text-gray-600 hover:text-brand transition-colors text-sm">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-medium mb-4 text-gray-900">Information</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-brand transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-brand transition-colors text-sm">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-brand transition-colors text-sm">Shipping & Delivery</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-medium mb-4 text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-brand mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">123 Luxury Avenue, Muscat, Oman</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-brand mr-2" />
                <span className="text-gray-600 text-sm">
                  <a 
                    href="https://wa.me/96895696644" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-green-600 transition-colors"
                  >
                    +968 9569 6644
                  </a>
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-brand mr-2" />
                <span className="text-gray-600 text-sm">info@mkwatches.com</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-display text-base font-medium mb-3 text-gray-900">Business Hours</h4>
              <p className="text-gray-600 text-sm">Monday to Sunday: 9 AM - 9 PM</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} MKWatches. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <img src="https://via.placeholder.com/280x30?text=Payment+Methods" alt="Payment Methods" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
