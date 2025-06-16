import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const BusTable = ({
  buses = [],
  searchTerm = '',
  onViewBus,
  onEditBus,
  onDeleteBus
}) => {
  const filteredBuses = Array.isArray(buses)
    ? buses.filter(bus =>
      bus?.bus_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus?.start_point && bus?.end_point &&
        `${bus.start_point} to ${bus.end_point}`.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  return (
    <>
      {/* Bus table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-sm h-[70vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Photo
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Bus Number
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Route
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Seats
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={bus.image ? `http://localhost:8000/storage/${bus.image}` : '/placeholder.jpg'}
                      alt={`Bus ${bus.bus_no}`}
                      className="object-cover w-16 h-12 rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {bus.bus_no}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {bus.start_point && bus.end_point ? `${bus.start_point} to ${bus.end_point}` : 'Not specified'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {bus.total_seats}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      className="mr-3 text-blue-600 hover:text-blue-900"
                      onClick={() => onViewBus(bus)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="mr-3 text-indigo-600 hover:text-indigo-900"
                      onClick={() => onEditBus(bus)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDeleteBus(bus)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500">
                  No buses found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BusTable;