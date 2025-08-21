
import React, { useState, useEffect, useRef } from 'react';
import SideLogo from '../../../assets/Side.png';
import Pagination from '../../components/Pagination';
import { usePermissions } from '../../../context/PermissionsContext';
import {
  BusSelector,
  DateSelector,
  PrintButton,
  ReportPrintLayout
} from '../../components/bus-booking';
import '../../components/bus-booking/print.css';
import useUsers from '../../../hooks/useUsers';
import useBookings from '../../../hooks/useBookings';
import useAdminGuestBookings from '../../hooks/useAdminGuestBookings';
import useBusHook from '../../../hooks/useBusHook';
import agentCommissionService from '../../../services/agentCommissionService';

const AgentReportPage = () => {
  // State for selected filters and data
  const [selectedBusId, setSelectedBusId] = useState(''); // Empty string for no bus filter initially
  const [selectedDate, setSelectedDate] = useState(''); // Empty string for no date filter initially
  const [selectedAgent, setSelectedAgent] = useState(''); // Empty string for no agent filter initially
  const [bookings, setBookings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [notification, setNotification] = useState("");
  const [agentCommissions, setAgentCommissions] = useState({}); // Store commission data for agents

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  const { users } = useUsers(); // Get user context
  // Fetch bookings with null parameters initially to get all bookings
  const { bookings: allBookings, loading: bookingsLoading, error: bookingsError } = useBookings(
    selectedBusId || null,
    selectedDate || null,
    selectedAgent || null
  );
  // Fetch all guest bookings (filtering by bus/date/agent can be added if needed)
  const { guestBookings: allGuestBookings = [], loading: guestBookingsLoading, error: guestBookingsError } = useAdminGuestBookings();
  const { buses } = useBusHook();
  const { permissions } = usePermissions();

  // Reference to the table for printing
  const printTableRef = useRef(null);

  // Function to fetch all agent commissions
  const fetchAgentCommissions = async () => {
    try {
      const response = await agentCommissionService.getAll();
      if (response.data.success) {
        const commissionsMap = {};
        response.data.data.forEach(commission => {
          if (commission.is_active) {
            commissionsMap[commission.user_id] = commission;
          }
        });
        setAgentCommissions(commissionsMap);
      }
    } catch (error) {
      console.error('Error fetching agent commissions:', error);
    }
  };

  // Fetch agents and available dates
  useEffect(() => {
    // Fetch agents data
    const agentList = users
      .filter(user => user.role === 'agent')
      .map(user => ({
        id: user.id,
        name: user.name
      }));
    setAgents(agentList);

    // Fetch agent commissions for dynamic calculation
    fetchAgentCommissions();

    // Generate available dates from bookings
    if (allBookings && allBookings.length > 0) {
      let allDates = allBookings
        .map(b => b.departure_date || b.departureDate)
        .filter(Boolean);
      if (Array.isArray(allDates[0])) {
        allDates = allDates.flat();
      }
      const uniqueDates = Array.from(new Set(allDates)).sort();
      setAvailableDates(uniqueDates);
    } else {
      setAvailableDates([]);
    }
  }, [users, allBookings]);

  // Process bookings and guest bookings when filters/data change
  useEffect(() => {
    const processBookings = async () => {
      setIsLoading(true);

      if (bookingsError || guestBookingsError) {
        console.error('Error fetching bookings:', bookingsError, guestBookingsError);
        setBookings([]);
        setIsLoading(false);
        return;
      }

      // Process regular agent bookings
      const mappedAgentBookings = await Promise.all(
        allBookings
          .filter(booking => booking.role === 'agent')
          .map(async (booking) => {
            const bookingPrice = booking.price || 0;
            let commission = 0;

            // Calculate commission dynamically
            if (agentCommissions[booking.user_id]) {
              const commissionData = agentCommissions[booking.user_id];
              const numSeats = booking.reserved_tickets || 1; // Number of seats booked
              
              if (commissionData.commission_type === 'percentage') {
                // For percentage: calculate on total booking amount
                commission = (bookingPrice * commissionData.commission_value) / 100;
              } else {
                // For fixed amount: multiply by number of seats (commission per seat)
                commission = parseFloat(commissionData.commission_value) * numSeats;
              }
            } else {
              // Fallback to 10% for backward compatibility
              commission = bookingPrice * 0.1;
            }

            return {
              id: booking.id,
              serialNo: booking.serial_no,
              bookedDate: booking.created_at,
              agentId: booking.user_id,
              agentName: users.find(u => u.id === booking.user_id)?.name || booking.name || 'N/A',
              customerName: booking.name,
              bus_no: booking.bus_no,
              contactNumber: booking.phone_no || 'N/A',
              ticketsReserved: booking.reserved_tickets,
              seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : booking.seat_no,
              route: `${booking.pickup} - ${booking.drop}`,
              status: booking.status,
              commission: commission,
              bookingDate: booking.booked_date
            };
          })
      );

      // Process guest bookings with agent_id
      const mappedGuestAgentBookings = await Promise.all(
        allGuestBookings
          .filter(booking => booking.agent_id)
          .map(async (booking) => {
            const bookingPrice = booking.price || 0;
            let commission = 0;

            // Calculate commission dynamically
            if (agentCommissions[booking.agent_id]) {
              const commissionData = agentCommissions[booking.agent_id];
              const numSeats = booking.reserved_tickets || 1; // Number of seats booked
              
              if (commissionData.commission_type === 'percentage') {
                // For percentage: calculate on total booking amount
                commission = (bookingPrice * commissionData.commission_value) / 100;
              } else {
                // For fixed amount: multiply by number of seats (commission per seat)
                commission = parseFloat(commissionData.commission_value) * numSeats;
              }
            } else {
              // Fallback to 10% for backward compatibility
              commission = bookingPrice * 0.1;
            }

            return {
              id: booking.id,
              serialNo: booking.serial_no,
              bookedDate: booking.created_at,
              agentId: booking.agent_id,
              agentName: users.find(u => u.id === booking.agent_id)?.name || 'N/A',
              customerName: booking.name,
              bus_no: booking.bus_no,
              contactNumber: booking.phone || booking.contact_number || 'N/A',
              ticketsReserved: booking.reserved_tickets,
              seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : booking.seat_no,
              route: `${booking.pickup} - ${booking.drop}`,
              status: booking.status,
              commission: commission,
              bookingDate: booking.booked_date
            };
          })
      );

      // Merge and sort all agent bookings
      const allAgentBookings = [...mappedAgentBookings, ...mappedGuestAgentBookings]
        .filter(b => {
          // Filter by selected agent, bus, date if set
          if (selectedAgent && String(b.agentId) !== String(selectedAgent)) return false;
          if (selectedBusId && String(b.bus_no) !== String(buses.find(bus => bus.id === parseInt(selectedBusId))?.bus_no)) return false;
          if (selectedDate && b.bookedDate && new Date(b.bookedDate).toISOString().split('T')[0] !== selectedDate) return false;
          return true;
        })
        .sort((a, b) => {
          if (!a.bookedDate && !b.bookedDate) return 0;
          if (!a.bookedDate) return 1;
          if (!b.bookedDate) return -1;
          return new Date(b.bookedDate) - new Date(a.bookedDate);
        });

      setBookings(allAgentBookings);
      setIsLoading(bookingsLoading || guestBookingsLoading);
      setCurrentPage(1); // Reset to first page on data/filter change
    };

    processBookings();
  }, [allBookings, allGuestBookings, bookingsLoading, guestBookingsLoading, bookingsError, guestBookingsError, users, selectedBusId, selectedDate, selectedAgent, buses, agentCommissions]);

  // Handle bus selection
  const handleBusChange = (id) => {
    setSelectedBusId(id);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle agent selection
  const handleAgentChange = (e) => {
    setSelectedAgent(e.target.value);
  };

  // Helper to check permission for Agentwise Report
  const hasPermission = (action) => {
    if (!permissions || !permissions['Agentwise Report']) return false;
    return !!permissions['Agentwise Report'][action];
  };

  // Handle print action
  const handlePrint = () => {
    if (!hasPermission('print')) {
      setNotification("You don't have permission to print agent reports.");
      return;
    }
    if (!bookings.length) return;
    if (!printTableRef.current) return;
    const printContents = printTableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (!printWindow) {
      setNotification('Popup blocked! Please allow popups for this site to print.');
      return;
    }
    printWindow.document.write('<html><head><title>Agent Booking Report</title>');
    printWindow.document.write(`
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; margin: 0; padding: 24px; }
        .print-logo { display: block; margin: 0 auto 24px auto; max-width: 220px; }
        h1 { text-align: center; color: #1a237e; font-size: 2rem; margin-bottom: 12px; }
        .print-table { width: 100%; border-collapse: collapse; margin-top: 12px; background: #fff; box-shadow: 0 2px 8px #e3e3e3; }
        .print-table th, .print-table td { border: 1px solid #bdbdbd; padding: 10px 14px; font-size: 1rem; }
        .print-table th { background: #e3eafc; color: #1a237e; font-weight: 700; }
        .print-table tr:nth-child(even) { background: #f7fafd; }
        .print-table .print-hide, .print-table .print-hide * { display: none !important; }
        @media print {
          body { margin: 0; }
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    // Add logo and title using imported image path
    printWindow.document.write(`
      <img src="${SideLogo}" alt="Company Logo" class="print-logo" />
      <h1>Agent Booking Report</h1>
    `);
    printWindow.document.write(printContents.replace(/min-w-full/g, 'print-table'));
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Calculate summary data
  const getAgentSummary = () => {
    if (!bookings.length) return { totalTickets: 0, totalCommission: 0 };

    const totalTickets = bookings.reduce((sum, booking) => sum + booking.ticketsReserved, 0);
    const totalCommission = bookings.reduce((sum, booking) => sum + parseFloat(booking.commission || 0), 0);

    return { totalTickets, totalCommission };
  };

  const { totalTickets, totalCommission } = getAgentSummary();

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-red-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}
      <div className="flex-grow p-6 overflow-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Agent Booking Report</h1>
          <p className="text-sm text-gray-500">View and print agent booking details.</p>
        </div>

        {/* Control panel */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Agent Selector */}
            <div className="w-48">
              <label htmlFor="agent-select" className="block mb-2 text-sm font-medium text-gray-700">
                Select Agent
              </label>
              <select
                id="agent-select"
                value={selectedAgent}
                onChange={handleAgentChange}
                className="block w-full px-3 py-2 mt-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Agents</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            <BusSelector
              buses={buses}
              selectedBusId={selectedBusId}
              onChange={handleBusChange}
            />
            <DateSelector
              dates={availableDates}
              selectedDate={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="ml-auto">
            <PrintButton
              onClick={handlePrint}
              disabled={!bookings.length || !hasPermission('print')}
            />
          </div>
        </div>

        {/* Summary Card */}
        {bookings.length > 0 && (
          <div className="p-4 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Booking Summary</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="p-3 rounded-md bg-blue-50">
                <p className="text-sm font-medium text-blue-700">Total Tickets</p>
                <p className="text-2xl font-bold text-blue-900">{totalTickets}</p>
              </div>
              <div className="p-3 rounded-md bg-green-50">
                <p className="text-sm font-medium text-green-700">Total Commission (Rs)</p>
                <p className="text-2xl font-bold text-green-900">{totalCommission.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Agent Booking Report Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow" ref={printTableRef}>
          <ReportPrintLayout
            title="Agent Booking Report"
            dateInfo={`Date: ${selectedDate ? new Date(selectedDate).toLocaleDateString() : 'All Dates'}`}
            additionalInfo={[
              `Bus: ${selectedBusId ? buses.find(b => b.id === parseInt(selectedBusId))?.bus_no || 'N/A' : 'All Buses'}`,
              `Agent: ${selectedAgent ? agents.find(a => a.id === parseInt(selectedAgent))?.name || 'N/A' : 'All Agents'}`
            ]}
            summaryData={[
              { label: 'Total Bookings', value: bookings.length },
              { label: 'Total Tickets', value: totalTickets },
              { label: 'Total Commission', value: `Rs. ${totalCommission.toFixed(2)}` },
              { label: 'Avg. Commission/Booking', value: `Rs. ${bookings.length ? (totalCommission / bookings.length).toFixed(2) : '0.00'}` }
            ]}
          />

          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Loading agent booking data...</p>
            </div>
          ) : bookingsError ? (
            <div className="p-4 text-center">
              <p className="text-red-500">Error loading bookings: {bookingsError.message}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">No agent bookings found for the selected criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto print-table print-content">
              <table className="min-w-full divide-y divide-gray-200 table-fixed print-agent-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-1/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Serial No.
                    </th>
                    <th scope="col" className="w-2/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Booked Date
                    </th>
                    <th scope="col" className="w-2/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Agent Name
                    </th>
                    <th scope="col" className="w-2/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Customer
                    </th>
                    <th scope="col" className="w-1/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Bus No.
                    </th>
                    <th scope="col" className="w-1/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Contact
                    </th>
                    <th scope="col" className="w-1/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Route
                    </th>
                    <th scope="col" className="w-1/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Tickets
                    </th>
                    <th scope="col" className="w-2/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Seat Numbers
                    </th>
                    <th scope="col" className="w-1/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Commission (Rs)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.serialNo}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.bookedDate ? new Date(booking.bookedDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.agentName}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.customerName}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.bus_no}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.contactNumber}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.route}
                      </td>
                      <td className="px-3 py-2 text-sm text-center text-gray-900">
                        {booking.ticketsReserved}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 whitespace-normal">
                        {booking.seatNumbers}
                      </td>
                      <td className="px-3 py-2 text-sm text-right text-gray-900">
                        {booking.commission.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls - moved outside table for proper alignment */}
              {bookings.length > recordsPerPage && (
                <div className="flex justify-center items-center my-6">
                  <Pagination
                    page={currentPage}
                    setPage={setCurrentPage}
                    totalPages={Math.ceil(bookings.length / recordsPerPage)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentReportPage;