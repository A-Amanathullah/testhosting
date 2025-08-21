import React, { useState, useEffect } from 'react';
import { agentCommissionService } from '../../../services/agentCommissionService';
import { usePermissions } from '../../../context/PermissionsContext';

const CommissionManagementPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [editingCommission, setEditingCommission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { permissions } = usePermissions();

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const response = await agentCommissionService.getAll();
      if (response.data.success) {
        setCommissions(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch commissions');
      console.error('Error fetching commissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeCommissions = async () => {
    try {
      const response = await agentCommissionService.initializeCommissions();
      if (response.data.success) {
        showNotification(response.data.message, 'success');
        fetchCommissions();
      } else {
        showNotification(response.data.message, 'error');
      }
    } catch (err) {
      showNotification('Failed to initialize commissions', 'error');
      console.error('Error initializing commissions:', err);
    }
  };

  const handleSaveCommission = async (commissionData) => {
    try {
      let response;
      if (editingCommission) {
        response = await agentCommissionService.update(editingCommission.id, commissionData);
      } else {
        response = await agentCommissionService.create(commissionData);
      }

      if (response.data.success) {
        showNotification(
          editingCommission ? 'Commission updated successfully' : 'Commission created successfully',
          'success'
        );
        fetchCommissions();
        setShowModal(false);
        setEditingCommission(null);
      } else {
        showNotification(response.data.message, 'error');
      }
    } catch (err) {
      showNotification('Failed to save commission', 'error');
      console.error('Error saving commission:', err);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
  };

  const openEditModal = (commission) => {
    setEditingCommission(commission);
    setShowModal(true);
  };

  const hasPermission = (action) => {
    return permissions && permissions['Agent Commission'] && permissions['Agent Commission'][action];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading commissions...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {notification.message}
          <button 
            className="ml-3 font-bold" 
            onClick={() => setNotification({ message: '', type: '' })}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex-grow p-6 overflow-auto">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Commission Management</h1>
            <p className="text-sm text-gray-500">Manage agent commission rates and settings.</p>
          </div>
          <div className="flex gap-3">
            {hasPermission('add') && (
              <button
                onClick={initializeCommissions}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Initialize Missing Commissions
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Commissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {commission.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        commission.commission_type === 'percentage' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {commission.commission_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {commission.commission_type === 'percentage' 
                        ? `${commission.commission_value}%` 
                        : `Rs. ${commission.commission_value}`
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        commission.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {commission.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {commission.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(commission.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {hasPermission('edit') ? (
                        <button
                          onClick={() => openEditModal(commission)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Edit
                        </button>
                      ) : (
                        <span className="text-gray-400">No access</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {commissions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No agent commissions found.</p>
              {hasPermission('add') && (
                <button
                  onClick={initializeCommissions}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Initialize Default Commissions
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Edit Commission */}
      {showModal && (
        <CommissionModal
          commission={editingCommission}
          onSave={handleSaveCommission}
          onClose={() => {
            setShowModal(false);
            setEditingCommission(null);
          }}
        />
      )}
    </div>
  );
};

// Commission Modal Component (Edit Only)
const CommissionModal = ({ commission, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    commission_type: commission?.commission_type || 'percentage',
    commission_value: commission?.commission_value || '',
    is_active: commission?.is_active ?? true,
    notes: commission?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Edit Commission - {commission?.user_name}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Commission Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Type
            </label>
            <select
              name="commission_type"
              value={formData.commission_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          {/* Commission Value */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Value
            </label>
            <div className="relative">
              <input
                type="number"
                name="commission_value"
                value={formData.commission_value}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">
                  {formData.commission_type === 'percentage' ? '%' : 'Rs.'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Commission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionManagementPage;
