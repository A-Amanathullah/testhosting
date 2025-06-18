import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { StaffForm } from '../../components/staff-management';
import { createStaffWithUser } from '../../../services/staffService';
import { storeUserDetails } from '../../../services/authService';

const CreatePage = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateStaff = async (staffData) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await createStaffWithUser(staffData);
      // Send user details after user is created
      await storeUserDetails({
        user_id: user.id,
        first_name: staffData.first_name,
        last_name: staffData.last_name,
        phone_no: staffData.phone_no || staffData.contact_number,
        gender: staffData.gender,
        email: staffData.email,
        role: staffData.role,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin/staff/list');
      }, 2000);
    } catch (error) {
      setError('Failed to create staff member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Staff Member</h1>
          <p className="text-sm text-gray-600">Add new staff members to RS-Express admin system</p>
        </div>

        {/* Loading notification */}
        {loading && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md animate-pulse">
            <div className="flex items-center">
              <span className="text-blue-800 font-medium">Processing, please wait...</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex items-center">
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Success notification */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-800 font-medium">
                Staff member created successfully! Redirecting to staff list...
              </span>
            </div>
          </div>
        )}

        {/* Card container */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <StaffForm onSubmit={handleCreateStaff} disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default CreatePage;