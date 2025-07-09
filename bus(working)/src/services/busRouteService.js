// Service for bus route API calls
const BASE_URL = 'http://localhost:8000/api';

export const getAllBusRoutes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bus-routes`);
    if (!response.ok) {
      throw new Error('Failed to fetch bus routes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bus routes:', error);
    throw error;
  }
};

export const getBusRouteById = async (routeId) => {
  try {
    const response = await fetch(`${BASE_URL}/bus-routes/${routeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bus route');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bus route:', error);
    throw error;
  }
};

export const createBusRoute = async (routeData) => {
  try {
    const response = await fetch(`${BASE_URL}/bus-routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create bus route');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating bus route:', error);
    throw error;
  }
};

export const updateBusRoute = async (routeId, routeData) => {
  try {
    const response = await fetch(`${BASE_URL}/bus-routes/${routeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update bus route');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating bus route:', error);
    throw error;
  }
};

export const deleteBusRoute = async (routeId) => {
  try {
    const response = await fetch(`${BASE_URL}/bus-routes/${routeId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete bus route');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting bus route:', error);
    throw error;
  }
};
