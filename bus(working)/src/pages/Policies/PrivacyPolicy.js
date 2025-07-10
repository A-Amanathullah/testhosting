import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              RS Express is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or use our bus booking services.
            </p>
            <p>We collect information when you:</p>
            <ul className="list-disc pl-8 space-y-2 mb-3">
              <li>Create an account with us</li>
              <li>Book tickets through our platform</li>
              <li>Contact our customer support team</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in our loyalty program</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Process your ticket bookings and payments</li>
              <li>Create and maintain your account</li>
              <li>Send booking confirmations and travel updates</li>
              <li>Improve our services and website functionality</li>
              <li>Personalize your experience and provide targeted offers</li>
              <li>Communicate about promotions, updates, and new services</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Information Sharing</h2>
            <p className="mb-3">
              We may share your information with:
            </p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Bus operators to fulfill your booking</li>
              <li>Payment processors to complete transactions</li>
              <li>Service providers who assist with our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p className="mt-3">
              We will never sell your personal data to third parties for marketing purposes without your explicit consent.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, accidental loss, alteration, or destruction. However, no internet transmission is 
              completely secure, and we cannot guarantee the security of information transmitted to our website.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict the processing of your data</li>
              <li>Request transfer of your data to another service provider</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Contact Us</h2>
            <p>
              If you have any questions or concerns about our Privacy Policy, please contact us at:<br/>
              <strong>Email:</strong> privacy@rsexpress.lk<br/>
              <strong>Phone:</strong> +94 77 123 4567<br/>
              <strong>Address:</strong> No-00, Main Street, Kalmunai, Sri Lanka
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
              "Last Updated" date at the top of this page. We encourage you to review this Privacy Policy periodically 
              to stay informed about how we protect your information.
            </p>
            <p className="mt-3 text-gray-500 italic">Last Updated: July 10, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
