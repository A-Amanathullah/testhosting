import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const UnfreezeConfirmation = ({ isOpen, onClose, onConfirm, frozenSeatInfo }) => {
  if (!isOpen || !frozenSeatInfo) return null;
  
  const seatNumbers = frozenSeatInfo.seatNumbers || [];
  
  // New: handle unfreeze and remove from DB
  const handleUnfreeze = async () => {
    if (typeof onConfirm === 'function') {
      await onConfirm(seatNumbers);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Confirm Unfreeze</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 mb-4 border-l-4 border-yellow-400 bg-yellow-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Are you sure you want to unfreeze the following seats?
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="font-medium">Seats to unfreeze:</p>
          <p className="text-lg">{seatNumbers.sort((a, b) => a - b).join(', ')}</p>
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
            type="button"
            onClick={handleUnfreeze}
            className="px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent rounded-md shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Unfreeze Seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnfreezeConfirmation;