
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactUs = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">Contact Us</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-serif mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-brand mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Our Location</h3>
                    <p className="text-gray-700 mt-1">
                      Labels Luxury<br />
                      123 Luxury Avenue<br />
                      Muscat, Oman
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-brand mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Phone Number</h3>
                    <p className="text-gray-700 mt-1">+968 9291120</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-brand mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-gray-700 mt-1">info@labelsluxury.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-lg">Business Hours</h3>
                <p className="text-gray-700 mt-1">
                  Monday to Sunday: 9 AM - 9 PM
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-serif mb-6">Send Us a Message</h2>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  ></textarea>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    className="w-full bg-brand text-white py-2 px-4 rounded-md hover:bg-brand-dark transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUs;
