import React, { useState } from 'react';
// import { X, Award, CreditCard, Users } from 'lucide-react';
import { X} from 'lucide-react';

const CreateCardModal = ({ isOpen, onClose, onSave, existingCards = [], isLoading = false }) => {
  const [formData, setFormData] = useState({
    tier: '',
    minPoints: 0,
    maxPoints: 0,
    pointsMethod: 'booking',
    pointsPerBooking: 10,
    amount: 1000,
    pointsPerAmount: 1,
    color: '#C0C0C0',
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tier.trim()) {
      newErrors.tier = 'Tier name is required';
    } else if (existingCards.some(card => card.tier.toLowerCase() === formData.tier.toLowerCase())) {
      newErrors.tier = 'A loyalty card with this tier name already exists';
    }
    
    if (formData.minPoints < 0) {
      newErrors.minPoints = 'Minimum points cannot be negative';
    }
    
    if (formData.maxPoints <= formData.minPoints) {
      newErrors.maxPoints = 'Maximum points must be greater than minimum points';
    }
    
    if (formData.pointsMethod === 'booking') {
      if (formData.pointsPerBooking <= 0) {
        newErrors.pointsPerBooking = 'Points per booking must be greater than zero';
      }
    } else {
      if (formData.amount <= 0) {
        newErrors.amount = 'Amount must be greater than zero';
      }
      if (formData.pointsPerAmount <= 0) {
        newErrors.pointsPerAmount = 'Points per amount must be greater than zero';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numerical inputs to numbers
    if (['minPoints', 'maxPoints', 'pointsPerBooking', 'amount', 'pointsPerAmount'].includes(name)) {
      setFormData({
        ...formData,
        [name]: Number(value)
      });
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
  
  // const handlePointsMethodChange = (method) => {
  //   setFormData({
  //     ...formData,
  //     pointsMethod: method
  //   });
  // };
  
  // const handleIconChange = (iconType) => {
  //   setFormData({
  //     ...formData,
  //     icon: iconType
  //   });
  // };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newCard = {
        tier: formData.tier,
        minPoints: formData.minPoints,
        maxPoints: formData.maxPoints,
        pointsPerBooking: formData.pointsPerBooking,
        color: formData.color,
      };
      onSave(newCard);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setFormData({
      tier: '',
      minPoints: 0,
      maxPoints: 0,
      pointsMethod: 'booking',
      pointsPerBooking: 10,
      amount: 1000,
      pointsPerAmount: 1,
      color: '#C0C0C0',
    });
    setErrors({});
  };
  
  const cancelAndClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Loyalty Card
          </h3>
          <button 
            onClick={cancelAndClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tier Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Tier Name
            </label>
            <input
              type="text"
              name="tier"
              value={formData.tier}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="E.g., Silver, Gold, Platinum..."
            />
            {errors.tier && (
              <p className="mt-1 text-sm text-red-600">{errors.tier}</p>
            )}
          </div>
          
          {/* Icon Selection */}
          {/* <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Card Icon
            </label>
            <div className="flex gap-4 mt-2">
              <label className={`flex flex-col items-center p-2 border rounded-md cursor-pointer ${formData.icon === 'card' ? 'bg-red-50 border-red-500' : 'border-gray-300'}`}>
                <input
                  type="radio"
                  name="icon"
                  className="sr-only"
                  checked={formData.icon === 'card'}
                  onChange={() => handleIconChange('card')}
                />
                <CreditCard className="w-6 h-6 mb-1" />
                <span className="text-xs">Card</span>
              </label>
              
              <label className={`flex flex-col items-center p-2 border rounded-md cursor-pointer ${formData.icon === 'users' ? 'bg-red-50 border-red-500' : 'border-gray-300'}`}>
                <input
                  type="radio"
                  name="icon"
                  className="sr-only"
                  checked={formData.icon === 'users'}
                  onChange={() => handleIconChange('users')}
                />
                <Users className="w-6 h-6 mb-1" />
                <span className="text-xs">Users</span>
              </label>
              
              <label className={`flex flex-col items-center p-2 border rounded-md cursor-pointer ${formData.icon === 'award' ? 'bg-red-50 border-red-500' : 'border-gray-300'}`}>
                <input
                  type="radio"
                  name="icon"
                  className="sr-only"
                  checked={formData.icon === 'award'}
                  onChange={() => handleIconChange('award')}
                />
                <Award className="w-6 h-6 mb-1" />
                <span className="text-xs">Award</span>
              </label>
            </div>
          </div> */}
          
          {/* Min Points */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Minimum Points
            </label>
            <input
              type="number"
              name="minPoints"
              value={formData.minPoints}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              min="0"
            />
            {errors.minPoints && (
              <p className="mt-1 text-sm text-red-600">{errors.minPoints}</p>
            )}
          </div>
          
          {/* Max Points */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Maximum Points
            </label>
            <input
              type="number"
              name="maxPoints"
              value={formData.maxPoints}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              min="0"
            />
            {errors.maxPoints && (
              <p className="mt-1 text-sm text-red-600">{errors.maxPoints}</p>
            )}
          </div>
          
          {/* Color Picker */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Card Color
            </label>
            <div className="flex items-center">
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
          </div>
          
          {/* Points Method */}
          {/* <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Points Earning Method
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pointsMethod"
                  checked={formData.pointsMethod === 'booking'}
                  onChange={() => handlePointsMethodChange('booking')}
                  className="mr-2"
                />
                <span>Points per Booking</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pointsMethod"
                  checked={formData.pointsMethod === 'amount'}
                  onChange={() => handlePointsMethodChange('amount')}
                  className="mr-2"
                />
                <span>Points per Amount</span>
              </label>
            </div>
          </div> */}
          
          {/* Points Per Booking (conditional) */}
          
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Points Per Booking
              </label>
              <input
                type="number"
                name="pointsPerBooking"
                value={formData.pointsPerBooking}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                min="1"
              />
              {errors.pointsPerBooking && (
                <p className="mt-1 text-sm text-red-600">{errors.pointsPerBooking}</p>
              )}
            </div>
          
          
          {/* Amount and Points Per Amount (conditional) */}
          {/* {formData.pointsMethod === 'amount' && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  min="1"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Points Per Amount
                </label>
                <input
                  type="number"
                  name="pointsPerAmount"
                  value={formData.pointsPerAmount}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  min="1"
                />
                {errors.pointsPerAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.pointsPerAmount}</p>
                )}
              </div>
            </>
          )} */}
          
          {/* Submit buttons */}
          <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={cancelAndClose}
              className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCardModal;