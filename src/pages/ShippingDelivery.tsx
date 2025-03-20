
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';

const ShippingDelivery = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">Shipping & Delivery</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-lg text-gray-700 mb-6">
              Labels Luxury is committed to delivering your luxury items safely and efficiently. Below you'll find information about our shipping methods, timeframes, and policies.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Shipping Methods</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium text-xl mb-3">Standard Shipping</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Delivery within Oman: 2-3 business days</li>
                <li>GCC Countries: 4-7 business days</li>
                <li>Other International: 7-14 business days</li>
              </ul>
              <p className="mt-3 text-gray-700">Cost: Calculated based on destination and order value.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium text-xl mb-3">Express Shipping</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Delivery within Oman: Next business day</li>
                <li>GCC Countries: 2-3 business days</li>
                <li>Other International: 3-5 business days</li>
              </ul>
              <p className="mt-3 text-gray-700">Cost: Additional charge applies, calculated at checkout.</p>
            </div>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Free Shipping</h2>
            <p className="text-gray-700 mb-6">
              Orders over 300 OMR qualify for free standard shipping within Oman. International orders over 500 OMR qualify for free standard international shipping to GCC countries.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Order Processing</h2>
            <p className="text-gray-700 mb-6">
              Orders are processed within 24-48 hours of being placed. You will receive a confirmation email with your tracking number once your order has been shipped.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">International Shipping</h2>
            <p className="text-gray-700 mb-6">
              Labels Luxury ships to most countries worldwide. Please note that international orders may be subject to import duties, taxes, and customs clearance fees, which are the responsibility of the recipient.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Shipping Restrictions</h2>
            <p className="text-gray-700 mb-6">
              Due to regulations and logistical constraints, we may be unable to ship certain items to specific countries. If you have concerns about shipping to your location, please contact our customer service team.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Tracking Your Order</h2>
            <p className="text-gray-700 mb-6">
              You can track your order by:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Clicking the tracking link in your shipping confirmation email</li>
              <li>Visiting our website and entering your order number and email in the "Track Order" section</li>
              <li>Contacting our customer service team</li>
            </ul>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Delivery Issues</h2>
            <p className="text-gray-700 mb-6">
              If you experience any issues with your delivery, such as delays, damage, or missing items, please contact our customer service team immediately at shipping@labelsluxury.com or call +968 9291120.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShippingDelivery;
