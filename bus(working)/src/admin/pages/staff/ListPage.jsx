import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { 
  StaffTable, 
  StaffModal, 
  DeleteConfirmationModal 
} from '../../components/staff-management';
import useStaff from '../../../hooks/useStaff';
import { deleteStaff, updateStaff } from '../../../services/staffService';
import { AuthContext } from '../../../context/AuthContext';

const ListPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { token } = useContext(AuthContext);
  const { staff, loading, error } = useStaff(refreshKey);
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setViewModalOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditModalOpen(true);
  };

  const handleDelete = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    setSelectedStaff(staffMember);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStaff) {
      try {
        await deleteStaff(selectedStaff.id, token);
        setRefreshKey(prev => prev + 1); // Refetch staff after delete
      } catch (err) {
        alert('Failed to delete staff.');
      }
    }
    setDeleteModalOpen(false);
    setSelectedStaff(null);
  };

  const handleUpdateStaff = async (updatedStaffData) => {
    if (selectedStaff) {
      try {
        await updateStaff(selectedStaff.id, updatedStaffData, token);
        setRefreshKey(prev => prev + 1); // Refetch staff after update
      } catch (err) {
        alert('Failed to update staff.');
      }
    }
    setEditModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-sm text-gray-600">Manage your staff members</p>
          </div>
          <Link 
            to="/admin/staff/create" 
            className="flex items-center justify-center px-4 py-2 text-white bg-red-700 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
          >
            <UserPlus size={18} className="mr-2" />
            <span>Add Staff</span>
          </Link>
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
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Staff: ${selectedStaff?.name}`}
        staff={selectedStaff}
        onSubmit={handleUpdateStaff}
        isEdit={true}
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