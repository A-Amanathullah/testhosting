import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const LoyaltySettingsModal = ({ isOpen, onClose, onSave, settings }) => {
  // Change pointsPerThousand to pointsPerBooking and remove pointExpiryMonths
  const [formData, setFormData] = useState({
    pointsPerBooking: 10
  });
  
  useEffect(() => {
    if (settings && isOpen) {
      setFormData({
        pointsPerBooking: settings.pointsPerBooking || 10
      });
    }
  }, [settings, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure only positive numbers are entered
    if (value >= 0) {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Loyalty Program Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="pointsPerBooking" className="block text-sm font-medium text-gray-700">
              Points earned per booking
            </label>
            <input
              type="number"
              id="pointsPerBooking"
              name="pointsPerBooking"
              min="1"
              value={formData.pointsPerBooking}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of loyalty points customers will earn for each ticket booking
            </p>
          </div>
          
          <div className="flex items-center justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoyaltySettingsModal;