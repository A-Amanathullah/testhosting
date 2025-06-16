import React, { useState, useRef } from 'react';
import BusForm from './BusForm';
import BusPhotoUploader from './BusPhotoUploader';

const AddBusModal = ({ isOpen, onClose, onSave }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    bus_no: '',
    start_point: '',
    end_point: '',
    total_seats: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bus_no) newErrors.bus_no = 'Bus number is required';
    if (!formData.start_point) newErrors.start_point = 'From location is required';
    if (!formData.end_point) newErrors.end_point = 'To location is required';
    if (!formData.total_seats) newErrors.total_seats = 'Seat count is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      data.append('bus_no', formData.bus_no);
      data.append('start_point', formData.start_point);
      data.append('end_point', formData.end_point);
      data.append('total_seats', formData.total_seats);
      if (formData.image) {
        data.append('image', formData.image);

      }
  
      onSave(data); // send FormData instead of plain object
      resetForm();
      onClose();
    }
  };
  
  
  const resetForm = () => {
    setFormData({
      bus_no: '',
      start_point: '',
      end_point: '',
      total_seats: '',
      image: null,
    });
    setPreviewImage(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Add New Bus</h3>
          <button 
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        {/* Form content - Scrollable */}
        <div className="flex-1 p-6 overflow-y-auto">
          <form id="addBusForm" onSubmit={handleSubmit} className="space-y-4">
            <BusForm 
              formData={formData} 
              onChange={handleInputChange} 
              errors={errors}
            />
            
            <BusPhotoUploader 
              previewImage={previewImage} 
              handleFileChange={handleFileChange} 
              fileInputRef={fileInputRef}
            />
          </form>
        </div>
        
        {/* Footer with buttons - Fixed at bottom */}
        <div className="flex justify-end p-6 bg-white border-t">
          <button 
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="addBusForm"
            className="px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Bus
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBusModal;