import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '../../components/Pagination';
import { Users, BarChart3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { 
  getLoyaltyMembers, 
  getLoyaltyStatistics,
  updateMemberStatus,
  deleteLoyaltyMember
} from '../../../services/loyaltyMemberService';
import { usePermissions } from '../../../context/PermissionsContext';

const LoyaltyMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const recordsPerPage = 10;

  // Paginated members for current page
  const paginatedMembers = useMemo(() => (
    members.slice((currentPageLocal - 1) * recordsPerPage, currentPageLocal * recordsPerPage)
  ), [members, currentPageLocal, recordsPerPage]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const { permissions } = usePermissions();

  // Helper to check permission for Loyalty Members
  const hasPermission = (action) => {
    if (!permissions) {
      console.log('No permissions object available');
      return false;
    }
    
    // console.log('All permissions:', permissions);
    // console.log('Checking for module:', 'Loyalty Members');
    
    if (!permissions['Loyalty Members']) {
      console.log('Loyalty Members module not found in permissions');
      return false;
    }
    
    // console.log('Loyalty Members permissions:', permissions['Loyalty Members']);
    // console.log(`Checking for action: ${action}, result:`, !!permissions['Loyalty Members'][action]);
    
    return !!permissions['Loyalty Members'][action];
  };

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    fetchMembers();
    fetchStatistics();
    // console.log('LoyaltyMembersPage - Permissions:', permissions); // Debug permissions
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getLoyaltyMembers(currentPage);
      
      // Filter out members with role 'agent' - only display users with role 'user' or similar
      const filteredMembers = (data.data || []).filter(member => {
        // Skip members where user isn't defined
        if (!member.user) return true;
        
        // Check if user role is NOT 'agent' (case-insensitive)
        return !member.user.role || member.user.role.toLowerCase() !== 'agent';
      });
      
      setMembers(filteredMembers);
      setPagination(data);
    } catch (err) {
      setNotification({
        message: 'Failed to fetch loyalty members.',
        type: 'error'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await getLoyaltyStatistics();
      setStatistics(data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };



  const handleToggleStatus = async (memberId, currentStatus) => {
    try {
      await updateMemberStatus(memberId, !currentStatus);
      await fetchMembers();
      await fetchStatistics();
      setNotification({
        message: `Member status ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to update member status.',
        type: 'error'
      });
      console.error(err);
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!hasPermission('delete')) {
      setNotification({
        message: 'You do not have permission to delete loyalty members.',
        type: 'error'
      });
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete loyalty membership for ${memberName}?`)) return;
    
    try {
      await deleteLoyaltyMember(memberId);
      setNotification({
        message: 'Loyalty member deleted successfully.',
        type: 'success'
      });
      await fetchMembers();
      await fetchStatistics();
    } catch (err) {
      setNotification({
        message: 'Failed to delete loyalty member.',
        type: 'error'
      });
      console.error(err);
    }
  };

  const getCardTypeColor = (cardType) => {
    const colors = {
      'Silver': 'bg-gray-100 text-gray-800',
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Platinum': 'bg-purple-100 text-purple-800',
      'Diamond': 'bg-blue-100 text-blue-800',
    };
    return colors[cardType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {/* Notification */}
      {notification.message && (
        <div className={`mx-6 mt-4 p-4 rounded-md ${
          notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          <div className="whitespace-pre-line">{notification.message}</div>
        </div>
      )}

      {/* Debug Button - Remove in production */}
      <button 
        onClick={() => console.log('Delete permission check:', hasPermission('delete'), permissions)} 
        className="mx-6 mt-2 px-2 py-1 bg-gray-200 text-xs rounded"
      >
        Debug Permissions
      </button>
      
      <div className="flex-grow p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loyalty Members Management</h1>
            <p className="text-sm text-gray-600">Manage loyalty program memberships for regular users (agents excluded)</p>
          </div>
          
          {/* Removed manual create/refresh all members buttons as logic is now backend automated */}
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_members}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ToggleRight className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.active_members}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_points_distributed?.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Points</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.average_points_per_member}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members by Tier */}
        {statistics?.members_by_tier && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Members by Tier</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statistics.members_by_tier.map((tier) => (
                <div key={tier.card_type} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCardTypeColor(tier.card_type)}`}>
                      {tier.card_type}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{tier.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Loyalty Members</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Card Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Card Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Since
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No loyalty members found
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.member_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.user?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.card_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCardTypeColor(member.card_type)}`}>
                          {member.card_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.total_points.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.member_since).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(member.id, member.is_active)}
                          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            member.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {member.is_active ? (
                            <>
                              <ToggleRight size={14} className="mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={14} className="mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* Removed manual refresh member button as logic is now backend automated */}
                          {hasPermission('delete') && (
                            <button
                              onClick={() => handleDeleteMember(member.id, member.member_name)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {members.length > recordsPerPage && (
              <div className="flex justify-center my-4">
                <Pagination
                  page={currentPageLocal}
                  setPage={setCurrentPageLocal}
                  totalPages={Math.ceil(members.length / recordsPerPage)}
                />
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                    {currentPage} of {pagination.last_page}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyMembersPage;
