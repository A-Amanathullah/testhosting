import React, { useState } from 'react';
import { BusSelector } from '../../admin/components/bus-booking/BusSelector';

const dummyTrackingData = [
  {
    id: 1,
    bus_no: 'RS-1001',
    route: 'Colombo-Kalmunai',
    location: 'Kurunegala',
    status: 'On Time',
    lastUpdated: '2025-05-27 10:15',
  },
  {
    id: 2,
    bus_no: 'RS-1002',
    route: 'Kalmunai-Colombo',
    location: 'Polonnaruwa',
    status: 'Delayed',
    lastUpdated: '2025-05-27 09:50',
  },
  {
    id: 3,
    bus_no: 'RS-1003',
    route: 'Colombo-Kandy',
    location: 'Kandy',
    status: 'On Time',
    lastUpdated: '2025-05-27 10:05',
  },
];

const busList = [
  { id: 1, bus_no: 'RS-1001' },
  { id: 2, bus_no: 'RS-1002' },
  { id: 3, bus_no: 'RS-1003' },
];

const TrackingPage = () => {
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter tracking data by bus and date (date filter is placeholder)
  const filteredData = selectedBusNo
    ? dummyTrackingData.filter(d => d.bus_no === selectedBusNo)
    : dummyTrackingData;

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bus Tracking</h1>
          <p className="text-sm text-gray-500">Live status and last known location of all buses.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="block text-sm font-medium text-gray-700">Bus</label>
            <select
              value={selectedBusNo}
              onChange={e => setSelectedBusNo(e.target.value)}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Buses</option>
              {busList.map(bus => (
                <option key={bus.id} value={bus.bus_no}>{bus.bus_no}</option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Bus No.</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Route</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Current Location</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No tracking data found.</td>
                </tr>
              ) : (
                filteredData.map(bus => (
                  <tr key={bus.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{bus.bus_no}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{bus.route}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{bus.location}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <span className={
                        bus.status === 'On Time'
                          ? 'px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800'
                          : 'px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800'
                      }>
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{bus.lastUpdated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;