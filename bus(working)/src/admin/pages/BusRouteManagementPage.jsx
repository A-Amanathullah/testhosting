import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, MapPin } from 'lucide-react';
import { getAllBusRoutes, createBusRoute, updateBusRoute, deleteBusRoute } from '../../services/busRouteService';
import AddRouteModal from '../components/bus-route/AddRouteModal';
import EditRouteModal from '../components/bus-route/EditRouteModal';
import ViewRouteModal from '../components/bus-route/ViewRouteModal';
import { usePermissions } from '../../context/PermissionsContext';

const BusRouteManagementPage = () => {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [notification, setNotification] = useState('');
  const { permissions } = usePermissions();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await getAllBusRoutes();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setNotification('Failed to fetch routes');
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.start_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.end_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoute = () => {
    setIsAddModalOpen(true);
  };

  const handleEditRoute = (route) => {
    setSelectedRoute(route);
    setIsEditModalOpen(true);
  };

  const handleViewRoute = (route) => {
    setSelectedRoute(route);
    setIsViewModalOpen(true);
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await deleteBusRoute(routeId);
        await fetchRoutes();
        setNotification('Route deleted successfully');
        setTimeout(() => setNotification(''), 3000);
      } catch (error) {
        console.error('Error deleting route:', error);
        setNotification('Failed to delete route');
        setTimeout(() => setNotification(''), 3000);
      }
    }
  };

  const handleSaveNewRoute = async (routeData) => {
    try {
      await createBusRoute(routeData);
      await fetchRoutes();
      setNotification('Route created successfully');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  };

  const handleUpdateRoute = async (routeId, routeData) => {
    try {
      await updateBusRoute(routeId, routeData);
      await fetchRoutes();
      setNotification('Route updated successfully');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  };

  // Helper to check permissions for Bus Routes
  const can = (action) => {
    if (!permissions || !permissions['Bus Routes']) return false;
    return !!permissions['Bus Routes'][action];
  };

  return (
    <div className="flex flex-col flex-grow overflow-auto bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-green-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}

      <div className="flex-grow p-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bus Route Management</h1>
          <p className="text-gray-600">Manage bus routes and their stops</p>
        </div>

        {/* Top action bar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-2.5 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {can('add') && (
            <button
              onClick={handleAddRoute}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Route
            </button>
          )}
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {route.route_name}
                      </h3>
                      {route.route_code && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {route.route_code}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {route.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {can('view') && (
                      <button
                        onClick={() => handleViewRoute(route)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {can('edit') && (
                      <button
                        onClick={() => handleEditRoute(route)}
                        className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Route"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {can('delete') && (
                      <button
                        onClick={() => handleDeleteRoute(route.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Route"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">From:</span>
                    <span className="text-sm text-gray-900">{route.start_location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">To:</span>
                    <span className="text-sm text-gray-900">{route.end_location}</span>
                  </div>
                  
                  {route.stops && route.stops.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Route Stops ({route.stops.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {route.stops.slice(0, 3).map((stop, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {stop.location_name}
                          </span>
                        ))}
                        {route.stops.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{route.stops.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No routes match your search criteria.' : 'Get started by creating your first bus route.'}
            </p>
            {!searchTerm && can('add') && (
              <button
                onClick={handleAddRoute}
                className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Route
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddRouteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewRoute}
      />
      
      <EditRouteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateRoute}
        route={selectedRoute}
      />
      
      <ViewRouteModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        route={selectedRoute}
      />
    </div>
  );
};

export default BusRouteManagementPage;
