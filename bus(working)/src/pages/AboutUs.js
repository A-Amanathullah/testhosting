import React from 'react';
import { FaBus, FaUsers, FaRoute, FaShieldAlt, FaCheck, FaStar, FaHeart } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <div className="inline-block p-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <FaBus className="text-4xl text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              About RS EXPRESS
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light">
              A premier bus travel company committed to redefining luxury on the road. We provide first-class travel, 
              ensuring every journey is a seamless, comfortable, and grand experience for modern travelers.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Our Mission Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                <FaHeart className="text-3xl text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8"></div>
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                Our mission is to elevate bus travel by making the journey as memorable as the destination. 
                We are dedicated to providing unparalleled service and ensuring that every passenger receives 
                a valued, first-class experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Fleet Section */}
      <div className="relative py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-6">
              <FaBus className="text-3xl text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Fleet</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              We operate a state-of-the-art fleet of air-conditioned buses designed for optimal comfort. 
              Our vehicles feature spacious seating, ample legroom, and a full suite of onboard amenities. 
              Safety is our paramount priority, with all buses meticulously maintained and operated by 
              highly trained, professional drivers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaBus className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Modern Fleet</h3>
              <p className="text-gray-600 text-center leading-relaxed">State-of-the-art air-conditioned buses with premium amenities for the ultimate travel experience</p>
            </div>
            
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Comfort First</h3>
              <p className="text-gray-600 text-center leading-relaxed">Spacious seating with ample legroom designed for maximum comfort during your journey</p>
            </div>
            
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Safety Priority</h3>
              <p className="text-gray-600 text-center leading-relaxed">Professional drivers and meticulously maintained vehicles ensuring your safety at every mile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-6">
              <FaRoute className="text-3xl text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Services</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed font-light">
              We provide reliable and comfortable bus services on the following routes, with the added convenience 
              of online booking for a seamless travel experience. We believe your journey with us is not just a 
              ride but an experience to be savored.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <div className="flex items-center text-white">
                  <FaRoute className="text-2xl mr-4" />
                  <h3 className="text-2xl font-bold">Sammanthurai ⇄ Colombo</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-lg text-gray-700 mb-2 font-medium">Via Batticaloa</p>
                <p className="text-gray-600">Both directions available with convenient scheduling and premium comfort</p>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  <FaCheck className="mr-2" />
                  <span>Online booking available</span>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                <div className="flex items-center text-white">
                  <FaRoute className="text-2xl mr-4" />
                  <h3 className="text-2xl font-bold">Akkarapathu ⇄ Colombo</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-lg text-gray-700 mb-2 font-medium">Via Batticaloa</p>
                <p className="text-gray-600">Both directions available with convenient scheduling and premium comfort</p>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <FaCheck className="mr-2" />
                  <span>Online booking available</span>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-6">
                <div className="flex items-center text-white">
                  <FaRoute className="text-2xl mr-4" />
                  <h3 className="text-2xl font-bold">Akkarapathu ⇄ Jaffna</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-lg text-gray-700 mb-2 font-medium">Via Anuradhapura-Vavuniya</p>
                <p className="text-gray-600">Both directions available with convenient scheduling and premium comfort</p>
                <div className="mt-4 flex items-center text-sm text-purple-600">
                  <FaCheck className="mr-2" />
                  <span>Online booking available</span>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                <div className="flex items-center text-white">
                  <FaRoute className="text-2xl mr-4" />
                  <h3 className="text-2xl font-bold">Colombo ⇄ Jaffna</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-lg text-gray-700 mb-2 font-medium">Via Anuradhapura-Vavuniya</p>
                <p className="text-gray-600">Both directions available with convenient scheduling and premium comfort</p>
                <div className="mt-4 flex items-center text-sm text-orange-600">
                  <FaCheck className="mr-2" />
                  <span>Online booking available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6">
              <FaStar className="text-3xl text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Why Choose Us?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaBus className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Luxury & Comfort</h3>
              <p className="text-gray-600 leading-relaxed">
                We set the industry standard for bus travel with our luxurious fleet and meticulous attention to detail.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Safety & Reliability</h3>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to safety ensures a secure and punctual journey every time you travel with us.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl text-white">✨</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hygiene Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                After every journey, we meticulously clean each seat to ensure the highest standards of hygiene and cleanliness.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer-Centric Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated team assists you from initial online booking to trip completion, ensuring exceptional service.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl text-white">💝</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Creating Memories</h3>
              <p className="text-gray-600 leading-relaxed">
                We transform transportation into unforgettable experiences. Book your dream journey and discover the difference.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl text-white">⭐</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Overall Commitment</h3>
              <p className="text-gray-600 leading-relaxed">
                Every journey is a grand experience, with your comfort, safety, and satisfaction at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-200/20 to-orange-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Experience Luxury Travel?
            </h2>
            <p className="text-xl md:text-2xl mb-10 font-light leading-relaxed">
              Join thousands of satisfied passengers who have chosen RS EXPRESS for their premium travel experience. 
              Book your journey today and discover what makes us the leader in luxury bus travel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Book Your Journey
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                View Routes
              </button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full blur-xl"></div>
      </div>

    </div>
  );
};

export default AboutUs;
