import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaUserTie, FaTools, FaHeadset, FaChartLine } from 'react-icons/fa';

const Career = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    coverLetter: ''
  });

  const jobOpenings = [
    {
      id: 1,
      title: 'Bus Driver',
      department: 'Operations',
      location: 'Multiple Locations',
      type: 'Full-time',
      salary: '$40,000 - $55,000',
      icon: <FaUserTie className="text-2xl text-primary" />,
      description: 'We are looking for experienced and safety-conscious bus drivers to join our team.',
      requirements: [
        'Valid commercial driver\'s license (CDL)',
        'Clean driving record',
        '2+ years of driving experience',
        'Excellent customer service skills',
        'Ability to work flexible schedules'
      ],
      responsibilities: [
        'Safely operate buses according to scheduled routes',
        'Provide excellent customer service to passengers',
        'Conduct pre-trip and post-trip vehicle inspections',
        'Maintain accurate logs and reports',
        'Follow all traffic laws and company policies'
      ]
    },
    {
      id: 2,
      title: 'Maintenance Technician',
      department: 'Maintenance',
      location: 'Main Depot',
      type: 'Full-time',
      salary: '$45,000 - $60,000',
      icon: <FaTools className="text-2xl text-primary" />,
      description: 'Join our maintenance team to keep our fleet running safely and efficiently.',
      requirements: [
        'Technical certification or equivalent experience',
        'Experience with diesel engines and hydraulic systems',
        'Knowledge of DOT regulations',
        'Strong problem-solving skills',
        'Ability to work in all weather conditions'
      ],
      responsibilities: [
        'Perform preventive maintenance on buses',
        'Diagnose and repair mechanical issues',
        'Maintain detailed maintenance records',
        'Ensure compliance with safety regulations',
        'Assist with fleet inspections'
      ]
    },
    {
      id: 3,
      title: 'Customer Service Representative',
      department: 'Customer Service',
      location: 'Call Center',
      type: 'Full-time',
      salary: '$35,000 - $45,000',
      icon: <FaHeadset className="text-2xl text-primary" />,
      description: 'Help our customers with bookings, inquiries, and provide exceptional service.',
      requirements: [
        'High school diploma or equivalent',
        'Excellent communication skills',
        'Computer proficiency',
        'Previous customer service experience preferred',
        'Bilingual skills a plus'
      ],
      responsibilities: [
        'Handle customer inquiries via phone, email, and chat',
        'Process ticket bookings and cancellations',
        'Resolve customer complaints professionally',
        'Maintain customer databases',
        'Collaborate with other departments'
      ]
    },
    {
      id: 4,
      title: 'Operations Manager',
      department: 'Management',
      location: 'Head Office',
      type: 'Full-time',
      salary: '$70,000 - $85,000',
      icon: <FaChartLine className="text-2xl text-primary" />,
      description: 'Lead our operations team and ensure efficient service delivery across all routes.',
      requirements: [
        'Bachelor\'s degree in Business or related field',
        '5+ years of management experience',
        'Experience in transportation industry preferred',
        'Strong leadership and analytical skills',
        'Knowledge of logistics and scheduling'
      ],
      responsibilities: [
        'Oversee daily operations and route management',
        'Manage and develop operations team',
        'Analyze performance metrics and optimize routes',
        'Ensure compliance with regulations',
        'Coordinate with other departments'
      ]
    }
  ];

  const benefits = [
    {
      icon: <FaDollarSign className="text-2xl text-primary" />,
      title: 'Competitive Salary',
      description: 'We offer competitive compensation packages with performance bonuses.'
    },
    {
      icon: <FaHeadset className="text-2xl text-primary" />,
      title: 'Health Benefits',
      description: 'Comprehensive health, dental, and vision insurance for you and your family.'
    },
    {
      icon: <FaClock className="text-2xl text-primary" />,
      title: 'Flexible Schedule',
      description: 'Work-life balance with flexible scheduling options and paid time off.'
    },
    {
      icon: <FaChartLine className="text-2xl text-primary" />,
      title: 'Career Growth',
      description: 'Professional development opportunities and clear advancement paths.'
    }
  ];

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would submit to your backend
    alert('Thank you for your application! We will review it and get back to you soon.');
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      resume: null,
      coverLetter: ''
    });
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Build your career with RS Express and be part of a team that's moving communities forward
          </p>
        </div>
      </div>

      {/* Why Work With Us Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RS Express?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a transportation company - we're a family that values growth, safety, and excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-6 shadow-md">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Openings Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-lg text-gray-600">
              Discover exciting opportunities to grow your career with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                    {job.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.department}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaClock className="mr-2" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaDollarSign className="mr-2" />
                    {job.salary}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 text-sm">{job.description}</p>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Details & Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> {selectedJob.location}</span>
                    <span className="flex items-center"><FaClock className="mr-1" /> {selectedJob.type}</span>
                    <span className="flex items-center"><FaDollarSign className="mr-1" /> {selectedJob.salary}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Job Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 mb-6">{selectedJob.description}</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 mb-6">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="mb-1">{req}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {selectedJob.responsibilities.map((resp, index) => (
                    <li key={index} className="mb-1">{resp}</li>
                  ))}
                </ul>
              </div>

              {/* Application Form */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Now</h3>
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={applicationForm.phone}
                      onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <select
                      value={applicationForm.experience}
                      onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select experience level</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume *</label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setApplicationForm({...applicationForm, resume: e.target.files[0]})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <textarea
                      rows={4}
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                      placeholder="Tell us why you're interested in this position..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Don't see a position that fits? Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <a 
            href="mailto:careers@rsexpress.com"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact HR Department
          </a>
        </div>
      </div>
    </div>
  );
};

export default Career;
