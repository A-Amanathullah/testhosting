import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, BookOpen, XCircle, Users, DollarSign } from 'lucide-react';

/**
 * ReportingDashboardPage - A centralized page for accessing all reports
 */
const ReportingDashboardPage = () => {
  const reports = [
    {
      id: 'booking',
      title: 'Booking Reports',
      description: 'View and print confirmed bookings by date and bus.',
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      path: '/reports/bookings',
      color: 'bg-blue-100 border-blue-200'
    },
    {
      id: 'cancellation',
      title: 'Cancellation Reports',
      description: 'View and print cancelled bookings with reasons.',
      icon: <XCircle className="w-8 h-8 text-red-600" />,
      path: '/reports/cancellations',
      color: 'bg-red-100 border-red-200'
    },
    {
      id: 'agent',
      title: 'Agent Reports',
      description: 'View and print agent bookings and commissions.',
      icon: <Users className="w-8 h-8 text-green-600" />,
      path: '/reports/agents',
      color: 'bg-green-100 border-green-200'
    },
    {
      id: 'revenue',
      title: 'Revenue Reports',
      description: 'View and print financial reports and analytics.',
      icon: <DollarSign className="w-8 h-8 text-purple-600" />,
      path: '/reports/revenue',
      color: 'bg-purple-100 border-purple-200'
    }
  ];

  return (
    <div className="flex flex-col flex-grow p-6 overflow-hidden bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">RS Express Reporting Dashboard</h1>
        <p className="text-sm text-gray-500">Access and print all system reports from this page.</p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-700">Available Reports</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reports.map((report) => (
            <Link 
              key={report.id}
              to={report.path}
              className={`flex flex-col p-6 transition-transform border rounded-lg ${report.color} hover:shadow-md hover:scale-105`}
            >
              <div className="mb-4">{report.icon}</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">{report.title}</h3>
              <p className="mb-4 text-sm text-gray-600">{report.description}</p>
              <div className="flex items-center mt-auto text-sm font-medium text-blue-600">
                <span>View Report</span>
                <Printer className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-6 mt-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Printing Tips</h2>
        
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="mb-2 text-md font-medium text-gray-900">Optimizing Your Printed Reports</h3>
            <ul className="pl-5 list-disc">
              <li className="mb-1 text-sm text-gray-700">Use landscape orientation for tables with many columns</li>
              <li className="mb-1 text-sm text-gray-700">Choose "Background Graphics" in browser print settings to include all styling</li>
              <li className="mb-1 text-sm text-gray-700">For large reports, consider using the date filters to narrow results</li>
              <li className="mb-1 text-sm text-gray-700">Use "Print to PDF" option to save digital copies of reports</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="mb-2 text-md font-medium text-gray-900">Browser-Specific Settings</h3>
            <ul className="pl-5 list-disc">
              <li className="mb-1 text-sm text-gray-700">Chrome: Settings → Advanced → Print → Background Graphics</li>
              <li className="mb-1 text-sm text-gray-700">Firefox: Page Setup → Format & Options → Print Background</li>
              <li className="mb-1 text-sm text-gray-700">Edge: More Settings → Options → Background Graphics</li>
              <li className="mb-1 text-sm text-gray-700">Safari: File → Print → Show Details → Print Backgrounds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboardPage;
