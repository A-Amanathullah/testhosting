import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import {
  StaffTable,
  StaffModal,
  DeleteConfirmationModal
} from '../../components/staff-management';
import useStaff from '../../../hooks/useStaff';
import { createUser, updateUser, deleteUser } from '../../../services/userService';
import { getRoles } from '../../../services/roleService';
import { usePermissions } from '../../../context/PermissionsContext';

const ListPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { staff, loading, error } = useStaff(refreshKey);
  const { permissions } = usePermissions();
  
  // Helper to check permissions for Staff List
  const can = (action) => {
    if (!permissions || !permissions['Staff List']) return false;
    return !!permissions['Staff List'][action];
  };
  
  // State for roles data
  const [roles, setRoles] = useState([]);

  // Load roles
  React.useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await getRoles();
        // Filter out 'User' role from the dropdown options
        const staffRoles = rolesData.filter(role => 
          role.name.toLowerCase() !== 'user'
        );
        setRoles(staffRoles);
      } catch (err) {
        console.error('Failed to load roles:', err);
      }
    };

    loadRoles();
  }, []);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [notification, setNotification] = useState({ message: "", type: "error" });

  // Set notification with proper format
  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  // Hide notification after 3 seconds
  React.useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Permission-checked handlers
  const handleAddStaff = () => {
    if (!can('add')) {
      showNotification("You don't have permission to add staff.", "error");
      return;
    }
    setSelectedStaff(null);
    setEditModalOpen('create');
  };

  const handleEdit = (staff) => {
    if (!can('edit')) {
      showNotification("You don't have permission to edit staff.", "error");
      return;
    }
    setSelectedStaff(staff);
    setEditModalOpen('edit');
  };

  const handleDelete = (staffId) => {
    if (!can('delete')) {
      showNotification("You don't have permission to delete staff.", "error");
      return;
    }
    const staffMember = staff.find(s => s.id === staffId);
    setSelectedStaff(staffMember);
    setDeleteModalOpen(true);
  };

  const handlePrint = () => {
    if (!can('print')) {
      showNotification("You don't have permission to print staff list.", "error");
      return;
    }
    // The actual print logic should be in StaffTable, so you may want to pass this handler down
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStaff) {
      setDeleteModalOpen(false);
      return false;
    }
    
    try {
      // Log the staff member being deleted for debugging
      console.log("Attempting to delete staff member:", selectedStaff);
      
      // Call the API to delete the user
      const response = await deleteUser(selectedStaff.id);
      console.log("Delete response:", response);
      
      // Refresh the staff list
      setRefreshKey(prev => prev + 1);
      
      // Show success message
      showNotification("Staff member deleted successfully.", "success");
      
      // Close modal and reset selection
      setDeleteModalOpen(false);
      setSelectedStaff(null);
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      
      // Extract error message from response if available
      let errorMessage = "Failed to delete staff member.";
      if (err.response) {
        errorMessage = err.response.data?.message || errorMessage;
        console.error("Server response:", err.response.data);
      }
      
      // Show error notification
      showNotification(errorMessage, "error");
      
      // Don't close modal on error so user can try again
      return false;
    }
  };

  const handleUpdateStaff = async (updatedStaffData) => {
    if (editModalOpen === 'create') {
      // Creating new staff member
      try {
        const userPayload = {
          name: updatedStaffData.name,
          email: updatedStaffData.email,
          role: updatedStaffData.role.toLowerCase(), // Convert to lowercase for backend
          password: updatedStaffData.password,
        };
        
        const userDetailsPayload = {
          first_name: updatedStaffData.first_name,
          last_name: updatedStaffData.last_name,
          phone_no: updatedStaffData.contact_number,
          gender: updatedStaffData.gender,
          email: updatedStaffData.email,
          role: updatedStaffData.role.toLowerCase(),
          nic_no: updatedStaffData.nic_no,
          address: updatedStaffData.address,
          profile_image: updatedStaffData.profile_image,
        };

        await createUser(userPayload, userDetailsPayload);
        setRefreshKey(prev => prev + 1);
        showNotification("Staff member created successfully.", "success");
      } catch (err) {
        showNotification("Failed to create staff member.", "error");
      }
    } else if (selectedStaff) {
      // Updating existing staff member
      try {
        const userPayload = {
          name: updatedStaffData.name,
          email: updatedStaffData.email,
          role: updatedStaffData.role.toLowerCase(),
          password: updatedStaffData.password, // Optional - only if provided
        };
        
        const userDetailsPayload = {
          first_name: updatedStaffData.first_name,
          last_name: updatedStaffData.last_name,
          phone_no: updatedStaffData.contact_number,
          gender: updatedStaffData.gender,
          email: updatedStaffData.email,
          role: updatedStaffData.role.toLowerCase(),
          nic_no: updatedStaffData.nic_no,
          address: updatedStaffData.address,
          profile_image: updatedStaffData.profile_image,
        };

        await updateUser(selectedStaff.id, userPayload, userDetailsPayload);
        setRefreshKey(prev => prev + 1);
        showNotification("Staff member updated successfully.", "success");
      } catch (err) {
        showNotification("Failed to update staff member.", "error");
      }
    }
    setEditModalOpen(false);
  };


  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {notification.message && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow flex items-center ${
          notification.type === "success" 
            ? "bg-green-100 border border-green-400 text-green-700" 
            : "bg-red-100 border border-red-400 text-red-700"
        }`}>
          <span>{notification.message}</span>
          <button 
            className={`ml-3 font-bold ${notification.type === "success" ? "text-green-700" : "text-red-700"}`} 
            onClick={() => setNotification({ message: "", type: "error" })}
          >
            ×
          </button>
        </div>
      )}
      <div className="flex-grow p-6 overflow-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-sm text-gray-600">Manage your staff members</p>
          </div>
          {can('add') && (
            <button
              onClick={handleAddStaff}
              className="flex items-center justify-center px-4 py-2 text-white bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
              type="button"
            >
              <UserPlus size={18} className="mr-2" />
              <span>Add Staff</span>
            </button>
          )}
        </div>
        {/* Staff table */}
        {loading ? (
          <div className="text-center text-gray-500">Loading staff...</div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load staff data.</div>
        ) : (
          <StaffTable
            staff={staff}
            onEdit={can('edit') ? handleEdit : undefined}
            onDelete={can('delete') ? handleDelete : undefined}
            onViewDetails={can('view') ? handleViewDetails : undefined}
            onPrint={can('print') ? handlePrint : undefined}
            canPrint={can('print')}
            user={null}
          />
        )}
      </div>
      {/* Modals */}
      <StaffModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Staff Details: ${selectedStaff?.name}`}
        staff={selectedStaff}
        isView={true}
      />
      <StaffModal
        isOpen={editModalOpen === 'create'}
        onClose={() => setEditModalOpen(false)}
        title="Add Staff"
        staff={null}
        onSubmit={handleUpdateStaff}
        isEdit={false}
        isCreate={true}
        roles={roles} // 'User' role already filtered out during load
      />
      <StaffModal
        isOpen={editModalOpen === 'edit'}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Staff: ${selectedStaff?.name}`}
        staff={selectedStaff}
        onSubmit={handleUpdateStaff}
        isEdit={true}
        roles={roles} // 'User' role already filtered out during load
      />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        staffName={selectedStaff?.name}
      />
    </div>
  );
};

export default ListPage;