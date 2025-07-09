import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const sriLankanLocationService = {
  // Search locations for autocomplete
  searchLocations: async (query, limit = 10, majorOnly = false) => {
    try {
      const response = await api.get('/sri-lankan-locations/search', {
        params: { q: query, limit, major_only: majorOnly }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      // Return fallback locations if API fails
      return [
        { id: 1, name: 'Colombo', district: 'Colombo', province: 'Western' },
        { id: 2, name: 'Kandy', district: 'Kandy', province: 'Central' },
        { id: 3, name: 'Galle', district: 'Galle', province: 'Southern' },
        { id: 4, name: 'Jaffna', district: 'Jaffna', province: 'Northern' },
        { id: 5, name: 'Negombo', district: 'Gampaha', province: 'Western' }
      ].filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
    }
  },

  // Get major stops only
  getMajorStops: async () => {
    try {
      const response = await api.get('/sri-lankan-locations/major-stops');
      return response.data;
    } catch (error) {
      console.error('Error fetching major stops:', error);
      // Return fallback major stops
      return [
        { id: 1, name: 'Colombo', district: 'Colombo', province: 'Western' },
        { id: 2, name: 'Kandy', district: 'Kandy', province: 'Central' },
        { id: 3, name: 'Galle', district: 'Galle', province: 'Southern' },
        { id: 4, name: 'Jaffna', district: 'Jaffna', province: 'Northern' },
        { id: 5, name: 'Anuradhapura', district: 'Anuradhapura', province: 'North Central' },
        { id: 6, name: 'Batticaloa', district: 'Batticaloa', province: 'Eastern' },
        { id: 7, name: 'Trincomalee', district: 'Trincomalee', province: 'Eastern' },
        { id: 8, name: 'Kurunegala', district: 'Kurunegala', province: 'North Western' },
        { id: 9, name: 'Ratnapura', district: 'Ratnapura', province: 'Sabaragamuwa' },
        { id: 10, name: 'Badulla', district: 'Badulla', province: 'Uva' }
      ];
    }
  },

  // Get all districts
  getDistricts: async () => {
    try {
      const response = await api.get('/sri-lankan-locations/districts');
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      return ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura'];
    }
  },

  // Get locations by district
  getLocationsByDistrict: async (district) => {
    try {
      const response = await api.get(`/sri-lankan-locations/district/${district}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations by district:', error);
      return [];
    }
  }
};

export default sriLankanLocationService;
