import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:8000';

// Allow axios to send and receive cookies
axios.defaults.withCredentials = true;

// Helper function to fetch CSRF token
export const getCsrfToken = async () => {
  try {
    // This will hit the sanctum/csrf-cookie endpoint and set the CSRF cookie
    await axios.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

// Add a request interceptor to include the XSRF-TOKEN in all requests
axios.interceptors.request.use(
  (config) => {
    // Get the XSRF token from cookies
    const token = getCookieValue('XSRF-TOKEN');
    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to get cookie value by name
function getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? match[3] : null;
}

export default axios;
