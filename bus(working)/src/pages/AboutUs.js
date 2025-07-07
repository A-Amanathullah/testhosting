import React from 'react';
import { FaBus, FaUsers, FaRoute, FaShieldAlt } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About RS Express</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your trusted partner for safe, comfortable, and reliable bus transportation across the region
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Founded with a vision to revolutionize public transportation, RS Express has been serving 
                communities for over a decade. We started as a small local service and have grown into 
                a trusted transportation network connecting cities and towns.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Our commitment to excellence, safety, and customer satisfaction has made us the preferred 
                choice for thousands of passengers who rely on us for their daily commute and long-distance travel.
              </p>
              <p className="text-lg text-gray-700">
                Today, we operate a modern fleet of buses equipped with the latest safety features and 
                comfort amenities, ensuring every journey is pleasant and secure.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-gray-600">Daily Trips</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-gray-600">Routes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">1M+</div>
                  <div className="text-gray-600">Happy Passengers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">99%</div>
                  <div className="text-gray-600">On-Time Performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These values guide everything we do and shape the experience we provide to our passengers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                Your safety is our top priority. We maintain the highest safety standards in everything we do.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h3>
              <p className="text-gray-600">
                We listen to our passengers and continuously improve our services based on their feedback.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBus className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability</h3>
              <p className="text-gray-600">
                Count on us to get you to your destination on time, every time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRoute className="text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We embrace technology and innovation to enhance your travel experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-primary text-white rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg">
                To provide safe, reliable, and comfortable transportation services that connect 
                communities and enable people to reach their destinations with confidence and ease.
              </p>
            </div>
            
            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg">
                To be the leading transportation provider in the region, known for excellence in 
                service, innovation in technology, and commitment to sustainable mobility solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600">
              Meet the dedicated professionals who drive our success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-500">CEO</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">John Anderson</h4>
              <p className="text-primary font-medium mb-2">Chief Executive Officer</p>
              <p className="text-gray-600">
                With over 20 years in transportation, John leads our strategic vision and growth.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-500">CTO</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Sarah Chen</h4>
              <p className="text-primary font-medium mb-2">Chief Technology Officer</p>
              <p className="text-gray-600">
                Sarah drives our digital transformation and technology innovation initiatives.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-500">COO</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Michael Torres</h4>
              <p className="text-primary font-medium mb-2">Chief Operations Officer</p>
              <p className="text-gray-600">
                Michael ensures smooth daily operations and maintains our high service standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
