import React from 'react';
import { X } from 'lucide-react';
import StaffForm from './StaffForm';

const StaffModal = ({ isOpen, onClose, title, staff = null, onSubmit, isEdit = false, isView = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Form or View Content */}
            <div className="mt-5">
              {isView ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                      {staff.profile_image ? (
                        <img 
                          src={`http://localhost:8000/storage/${staff.profile_image}`} 
                          alt={`${staff.name} Profile`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                          {staff.name.split(' ').map(part => part.charAt(0)).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Name</h4>
                      <p className="mt-1 text-sm text-gray-900">{staff.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                      <p className="mt-1 text-sm text-gray-900">{staff.contact_number}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="mt-1 text-sm text-gray-900">{staff.email}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">NIC Number</h4>
                      <p className="mt-1 text-sm text-gray-900">{staff.nic_no}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Role</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {staff.role ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            staff.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            staff.role === 'staff' ? 'bg-blue-100 text-blue-800' : 
                            staff.role === 'driver' ? 'bg-green-100 text-green-800' : 
                            staff.role === 'conductor' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {staff.role.charAt(0).toUpperCase() + staff.role.slice(1).replace('_', ' ')}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Not specified</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500">Address</h4>
                      <p className="mt-1 text-sm text-gray-900">{staff.address}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <StaffForm 
                  onSubmit={onSubmit}
                  initialData={staff}
                  isEdit={isEdit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;
