import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditLoyaltyCardModal = ({ isOpen, onClose, onSave, cardData, isLoading = false }) => {
  const [formData, setFormData] = useState({
    tier: '',
    minPoints: 0,
    maxPoints: 0,
    pointsPerBooking: 0,
    color: '#C0C0C0',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cardData && isOpen) {
      setFormData({
        tier: cardData.tier || '',
        minPoints: cardData.min_points ?? cardData.minPoints ?? 0,
        maxPoints: cardData.max_points ?? cardData.maxPoints ?? 0,
        pointsPerBooking: cardData.points_per_booking ?? cardData.pointsPerBooking ?? 0,
        color: cardData.color || '#C0C0C0',
      });
    }
  }, [cardData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (formData.minPoints < 0) newErrors.minPoints = 'Minimum points cannot be negative';
    if (formData.maxPoints <= formData.minPoints) newErrors.maxPoints = 'Maximum points must be greater than minimum points';
    if (formData.pointsPerBooking <= 0) newErrors.pointsPerBooking = 'Points per booking must be greater than zero';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["minPoints", "maxPoints", "pointsPerBooking"].includes(name)) {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedCard = {
        tier: formData.tier,
        min_points: formData.minPoints,
        max_points: formData.maxPoints,
        points_per_booking: formData.pointsPerBooking,
        color: formData.color,
      };
      onSave(cardData.id, updatedCard);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Edit {cardData.tier} Card Settings
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tier Name</label>
            <input
              type="text"
              name="tier"
              value={formData.tier}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              readOnly
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Minimum Points</label>
            <input
              type="number"
              name="minPoints"
              value={formData.minPoints}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              min="0"
            />
            {errors.minPoints && <p className="mt-1 text-sm text-red-600">{errors.minPoints}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Maximum Points</label>
            <input
              type="number"
              name="maxPoints"
              value={formData.maxPoints}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              min="0"
            />
            {errors.maxPoints && <p className="mt-1 text-sm text-red-600">{errors.maxPoints}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Points Per Booking</label>
            <input
              type="number"
              name="pointsPerBooking"
              value={formData.pointsPerBooking}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              min="1"
            />
            {errors.pointsPerBooking && <p className="mt-1 text-sm text-red-600">{errors.pointsPerBooking}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Card Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-10 h-10 p-1 mr-3 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLoyaltyCardModal;
