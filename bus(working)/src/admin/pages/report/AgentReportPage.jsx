import React, { useState, useEffect, useRef } from 'react';
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
import useBusHook from '../../../hooks/useBusHook';

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

  const { users } = useUsers(); // Get user context
  // Fetch bookings with null parameters initially to get all bookings
  const { bookings: allBookings, loading: bookingsLoading, error: bookingsError } = useBookings(
    selectedBusId || null,
    selectedDate || null,
    selectedAgent || null
  );
  const { buses } = useBusHook();
  const { permissions } = usePermissions();

  // Reference to the table for printing
  const printTableRef = useRef(null);

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

  // Process bookings when filters change or data is fetched
  useEffect(() => {
    setIsLoading(true);

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      setBookings([]);
      setIsLoading(false);
      return;
    }

    // Filter bookings to include only those with role 'agent' and map to expected structure
    const mappedBookings = allBookings
      .filter(booking => booking.role === 'agent')
      .map(booking => ({
        id: booking.id,
        serialNo: booking.serial_no,
        bookedDate: booking.created_at,
        agentId: booking.user_id,
        agentName: booking.name,
        customerName: booking.name,
        bus_no: booking.bus_no,
        contactNumber: booking.contact_number || 'N/A',
        ticketsReserved: booking.reserved_tickets,
        seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : booking.seat_no,
        route: `${booking.pickup} - ${booking.drop}`,
        status: booking.status,
        commission: booking.price ? booking.price * 0.1 : 0,
        bookingDate: booking.booked_date
      }))
      .sort((a, b) => {
        if (!a.bookedDate && !b.bookedDate) return 0;
        if (!a.bookedDate) return 1;
        if (!b.bookedDate) return -1;
        return new Date(b.bookedDate) - new Date(a.bookedDate);
      });

    setBookings(mappedBookings);
    setIsLoading(bookingsLoading);
  }, [allBookings, bookingsLoading, bookingsError, selectedBusId, selectedDate, selectedAgent]);

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
    
    if (bookings.length) {
      if (printTableRef.current) {
        printTableRef.current.focus();
      }
      setTimeout(() => {
        window.print();
      }, 200);
    }
  };

  // Calculate summary data
  const getAgentSummary = () => {
    if (!bookings.length) return { totalTickets: 0, totalCommission: 0 };

    const totalTickets = bookings.reduce((sum, booking) => sum + booking.ticketsReserved, 0);
    const totalCommission = bookings.reduce((sum, booking) => sum + booking.commission, 0);

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
                <p className="text-2xl font-bold text-green-900">{totalCommission.toLocaleString()}</p>
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
              { label: 'Total Commission', value: `Rs ${totalCommission.toLocaleString()}` },
              { label: 'Avg. Commission/Booking', value: `Rs ${bookings.length ? Math.round(totalCommission / bookings.length).toLocaleString() : 0}` }
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
                      Agent Name
                    </th>
                    <th scope="col" className="w-2/12 px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Booked Date
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
                  {bookings.map((booking) => (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentReportPage;