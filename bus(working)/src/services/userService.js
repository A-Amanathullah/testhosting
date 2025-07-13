import axios from "../utils/axiosConfig";
import { getToken } from "../utils/auth";

const API_URL = "/api";

// Helper for error handling
// Helper for error handling (used in the service functions)

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createUser = async (user, userDetails) => {
  // Create user
  const response = await axios.post(`${API_URL}/admin/create-user`, user, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const createdUser = response.data.user;
  
  // Create user details with FormData for file upload support
  const formData = new FormData();
  formData.append('user_id', createdUser.id);
  formData.append('email', createdUser.email);
  formData.append('role', createdUser.role);
  
  Object.keys(userDetails).forEach(key => {
    if (userDetails[key] !== null && userDetails[key] !== undefined) {
      if (key === 'profile_image') {
        // Only append profile_image if it's a File (new upload)
        if (userDetails[key] instanceof File) {
          formData.append(key, userDetails[key]);
        }
        // Skip if it's a string (existing image path)
      } else {
        formData.append(key, userDetails[key]);
      }
    }
  });
  
  await axios.post(`${API_URL}/user-details`, formData, {
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  
  // Return combined user and details
  return { ...createdUser, ...userDetails };
};

export const updateUser = async (id, user, userDetails) => {
  // Update user details with FormData for file upload support
  const formData = new FormData();
  formData.append('user_id', id);
  formData.append('email', user.email);
  formData.append('role', user.role);
  
  Object.keys(userDetails).forEach(key => {
    if (userDetails[key] !== null && userDetails[key] !== undefined) {
      if (key === 'profile_image') {
        // Only append profile_image if it's a File (new upload)
        if (userDetails[key] instanceof File) {
          formData.append(key, userDetails[key]);
        }
        // Skip if it's a string (existing image path)
      } else {
        formData.append(key, userDetails[key]);
      }
    }
  });
  
  const response = await axios.post(`${API_URL}/user-details`, formData, {
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return { id, ...user, ...response.data.user_detail };
};

export const deleteUser = async (id) => {
  try {
    // Delete user by ID
    const response = await axios.delete(`${API_URL}/user/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete user.";
    console.error(`Delete user error (ID: ${id}):`, errorMessage, error);
    throw error; // Re-throw for component-level handling
  }
};
