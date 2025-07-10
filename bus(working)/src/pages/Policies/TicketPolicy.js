import React from 'react';

const TicketPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-center">Ticket Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Booking Confirmation</h2>
            <p className="mb-3">
              After completing your booking, you will receive a confirmation email with your ticket details.
              This email serves as proof of your booking and should be presented (either printed or digitally)
              when boarding the bus.
            </p>
            <p>
              All passengers must carry valid identification that matches the name on the ticket.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Cancellation Policy</h2>
            <p className="mb-3">Our standard cancellation policy is as follows:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Time Before Departure</th>
                    <th className="border px-4 py-2 text-left">Refund Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">More than 48 hours</td>
                    <td className="border px-4 py-2">90% of ticket fare</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">24 to 48 hours</td>
                    <td className="border px-4 py-2">75% of ticket fare</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">12 to 24 hours</td>
                    <td className="border px-4 py-2">50% of ticket fare</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Less than 12 hours</td>
                    <td className="border px-4 py-2">25% of ticket fare</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">No-show</td>
                    <td className="border px-4 py-2">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 italic">
              * Service fee of LKR 100 will be deducted from all refunds.
            </p>
            <p className="text-sm text-gray-500 italic">
              ** Some premium routes and special services may have different cancellation policies, which will be clearly indicated during booking.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Ticket Rescheduling</h2>
            <p className="mb-3">
              You may reschedule your ticket subject to the following conditions:
            </p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Rescheduling must be done at least 12 hours before departure time</li>
              <li>A rescheduling fee of LKR 200 will apply</li>
              <li>If the fare of the new ticket is higher, you must pay the difference</li>
              <li>If the fare of the new ticket is lower, the difference will not be refunded</li>
              <li>A ticket can be rescheduled only once</li>
            </ul>
            <p className="mt-3">
              To reschedule, please contact our customer service or use the "Manage Booking" option on our website or app.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Boarding Process</h2>
            <p className="mb-3">
              Please arrive at the boarding point at least 15 minutes before the scheduled departure time.
              The bus operator reserves the right to allocate your seat to another passenger if you are late.
            </p>
            <p>
              You must present your ticket confirmation and valid ID at the time of boarding.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Luggage Policy</h2>
            <p className="mb-3">
              Each passenger is allowed:
            </p>
            <ul className="list-disc pl-8 space-y-2">
              <li>One piece of luggage up to 20kg for stowage</li>
              <li>One small handbag or laptop bag to carry onboard</li>
              <li>Additional luggage may incur extra charges at the discretion of the bus operator</li>
              <li>Oversized or excessive luggage may be refused if space is limited</li>
            </ul>
            <p className="mt-3">
              RS Express and the bus operators are not responsible for any loss or damage to luggage.
              Valuable items should be kept with you at all times.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Route Changes & Delays</h2>
            <p>
              Bus operators reserve the right to change the route, schedule, or even cancel trips due to weather conditions, 
              mechanical issues, or other unforeseen circumstances. In case of significant delays or cancellations, 
              we will assist you in rescheduling or processing refunds as per our policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Special Assistance</h2>
            <p>
              If you require special assistance (such as for disability, elderly, or children traveling alone), 
              please inform us at the time of booking. We will make every effort to accommodate your needs, 
              but some services may be subject to availability.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Contact for Support</h2>
            <p>
              For any queries or assistance regarding your ticket, please contact us at:<br/>
              <strong>Email:</strong> support@rsexpress.lk<br/>
              <strong>Phone:</strong> +94 77 123 4567 (24/7 Customer Support)<br/>
              <strong>WhatsApp:</strong> +94 77 123 4567
            </p>
            <p className="mt-3 text-gray-500 italic">Last Updated: July 10, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TicketPolicy;
