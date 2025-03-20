
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">Privacy Policy</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-lg text-gray-700 mb-6">
              At Labels Luxury, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Information We Collect</h2>
            <p className="text-gray-700 mb-6">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Register on our website</li>
              <li>Place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us</li>
              <li>Participate in promotions or surveys</li>
            </ul>
            <p className="text-gray-700 mt-4 mb-6">
              This information may include your name, email address, postal address, phone number, payment information, and product preferences.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">How We Use Your Information</h2>
            <p className="text-gray-700 mb-6">
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Processing and fulfilling your orders</li>
              <li>Sending order confirmations and updates</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Sending promotional emails (if you've opted in)</li>
              <li>Improving our website and services</li>
              <li>Preventing fraud and unauthorized access</li>
            </ul>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Information Sharing</h2>
            <p className="text-gray-700 mb-6">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Service providers who help us operate our business (payment processors, shipping companies, etc.)</li>
              <li>Legal authorities when required by law</li>
              <li>Affiliated businesses and partners (with your consent)</li>
            </ul>
            <p className="text-gray-700 mt-4 mb-6">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Your Rights</h2>
            <p className="text-gray-700 mb-6">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p className="text-gray-700 mt-4 mb-6">
              To exercise these rights, please contact us using the information provided below.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Email: privacy@labelsluxury.com</li>
              <li>Phone: +968 9291120</li>
              <li>Address: 123 Luxury Avenue, Muscat, Oman</li>
            </ul>
            
            <p className="text-gray-700 mb-6 mt-8">
              Last Updated: March 20, 2023
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
