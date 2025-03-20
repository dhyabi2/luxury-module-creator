
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';

const TermsConditions = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">Terms & Conditions</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-lg text-gray-700 mb-6">
              Welcome to Labels Luxury. Please read these terms and conditions carefully before using our website or making a purchase.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing or using our website, you agree to be bound by these Terms and Conditions, our Privacy Policy, and any other terms referenced herein. If you do not agree with any part of these terms, please do not use our website or services.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">2. Product Information</h2>
            <p className="text-gray-700 mb-6">
              We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content on the site is accurate, complete, reliable, current, or error-free. All products are subject to availability.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">3. Pricing & Payment</h2>
            <p className="text-gray-700 mb-6">
              All prices are listed in Omani Rial (OMR) and are inclusive of VAT where applicable. We reserve the right to change prices at any time without notice. Payment is processed securely through our authorized payment gateways.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">4. Shipping & Delivery</h2>
            <p className="text-gray-700 mb-6">
              Please refer to our Shipping & Delivery page for detailed information on shipping methods, timeframes, and costs. Labels Luxury is not responsible for delays caused by customs or other factors beyond our control.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">5. Returns & Exchanges</h2>
            <p className="text-gray-700 mb-6">
              Please refer to our Returns & Exchanges page for detailed information on our return policy, eligible items, and return process.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              All content on the Labels Luxury website, including but not limited to text, graphics, logos, images, and software, is the property of Labels Luxury or its content suppliers and is protected by international copyright laws.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">7. Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              Labels Luxury shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from the use of, or inability to use, our services or products.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">9. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of Oman, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">10. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms and Conditions, please contact us at info@labelsluxury.com or call us at +968 9291120.
            </p>
            
            <p className="text-gray-700 mb-6 mt-8">
              Last updated: March 20, 2023
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsConditions;
