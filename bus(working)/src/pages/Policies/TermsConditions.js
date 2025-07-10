import React from 'react';

const TermsConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">Terms & Conditions</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p className="mb-3">
              These Terms and Conditions govern your use of the RS Express website and bus booking services. By accessing our website 
              or using our services, you agree to be bound by these Terms and Conditions in full.
            </p>
            <p>
              If you do not agree with these Terms and Conditions, you must not use our website or services.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Service Description</h2>
            <p className="mb-3">
              RS Express provides an online platform for booking bus tickets across Sri Lanka. We act as an intermediary between 
              passengers and bus operators, facilitating the booking process.
            </p>
            <p>
              While we strive to ensure accurate information about schedules, fares, and availability, the actual 
              transportation services are provided by independent bus operators.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
            <p className="mb-3">
              When creating an account with RS Express, you agree to provide accurate, current, and complete information. 
              You are responsible for maintaining the confidentiality of your account details and for all activities under your account.
            </p>
            <p>
              We reserve the right to disable any user account if we believe you have violated these Terms and Conditions.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Booking & Payments</h2>
            <p className="mb-3">By making a booking through RS Express, you agree to:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Provide accurate passenger information</li>
              <li>Pay the full fare as displayed at the time of booking</li>
              <li>Accept our refund and cancellation policies</li>
              <li>Abide by the bus operator's rules and regulations</li>
              <li>Present valid identification when boarding the bus</li>
            </ul>
            <p className="mt-3">
              All payments are processed securely through our payment partners. We do not store complete credit card information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Cancellations & Refunds</h2>
            <p className="mb-3">
              Cancellation policies vary depending on the bus operator and the timing of your cancellation. 
              Please refer to our separate Ticket Policy for detailed information about cancellations, refunds, and rescheduling.
            </p>
            <p>
              RS Express charges a service fee for processing refunds, which may be deducted from the refund amount.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Prohibited Activities</h2>
            <p className="mb-3">When using our platform, you must not:</p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the intellectual property rights of RS Express or third parties</li>
              <li>Attempt to gain unauthorized access to our systems or user accounts</li>
              <li>Use our platform to send unsolicited communications</li>
              <li>Engage in any activity that could damage or impair the functionality of our website</li>
              <li>Make false or fraudulent bookings</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Limitation of Liability</h2>
            <p>
              RS Express acts as an intermediary and is not liable for:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-3">
              <li>The conduct or service quality of bus operators</li>
              <li>Delays, cancellations, or changes to bus schedules</li>
              <li>Loss, damage, or injury during travel</li>
              <li>Errors or inaccuracies in the information provided by bus operators</li>
              <li>Technical issues beyond our reasonable control</li>
            </ul>
            <p>
              Our maximum liability to you in all circumstances is limited to the amount paid for your booking.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Changes to Terms</h2>
            <p>
              We may revise these Terms and Conditions at any time. The updated terms will take effect when posted on the website. 
              Your continued use of our services after changes constitutes acceptance of the revised Terms and Conditions.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Contact Information</h2>
            <p>
              For questions or concerns regarding these Terms and Conditions, please contact us at:<br/>
              <strong>Email:</strong> legal@rsexpress.lk<br/>
              <strong>Phone:</strong> +94 77 123 4567<br/>
              <strong>Address:</strong> No-00, Main Street, Kalmunai, Sri Lanka
            </p>
            <p className="mt-3 text-gray-500 italic">Last Updated: July 10, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
