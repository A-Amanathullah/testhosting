import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, Plus, BarChart3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { 
  getLoyaltyMembers, 
  createMembersForAllUsers, 
  refreshAllMembersData, 
  getLoyaltyStatistics,
  updateMemberStatus,
  deleteLoyaltyMember,
  refreshMemberData
} from '../../../services/loyaltyMemberService';

const LoyaltyMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchMembers();
    fetchStatistics();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getLoyaltyMembers(currentPage);
      setMembers(data.data || []);
      setPagination(data);
    } catch (err) {
      alert('Failed to fetch loyalty members.');
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

  const handleCreateAllMembers = async () => {
    if (!window.confirm('Create loyalty memberships for all eligible users?')) return;
    
    try {
      setIsLoading(true);
      const result = await createMembersForAllUsers();
      alert(`Successfully created ${result.created_count} loyalty memberships.`);
      await fetchMembers();
      await fetchStatistics();
    } catch (err) {
      alert('Failed to create loyalty memberships.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAllData = async () => {
    if (!window.confirm('Refresh loyalty data for all members? This will recalculate points and update card types.')) return;
    
    try {
      setIsLoading(true);
      const result = await refreshAllMembersData();
      alert(`Successfully refreshed data for ${result.updated_count} members.`);
      await fetchMembers();
      await fetchStatistics();
    } catch (err) {
      alert('Failed to refresh loyalty data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshMemberData = async (memberId) => {
    try {
      const result = await refreshMemberData(memberId);
      alert(`Points updated: ${result.changes.points.old} → ${result.changes.points.new}\nCard type: ${result.changes.card_type.old} → ${result.changes.card_type.new}`);
      await fetchMembers();
      await fetchStatistics();
    } catch (err) {
      alert('Failed to refresh member data.');
      console.error(err);
    }
  };

  const handleToggleStatus = async (memberId, currentStatus) => {
    try {
      await updateMemberStatus(memberId, !currentStatus);
      await fetchMembers();
      await fetchStatistics();
    } catch (err) {
      alert('Failed to update member status.');
      console.error(err);
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to delete loyalty membership for ${memberName}?`)) return;
    
    try {
      await deleteLoyaltyMember(memberId);
      alert('Loyalty member deleted successfully.');
      await fetchMembers();
      await fetchStatistics();
    } catch (err) {
      alert('Failed to delete loyalty member.');
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
      <div className="flex-grow p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loyalty Members Management</h1>
            <p className="text-sm text-gray-600">Manage loyalty program memberships and track member progress</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCreateAllMembers}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Plus size={18} className="mr-2" />
              Create All Members
            </button>
            
            <button
              onClick={handleRefreshAllData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh All Data
            </button>
          </div>
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
                  members.map((member) => (
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
                          <button
                            onClick={() => handleRefreshMemberData(member.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Refresh Data"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.member_name)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
