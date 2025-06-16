import React from 'react';

const ViewBusModal = ({ isOpen, onClose, bus }) => {
  if (!isOpen || !bus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Bus Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <div className="overflow-hidden bg-gray-100 rounded-lg">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row">
              {/* Bus photo */}
              <div className="mb-4 sm:mb-0 sm:mr-6 sm:w-1/3">
                <img
                  src={bus.image ? `http://localhost:8000/storage/${bus.image}` : '/placeholder.jpg'}
                  alt={`Bus ${bus.bus_no}`}
                  className="object-cover w-full rounded-lg shadow-sm"
                  style={{ height: '200px' }}
                />
              </div>
              
              {/* Bus details */}
              <div className="sm:w-2/3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <h4 className="text-xl font-bold text-gray-800">{bus.bus_no}</h4>
                    <p className="text-sm text-gray-500">{bus.start_point} to {bus.end_point}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500">SEATS</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">{bus.total_seats}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500">BUS ID</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">#{bus.id}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-700">ROUTE DETAILS</h5>
              <div className="flex items-center mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="w-0.5 h-10 bg-gray-300"></div>
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">{bus.start_point}</p>
                  <p className="text-sm font-medium text-gray-800 mt-7">{bus.end_point}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewBusModal;