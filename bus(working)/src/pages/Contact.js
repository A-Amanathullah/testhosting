import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-primary" />,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      subtitle: 'Call us anytime'
    },
    {
      icon: <FaEnvelope className="text-2xl text-primary" />,
      title: 'Email',
      details: 'info@rsexpress.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-primary" />,
      title: 'Head Office',
      details: '123 Transit Avenue, City Center',
      subtitle: 'Visit us during business hours'
    },
    {
      icon: <FaClock className="text-2xl text-primary" />,
      title: 'Business Hours',
      details: 'Mon-Fri: 6:00 AM - 10:00 PM',
      subtitle: 'Sat-Sun: 7:00 AM - 9:00 PM'
    }
  ];

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Support' },
    { value: 'lost_found', label: 'Lost & Found' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'partnership', label: 'Business Partnership' }
  ];

  const busStations = [
    {
      name: 'Central Station',
      address: '456 Main Street, Downtown',
      phone: '+1 (555) 123-4501',
      hours: '5:00 AM - 11:00 PM',
      amenities: ['Waiting Area', 'Restrooms', 'Food Court', 'WiFi', 'Parking']
    },
    {
      name: 'North Terminal',
      address: '789 North Avenue, Uptown',
      phone: '+1 (555) 123-4502',
      hours: '6:00 AM - 10:00 PM',
      amenities: ['Waiting Area', 'Restrooms', 'Snack Bar', 'WiFi']
    },
    {
      name: 'South Hub',
      address: '321 South Boulevard, Southside',
      phone: '+1 (555) 123-4503',
      hours: '5:30 AM - 10:30 PM',
      amenities: ['Waiting Area', 'Restrooms', 'Gift Shop', 'WiFi', 'ATM']
    }
  ];

  const handleSocialClick = (platform) => {
    // You can replace these with actual social media URLs
    const socialUrls = {
      facebook: 'https://facebook.com/rsexpress',
      twitter: 'https://twitter.com/rsexpress',
      instagram: 'https://instagram.com/rsexpress',
      linkedin: 'https://linkedin.com/company/rsexpress'
    };
    
    // For now, just show an alert. In production, you would use:
    // window.open(socialUrls[platform], '_blank', 'noopener,noreferrer');
    console.log(`Navigate to ${platform}: ${socialUrls[platform]}`);
    alert(`This would navigate to our ${platform} page`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We're here to help! Get in touch with us for any questions, support, or feedback
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-6 shadow-md">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                <p className="text-sm text-gray-600">{info.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={contactForm.category}
                      onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Us</h2>
                <p className="text-gray-600 mb-6">
                  Visit our main office or any of our bus stations for in-person assistance
                </p>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-4xl text-primary mb-2 mx-auto" />
                  <p className="text-primary font-semibold">Interactive Map</p>
                  <p className="text-sm text-gray-600">123 Transit Avenue, City Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bus Stations */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Bus Stations</h2>
            <p className="text-lg text-gray-600">
              Visit any of our conveniently located stations for tickets and information
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {busStations.map((station, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{station.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-primary mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{station.address}</span>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-primary mr-2" />
                    <span className="text-gray-700">{station.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-primary mr-2" />
                    <span className="text-gray-700">{station.hours}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {station.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media & Emergency */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Social Media */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
              <p className="text-gray-600 mb-8">
                Stay connected and get the latest updates on our services
              </p>
              <div className="flex justify-center space-x-6">
                <button 
                  onClick={() => handleSocialClick('facebook')}
                  aria-label="Visit our Facebook page"
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook className="text-xl" />
                </button>
                <button 
                  onClick={() => handleSocialClick('twitter')}
                  aria-label="Visit our Twitter page"
                  className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <FaTwitter className="text-xl" />
                </button>
                <button 
                  onClick={() => handleSocialClick('instagram')}
                  aria-label="Visit our Instagram page"
                  className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                >
                  <FaInstagram className="text-xl" />
                </button>
                <button 
                  onClick={() => handleSocialClick('linkedin')}
                  aria-label="Visit our LinkedIn page"
                  className="bg-blue-800 text-white p-3 rounded-full hover:bg-blue-900 transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contact</h2>
              <p className="text-gray-600 mb-6">
                For urgent issues or emergencies while traveling
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="text-red-600 text-2xl mb-2">🚨</div>
                <div className="text-lg font-semibold text-red-800 mb-2">24/7 Emergency Hotline</div>
                <div className="text-xl font-bold text-red-600">+1 (555) 911-HELP</div>
                <p className="text-sm text-red-700 mt-2">
                  Available 24/7 for emergencies and urgent assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
