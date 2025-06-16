import { Search, Eye, Edit, Trash2 } from 'lucide-react';

const ScheduleTable = ({ 
  schedules, 
  searchTerm, 
  setSearchTerm, 
  onViewSchedule, 
  onEditSchedule, 
  onDeleteSchedule 
}) => {
  const filteredSchedules = schedules.filter(schedule => 
    schedule.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.conductorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${schedule.fromLocation} to ${schedule.toLocation}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search box */}
      <div className="relative w-72">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-2.5 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Schedule table */}
      <div className="mt-6 overflow-hidden bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Photo
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Bus Number
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Driver
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Conductor
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Route
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={schedule.photo} 
                      alt={`Bus ${schedule.busNumber}`} 
                      className="object-cover w-16 h-12 rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {schedule.busNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div>{schedule.driverName}</div>
                    <div className="text-xs text-gray-400">{schedule.driverContact}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div>{schedule.conductorName}</div>
                    <div className="text-xs text-gray-400">{schedule.conductorContact}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {schedule.fromLocation} to {schedule.toLocation}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button 
                      className="mr-3 text-blue-600 hover:text-blue-900"
                      onClick={() => onViewSchedule(schedule)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      className="mr-3 text-indigo-600 hover:text-indigo-900"
                      onClick={() => onEditSchedule(schedule)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDeleteSchedule(schedule)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-sm text-center text-gray-500">
                  No schedules found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ScheduleTable;