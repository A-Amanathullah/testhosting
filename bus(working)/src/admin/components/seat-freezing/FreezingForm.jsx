import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const FreezingForm = ({ selectedSeats, onSubmit, onUnfreeze, isSubmitting, disabled }) => {
  const [formData, setFormData] = useState({
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, frozenBy: user?.name });
      setFormData({ reason: '' });
    }
  };

  const handleUnfreeze = () => {
    if (selectedSeats.length > 0) {
      onUnfreeze(selectedSeats);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-medium">Freezing Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason for Freezing
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500${errors.reason ? ' border-red-300' : ''}`}
            placeholder="Enter reason for freezing these seats"
            disabled={disabled || isSubmitting}
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={disabled || isSubmitting || selectedSeats.length === 0}
          >
            {isSubmitting ? 'Freezing...' : `Freeze ${selectedSeats.length} Selected Seat${selectedSeats.length !== 1 ? 's' : ''}`}
          </button>
          <button
            type="button"
            onClick={handleUnfreeze}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-800 bg-white border border-red-800 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={disabled || isSubmitting || selectedSeats.length === 0}
          >
            {isSubmitting ? 'Unfreezing...' : `Unfreeze ${selectedSeats.length} Selected Seat${selectedSeats.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FreezingForm;