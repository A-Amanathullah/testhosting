import { usePermissions } from '../../context/PermissionsContext';
import { useState, useEffect, /*useContext*/ } from 'react';
// import { AuthContext } from '../../context/AuthContext';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import {
  AddScheduleModal,
  EditScheduleModal,
  ViewScheduleModal,
  DeleteConfirmation
} from '../components/bus-schedule';

import {
  getAllSchedules,
  AddSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../services/Schedule';

import { getAllBuses } from '../../services/busApi';


const BusSchedulePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const { permissions } = usePermissions();
  // const { user } = useContext(AuthContext);
  // const role = user?.role;
  const [notification, setNotification] = useState("");

  // Debug: Log role and permissions
  // console.log('DEBUG: role', role);
  // console.log('DEBUG: permissions', permissions);

  // Sample bus data - this would come from your API or context
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchBuses();
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await getAllSchedules();
      setSchedules(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchBuses = async () => {
    try {
      const data = await getAllBuses();
      setBuses(data);
    } catch (error) {
      console.error(error.message);
    }
  };


  // Update the handleAddSchedule function in BusSchedulePage.jsx
  const handleAddSchedule = async (scheduleData) => {
    try {
      for (const schedule of scheduleData) {
        // Find the bus object using the selected bus_no
        const busInfo = buses.find(bus => bus.bus_no === schedule.bus_no);

        if (!busInfo) {
          console.error(`No bus found for bus_no: ${schedule.bus_no}`);
          continue; // Skip this schedule
        }

        const formData = new FormData();

        formData.append("bus_no", schedule.bus_no);
        formData.append("bus_id", busInfo.id);
        formData.append("bus_route_id", schedule.bus_route_id); // Add bus route ID
        formData.append("driver_name", schedule.driver_name);
        formData.append("driver_contact", schedule.driver_contact);
        formData.append("conductor_name", schedule.conductor_name);
        formData.append("conductor_contact", schedule.conductor_contact);
        formData.append("start_point", schedule.start_point);
        formData.append("end_point", schedule.end_point);
        formData.append("departure_date", schedule.departure_date);
        formData.append("departure_time", schedule.departure_time);
        formData.append("price", schedule.price);
        formData.append("arrival_date", schedule.arrival_date);
        formData.append("arrival_time", schedule.arrival_time);
        formData.append("available_seats", busInfo.total_seats);

        await AddSchedule(formData); // Send each trip separately
      }

      // Refresh after all schedules are added
      const data = await getAllSchedules();
      setSchedules(data);
      setIsAddModalOpen(false);

    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };



  const handleEditSchedule = async (updatedSchedule) => {
    try {
      await updateSchedule(updatedSchedule);
      const data = await getAllSchedules(); // Refresh the schedule list
      setSchedules(data);
      setIsEditModalOpen(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleDeleteSchedule = async () => {
  try {
    if (selectedSchedule) {
      await deleteSchedule(selectedSchedule.id);
      const data = await getAllSchedules(); // Refresh the schedule list
      setSchedules(data);
      setIsDeleteModalOpen(false);
      setSelectedSchedule(null);
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
  }
}

  const openViewModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  // Filter schedules to only show present and future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  const filteredSchedules = schedules
    .filter(schedule => {
      // Only show schedules with departure_date today or in the future
      const depDate = new Date(schedule.departure_date);
      depDate.setHours(0, 0, 0, 0); // Ignore time part
      return depDate >= today;
    })
    .filter(schedule => (
      (schedule.bus_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule.driver_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule.conductor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (`${schedule.start_point || ''} to ${schedule.end_point || ''}`.toLowerCase().includes(searchTerm.toLowerCase()))
    ));

  // Helper to check permissions for Bus Schedule
  const can = (action) => {
    if (!permissions || !permissions['Bus Schedule']) return false;
    return !!permissions['Bus Schedule'][action];
  };

  // Modified handlers with permission checks
  const handleAddClick = () => {
    if (!can('add')) {
      setNotification("You don't have permission to add schedules.");
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleEditClick = (schedule) => {
    if (!can('edit')) {
      setNotification("You don't have permission to edit schedules.");
      return;
    }
    openEditModal(schedule);
  };

  const handleDeleteClick = (schedule) => {
    if (!can('delete')) {
      setNotification("You don't have permission to delete schedules.");
      return;
    }
    openDeleteModal(schedule);
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-red-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}
      <div className="flex-grow p-6 ">
        {/* Top action bar with search and add button */}
        <div className="flex items-center justify-between mb-6 bg-gray-50 sticky top-0 z-20 py-4">
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

          {can('add') && (
            <button
              onClick={handleAddClick}
              className="flex items-center px-4 py-2 text-white bg-red-800 rounded-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Schedule
            </button>
          )}
        </div>

        {/* Schedule table */}
        <div className="mt-6 bg-white rounded-lg shadow-sm max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
          <div className="flex-shrink-0 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Bus Info
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Driver/Conductor
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Route
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Schedule
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full">
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => {
                    const busInfo = buses.find(bus => bus.bus_no === schedule.bus_no);
                    return (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        {/* Bus Info with Image */}
                        <td className="px-4 py-4" style={{width: '16.66%'}}>
                          <div className="flex items-center space-x-3">
                            <img
                              src={busInfo?.image ? `http://localhost:8000/storage/${busInfo.image}` : '/placeholder.jpg'}
                              alt={`Bus ${schedule.bus_no}`}
                              className="object-cover w-12 h-12 rounded-lg flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{schedule.bus_no}</div>
                              <div className="text-xs text-gray-500">Bus Number</div>
                            </div>
                          </div>
                        </td>

                        {/* Driver/Conductor */}
                        <td className="px-4 py-4" style={{width: '20%'}}>
                          <div className="text-sm text-gray-900">
                            <div className="font-medium truncate">Driver: {schedule.driver_name}</div>
                            <div className="text-gray-500 truncate">Conductor: {schedule.conductor_name}</div>
                          </div>
                        </td>

                        {/* Route */}
                        <td className="px-4 py-4" style={{width: '18%'}}>
                          <div className="text-sm text-gray-900">
                            <div className="font-medium truncate">{schedule.start_point}</div>
                            <div className="text-xs text-gray-500 text-center">↓</div>
                            <div className="font-medium truncate">{schedule.end_point}</div>
                          </div>
                        </td>

                        {/* Schedule */}
                        <td className="px-4 py-4" style={{width: '15%'}}>
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{new Date(schedule.departure_date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{schedule.departure_time}</div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4" style={{width: '12%'}}>
                          <div className="text-sm font-medium text-gray-900">
                            Rs. {schedule.price}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4" style={{width: '18.34%'}}>
                          <div className="flex items-center justify-center space-x-2">
                            {can('view') && (
                              <button
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => openViewModal(schedule)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            {can('edit') && (
                              <button
                                className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                onClick={() => handleEditClick(schedule)}
                                title="Edit Schedule"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {can('delete') && (
                              <button
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={() => handleDeleteClick(schedule)}
                                title="Delete Schedule"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-sm text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-gray-400">
                          <Search className="w-8 h-8 mx-auto" />
                        </div>
                        <div>No schedules found matching your search.</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSchedule}
        buses={buses}
      />

      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSchedule}
        scheduleData={selectedSchedule}
        buses={buses}
      />

      <ViewScheduleModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        schedule={selectedSchedule}
        buses={buses}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSchedule}
        bus_no={selectedSchedule?.bus_no}
      />
    </div>
  );
};

export default BusSchedulePage;