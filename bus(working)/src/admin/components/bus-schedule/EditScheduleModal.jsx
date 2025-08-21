import React, { useState, useEffect } from 'react';
import ScheduleForm from './ScheduleForm';
import { getAllBusRoutes } from '../../../services/busRouteService';
import { fetchUsersByRole } from '../../../services/userService';

const EditScheduleModal = ({ isOpen, onClose, onSave, scheduleData, buses }) => {
  const [formData, setFormData] = useState({
    id: '',
    bus_no: '',
    bus_route_id: '',
    driver_name: '',
    driver_contact: '',
    conductor_id: '',
    conductor_name: '',
    conductor_contact: '',
    start_point: '',
    end_point: '',
    departure_date: '',
    departure_time: '',
    price: '',
    arrival_date: '',
    arrival_time: ''
  });
  const [busRoutes, setBusRoutes] = useState([]);
  const [conductors, setConductors] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch bus routes and conductors when modal opens
  useEffect(() => {
    const fetchBusRoutes = async () => {
      try {
        const routes = await getAllBusRoutes();
        setBusRoutes(routes);
      } catch (error) {
        console.error('Failed to fetch bus routes:', error);
      }
    };
    
    const fetchConductors = async () => {
      try {
        const conductorUsers = await fetchUsersByRole('conductor');
        setConductors(conductorUsers);
      } catch (error) {
        console.error('Failed to fetch conductors:', error);
      }
    };
    
    if (isOpen) {
      fetchBusRoutes();
      fetchConductors();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (scheduleData && isOpen) {
      setFormData({
        id: scheduleData.id || '',
        bus_no: scheduleData.bus_no || '',
        bus_route_id: scheduleData.bus_route_id || '',
        driver_name: scheduleData.driver_name || '',
        driver_contact: scheduleData.driver_contact || '',
        conductor_id: scheduleData.conductor_id || '',
        conductor_name: scheduleData.conductor_name || '',
        conductor_contact: scheduleData.conductor_contact || '',
        start_point: scheduleData.start_point || '',
        end_point: scheduleData.end_point || '',
        departure_date: scheduleData.departure_date || '',
        departure_time: scheduleData.departure_time || '',
        price: scheduleData.price || '',
        arrival_date: scheduleData.arrival_date || '',
        arrival_time: scheduleData.arrival_time || ''
      });
    }
  }, [scheduleData, isOpen]);
  
  // Handle bus selection and pre-fill data
  const handleBusChange = (e) => {
    const id = e.target.value;
    const selectedBus = buses.find(bus => bus.id.toString() === id);
    
    if (selectedBus) {
      setFormData({
        ...formData,
        id,
        bus_no: selectedBus.bus_no,
        // Don't override existing driver data in edit mode unless explicitly changing the bus
        driver_name: formData.driver_name || selectedBus.driver_name || '',
        driver_contact: formData.driver_contact || selectedBus.contactNumber || '',
        // Keep conductor data as is
        start_point: formData.start_point || selectedBus.start_point || '',
        end_point: formData.end_point || selectedBus.end_point || '',
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id) newErrors.id = 'Please select a bus';
    if (!formData.bus_route_id) newErrors.bus_route_id = 'Please select a bus route';
    if (!formData.driver_name) newErrors.driver_name = 'Driver name is required';
    if (!formData.driver_contact) newErrors.driver_contact = 'Driver contact is required';
    if (!formData.conductor_id) newErrors.conductor_id = 'Please select a conductor';
    if (!formData.start_point) newErrors.start_point = 'From location is required';
    if (!formData.end_point) newErrors.end_point = 'To location is required';
    if (!formData.departure_date) newErrors.departure_date = 'Departure date is required';
    if (!formData.departure_time) newErrors.departure_time = 'Departure time is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.arrival_date) newErrors.arrival_date = 'Arrival date is required';
    if (!formData.arrival_time) newErrors.arrival_time = 'Arrival time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for id dropdown
    if (name === 'id') {
      handleBusChange(e);
    } else if (name === 'bus_route_id') {
      const route = busRoutes.find(r => r.id === parseInt(value));
      if (route) {
        // Auto-fill start and end points from route
        setFormData({
          ...formData,
          bus_route_id: value,
          start_point: route.start_location,
          end_point: route.end_location,
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else if (name === 'conductor_id') {
      const conductor = conductors.find(c => c.id === parseInt(value));
      if (conductor) {
        // Auto-fill conductor name and contact
        setFormData({
          ...formData,
          conductor_id: value,
          conductor_name: conductor.first_name && conductor.last_name 
            ? `${conductor.first_name} ${conductor.last_name}` 
            : conductor.name,
          conductor_contact: conductor.phone_no || '',
        });
      } else {
        // Clear conductor data if no conductor selected
        setFormData({
          ...formData,
          conductor_id: '',
          conductor_name: '',
          conductor_contact: '',
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Include the selected bus photo in the saved data
      const selectedBus = buses.find(bus => bus.id.toString() === formData.id);
      onSave({ 
        ...scheduleData, 
        ...formData,
        photo: selectedBus?.photo || scheduleData.photo
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Fixed header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit Schedule</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        {/* Scrollable content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <ScheduleForm 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors}
            buses={buses}
            busRoutes={busRoutes}
            conductors={conductors}
          />
        </div>
        
        {/* Fixed footer */}
        <div className="flex justify-end p-6 bg-white border-t">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditScheduleModal;