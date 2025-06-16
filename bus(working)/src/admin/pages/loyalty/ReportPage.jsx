import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Calendar, Users, Search } from 'lucide-react';
import { PrintReportButton } from '../../components/loyalty-card';
import '../../components/loyalty-card/report-print.css';

const ReportPage = () => {
  // Placeholder data for the customer loyalty reports
  const [customerReports, setCustomerReports] = useState([
    {
      customerId: 'RS1001',
      customerName: 'John Smith',
      totalBookings: 12,
      totalAmount: 25600,
      pointsEarned: 120,
      pointsRedeemed: 50,
      balancePoints: 70,
      tier: 'Gold'
    },
    {
      customerId: 'RS1002',
      customerName: 'Sarah Johnson',
      totalBookings: 8,
      totalAmount: 18400,
      pointsEarned: 80,
      pointsRedeemed: 30,
      balancePoints: 50,
      tier: 'Silver'
    },
    {
      customerId: 'RS1003',
      customerName: 'Michael Brown',
      totalBookings: 20,
      totalAmount: 42000,
      pointsEarned: 200,
      pointsRedeemed: 120,
      balancePoints: 80,
      tier: 'Platinum'
    },
    {
      customerId: 'RS1004',
      customerName: 'Emily Davis',
      totalBookings: 5,
      totalAmount: 10500,
      pointsEarned: 50,
      pointsRedeemed: 0,
      balancePoints: 50,
      tier: 'Silver'
    },
    {
      customerId: 'RS1005',
      customerName: 'David Wilson',
      totalBookings: 15,
      totalAmount: 31500,
      pointsEarned: 150,
      pointsRedeemed: 100,
      balancePoints: 50,
      tier: 'Gold'
    }
  ]);
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  
  // Filter reports based on search query and tier filter
  const filteredReports = useMemo(() => {
    return customerReports.filter(customer => {
      const matchesSearch = 
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.customerId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTier = tierFilter === 'All' || customer.tier === tierFilter;
      
      return matchesSearch && matchesTier;
    });
  }, [customerReports, searchQuery, tierFilter]);
  
  // Calculate summary statistics based on filtered data
  const totalCustomers = filteredReports.length;
  const totalBookings = filteredReports.reduce((sum, customer) => sum + customer.totalBookings, 0);
  const totalPointsEarned = filteredReports.reduce((sum, customer) => sum + customer.pointsEarned, 0);
  const totalPointsRedeemed = filteredReports.reduce((sum, customer) => sum + customer.pointsRedeemed, 0);
    const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Function to handle print button click
  const handlePrint = () => {
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
      <div className="flex-grow p-6 overflow-auto">
        {/* Header with title */}        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Loyalty Reports</h1>
            <p className="text-sm text-gray-600">View and print customer loyalty program metrics</p>
          </div>
          
          <PrintReportButton 
            onClick={handlePrint}
            disabled={customerReports.length === 0}
          />
        </div>
          {/* Customer loyalty reports table */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm loyalty-report-print">          {/* This header will only show when printing */}
          <div className="hidden loyalty-report-header print:block">
            <h1>RS-EXPRESS BUS SERVICE</h1>
            <p>Customer Loyalty Program Report</p>
            <p>Report Date: {currentDate}</p>
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
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer ID</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Customer Name</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total Bookings</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total Amount (Rs)</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Points Earned</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Points Redeemed</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Balance Points</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tier</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length > 0 ? (
                  <>
                    {filteredReports.map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{customer.customerId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{customer.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.totalBookings}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.pointsEarned}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.pointsRedeemed}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.balancePoints}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            customer.tier === 'Platinum' ? 'bg-slate-200 text-slate-800' : 
                            customer.tier === 'Gold' ? 'bg-amber-200 text-amber-800' : 
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {customer.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Summary row */}
                    <tr className="font-medium bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900" colSpan="2">Total</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{totalBookings}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {filteredReports.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()} Rs
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{totalPointsEarned}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{totalPointsRedeemed}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {filteredReports.reduce((sum, c) => sum + c.balancePoints, 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900"></td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      <p className="text-lg font-medium">No customers found matching your search criteria</p>
                      <p className="mt-1">Try adjusting your search or filter options</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>        </div>
      </div>
    </div>
  );
};

export default ReportPage;