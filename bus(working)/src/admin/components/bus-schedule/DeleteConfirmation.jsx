// src/components/bus-schedule/DeleteConfirmation.jsx
import React from 'react';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, busNumber }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <div className="p-4 mb-4 text-center rounded-lg bg-red-50">
          <p className="mb-2 text-sm text-gray-700">
            Are you sure you want to delete schedule for bus <span className="font-bold">{busNumber}</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;