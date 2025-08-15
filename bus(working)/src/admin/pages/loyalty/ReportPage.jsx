import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../../components/Pagination';
import { usePermissions } from '../../../context/PermissionsContext';
import { Search } from 'lucide-react';
import { PrintReportButton } from '../../components/loyalty-card';
import { getLoyaltyReport } from '../../../services/loyaltyMemberService';
import '../../components/loyalty-card/report-print.css';

const ReportPage = () => {
  // State for the customer loyalty reports
  const [customerReports, setCustomerReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  const { permissions } = usePermissions();

  // Fetch loyalty report data on component mount
  useEffect(() => {
    fetchLoyaltyReport();
  }, []);

  const fetchLoyaltyReport = async () => {
    try {
      setIsLoading(true);
      const data = await getLoyaltyReport();
      setCustomerReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch loyalty report data');
      console.error('Error fetching loyalty report:', err);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Filter reports based on search query and tier filter
  const filteredReports = useMemo(() => {
    setPage(1); // Reset to first page on filter/search change
    return customerReports.filter(customer => {
      const matchesSearch = 
        customer.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.customer_id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = tierFilter === 'All' || customer.tier === tierFilter;
      return matchesSearch && matchesTier;
    });
    // eslint-disable-next-line
  }, [customerReports, searchQuery, tierFilter]);

  // Paginated data
  const paginatedReports = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredReports.slice(start, start + rowsPerPage);
  }, [filteredReports, page]);

  const totalPages = Math.ceil(filteredReports.length / rowsPerPage) || 1;
  
  // Calculate summary statistics based on filtered data
  const totalBookings = filteredReports.reduce((sum, customer) => sum + customer.total_bookings, 0);
  const totalPointsEarned = filteredReports.reduce((sum, customer) => sum + customer.points_earned, 0);
  const totalAmount = filteredReports.reduce((sum, customer) => sum + customer.total_amount, 0);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Helper to check permission for Loyalty Report
  const hasPermission = (action) => {
    if (!permissions || !permissions['Loyalty Report']) return false;
    return !!permissions['Loyalty Report'][action];
  };
  
  // Function to handle print button click
  const handlePrint = () => {
    if (!hasPermission('print')) {
      setNotification("You don't have permission to print loyalty reports.");
      return;
    }
    
    // Add current date as data attribute for the footer
    const reportElement = document.querySelector('.loyalty-report-print');
    if (reportElement) {
      reportElement.setAttribute('data-date', currentDate);
    }
    
    // Trigger browser print
    window.print();
  };
  
  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-red-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}
      <div className="flex-grow p-6 overflow-auto">
        {/* Header with title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Loyalty Reports</h1>
            <p className="text-sm text-gray-600">View and print customer loyalty program metrics</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchLoyaltyReport}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <PrintReportButton 
              onClick={handlePrint}
              disabled={customerReports.length === 0 || !hasPermission('print')}
            />
          </div>
        </div>
        {/* Customer loyalty reports table */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm loyalty-report-print">
          {/* This header will only show when printing */}
          <div className="hidden loyalty-report-header print:block">
            <h1>RS-EXPRESS BUS SERVICE</h1>
            <p>Customer Loyalty Program Report</p>
            <p>Report Date: {currentDate}</p>
          </div>

          {/* Summary cards */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[180px] bg-gradient-to-r from-red-100 to-red-200 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-xs text-gray-500">Total Bookings</span>
              <span className="text-2xl font-bold text-red-700">{totalBookings}</span>
            </div>
            <div className="flex-1 min-w-[180px] bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-xs text-gray-500">Total Amount</span>
              <span className="text-2xl font-bold text-blue-700">{totalAmount.toLocaleString()} Rs</span>
            </div>
            <div className="flex-1 min-w-[180px] bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-xs text-gray-500">Total Points Earned</span>
              <span className="text-2xl font-bold text-amber-700">{totalPointsEarned}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Customer Loyalty Details</h2>

            {/* Search and filter - hidden during print */}
            <div className="flex items-center space-x-4 no-print">
              {/* Search input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Tier filter dropdown */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="All">All Tiers</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-2 text-gray-600">Loading loyalty report...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-600 font-medium">{error}</p>
                  <button 
                    onClick={fetchLoyaltyReport}
                    className="mt-2 px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer ID</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer Name</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total Amount (Rs)</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Points Earned</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tier</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReports.length > 0 ? (
                    <>
                      {paginatedReports.map((customer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{customer.customer_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{customer.customer_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.total_amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.points_earned}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              customer.tier === 'Diamond' ? 'bg-blue-200 text-blue-800' :
                              customer.tier === 'Platinum' ? 'bg-slate-200 text-slate-800' : 
                              customer.tier === 'Gold' ? 'bg-amber-200 text-amber-800' : 
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {customer.tier}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <p className="text-lg font-medium">No customers found matching your search criteria</p>
                        <p className="mt-1">Try adjusting your search or filter options</p>
                      </td>
                    </tr>
                  )}
            {/* End of table body */}
                </tbody>
              </table>
            )}
            {/* Pagination controls - moved outside table for proper alignment */}
            {filteredReports.length > rowsPerPage && (
              <div className="flex justify-center items-center my-6">
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;