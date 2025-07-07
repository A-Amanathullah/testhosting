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

  const { permissions } = usePermissions();
  const [notification, setNotification] = useState("");

  // Helper to check permission for Staff List
  const hasPermission = (action) => {
    if (!permissions || !permissions['Staff List']) return false;
    return !!permissions['Staff List'][action];
  };

  // Permission-checked handlers
  const handleAddStaff = () => {
    if (!hasPermission('add')) {
      setNotification("You don't have permission to add staff.");
      return;
    }
    setSelectedStaff(null);
    setEditModalOpen('create');
  };

  const handleEdit = (staff) => {
    if (!hasPermission('edit')) {
      setNotification("You don't have permission to edit staff.");
      return;
    }
    setSelectedStaff(staff);
    setEditModalOpen('edit');
  };

  const handleDelete = (staffId) => {
    if (!hasPermission('delete')) {
      setNotification("You don't have permission to delete staff.");
      return;
    }
    const staffMember = staff.find(s => s.id === staffId);
    setSelectedStaff(staffMember);
    setDeleteModalOpen(true);
  };

  const handlePrint = () => {
    if (!hasPermission('print')) {
      setNotification("You don't have permission to print staff list.");
      return;
    }
    // The actual print logic should be in StaffTable, so you may want to pass this handler down
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStaff) {
      try {
        await deleteUser(selectedStaff.id);
        setRefreshKey(prev => prev + 1); // Refetch staff after delete
      } catch (err) {
        alert('Failed to delete staff member.');
      }
    }
    setDeleteModalOpen(false);
    setSelectedStaff(null);
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
      } catch (err) {
        alert('Failed to create staff member.');
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
      } catch (err) {
        alert('Failed to update staff member.');
      }
    }
    setEditModalOpen(false);
  };


  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-red-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}
      <div className="flex-grow p-6 overflow-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-sm text-gray-600">Manage your staff members</p>
          </div>
          <button
            onClick={handleAddStaff}
            className="flex items-center justify-center px-4 py-2 text-white bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
            type="button"
          >
            <UserPlus size={18} className="mr-2" />
            <span>Add Staff</span>
          </button>
        </div>
        {/* Staff table */}
        {loading ? (
          <div className="text-center text-gray-500">Loading staff...</div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load staff data.</div>
        ) : (
          <StaffTable
            staff={staff}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onPrint={handlePrint}
            canPrint={hasPermission('print')}
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
        isEdit={true}
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