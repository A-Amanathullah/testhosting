import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const locationService = {
  // Get all Sri Lankan locations
  getAllLocations: async () => {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  // Search locations by query
  searchLocations: async (search, limit = 20) => {
    try {
      const response = await api.get('/locations/search', {
        params: { search, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },

  // Get major stops only
  getMajorStops: async () => {
    try {
      const response = await api.get('/locations/major-stops');
      return response.data;
    } catch (error) {
      console.error('Error fetching major stops:', error);
      throw error;
    }
  },

  // Search bus trips by route
  searchBusTripsByRoute: async (fromLocation, toLocation, departureDate) => {
    try {
      console.log('API Request:', {
        from_location: fromLocation,
        to_location: toLocation,
        departure_date: departureDate
      });
      
      const response = await api.post('/bus-trips/search-by-route', {
        from_location: fromLocation,
        to_location: toLocation,
        departure_date: departureDate
      });
      
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching bus trips by route:', error);
      throw error;
    }
  }
};

export default locationService;
