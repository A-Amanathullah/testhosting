import axios from "../utils/axiosConfig";
import { signupUser } from "./authService";

const API_URL = "/api";

// Create staff with user registration
export const createStaffWithUser = async (staffData) => {
  // 1. Register user using shared signupUser
  const userRes = await signupUser(
    staffData.name,
    staffData.email,
    staffData.password,
    staffData.role
  );
  const { access_token, user } = userRes;


  // 3. Prepare staff data (FormData for file upload)
  const formData = new FormData();
  formData.append('user_id', user.id);
  formData.append('name', staffData.name || '');
  formData.append('contact_number', staffData.contact_number || '');
  formData.append('nic_no', staffData.nic_no || '');
  formData.append('address', staffData.address || '');
  formData.append('email', staffData.email || '');
  formData.append('role', staffData.role || '');
  // Ensure permissions is sent as array, not stringified JSON
  if (Array.isArray(staffData.permissions)) {
    staffData.permissions.forEach((perm, idx) => {
      formData.append(`permissions[${idx}]`, perm);
    });
  }
  if (staffData.profile_image instanceof File) {
    formData.append('profile_image', staffData.profile_image);
  }

  // 4. Create staff record
  const staffRes = await axios.post(
    `${API_URL}/staffs`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return { user, staff: staffRes.data };
};

// Update staff
export const updateStaff = async (id, staffData, token) => {
  const formData = new FormData();
  if (staffData.name) formData.append('name', staffData.name);
  if (staffData.contact_number) formData.append('contact_number', staffData.contact_number);
  if (staffData.nic_no) formData.append('nic_no', staffData.nic_no);
  if (staffData.address) formData.append('address', staffData.address);
  if (staffData.email) formData.append('email', staffData.email);
  if (staffData.role) formData.append('role', staffData.role);
  formData.append('permissions', JSON.stringify(staffData.permissions || []));
  if (staffData.profile_image instanceof File) {
    formData.append('profile_image', staffData.profile_image);
  }
  const res = await axios.post(
    `${API_URL}/staffs/${id}?_method=PUT`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return res.data;
};

// Delete staff
export const deleteStaff = async (id, token) => {
  const res = await axios.delete(`${API_URL}/staffs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
