import React, { useState, useMemo } from 'react';
import Pagination from '../../components/Pagination';
import { Search, Edit, Trash, Printer, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const StaffTable = ({ staff, user , onEdit, onDelete, onViewDetails, onPrint, canPrint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [selectedStaff, setSelectedStaff] = useState([]);
  
  // Sort staff based on the current sort configuration
  const sortedStaff = React.useMemo(() => {
    let sortableStaff = [...staff];
    if (sortConfig.key) {
      sortableStaff.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStaff;
  }, [staff, sortConfig]);

  // Filter staff based on search term
  const filteredStaff = React.useMemo(() => {
    return sortedStaff.filter(person => 
  person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.phone_no && person.phone_no.includes(searchTerm))
    );
  }, [sortedStaff, searchTerm]);

  // Request sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle checkboxes for selecting staff
  const handleSelectAll = () => {
    if (selectedStaff.length === filteredStaff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(filteredStaff.map(s => s.id));
    }
  };

  const handleSelectStaff = (id) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter(staffId => staffId !== id));
    } else {
      setSelectedStaff([...selectedStaff, id]);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const paginatedStaff = useMemo(() => (
    filteredStaff.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
  ), [filteredStaff, currentPage, recordsPerPage]);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Table toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search staff..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          {onPrint && (
            <button 
              onClick={onPrint} 
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              disabled={!canPrint}
              style={!canPrint ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <Printer size={18} className="mr-2" />
              Print
            </button>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStaff.length === filteredStaff.length && filteredStaff.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'ascending' 
                      ? <ChevronUp size={16} className="ml-1" /> 
                      : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('role')}
              >
                <div className="flex items-center">
                  Role
                  {sortConfig.key === 'role' && (
                    sortConfig.direction === 'ascending' 
                      ? <ChevronUp size={16} className="ml-1" /> 
                      : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortConfig.key === 'email' && (
                    sortConfig.direction === 'ascending' 
                      ? <ChevronUp size={16} className="ml-1" /> 
                      : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('phone_no')}
              >
                <div className="flex items-center">
                  Contact
                  {sortConfig.key === 'phone_no' && (
                    sortConfig.direction === 'ascending' 
                      ? <ChevronUp size={16} className="ml-1" /> 
                      : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.length > 0 ? (
              paginatedStaff.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(person.id)}
                      onChange={() => handleSelectStaff(person.id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {person.profile_image ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={`http://localhost:8000/storage/${person.profile_image}`} 
                            alt={person.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">
                              {person.name.split(' ').map(part => part.charAt(0)).join('').toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.nic_no || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {person.role ? (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        person.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        person.role === 'staff' ? 'bg-blue-100 text-blue-800' : 
                        person.role === 'driver' ? 'bg-green-100 text-green-800' : 
                        person.role === 'conductor' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {person.role.charAt(0).toUpperCase() + person.role.slice(1).replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not specified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {person.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {person.phone_no || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onViewDetails && (
                      <button
                        onClick={() => onViewDetails(person)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(person)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(person.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No staff members found matching your search' : 'No staff members found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {filteredStaff.length > recordsPerPage && (
        <div className="flex justify-center my-4">
          <Pagination
            page={currentPage}
            setPage={setCurrentPage}
            totalPages={Math.ceil(filteredStaff.length / recordsPerPage)}
          />
        </div>
      )}
    </div>
  );
};

export default StaffTable;
