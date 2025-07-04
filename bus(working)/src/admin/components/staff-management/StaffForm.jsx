import React, { useState, useEffect } from 'react';
import { storeUserDetails } from '../../../services/authService';

const StaffForm = ({ onSubmit, initialData = null, isEdit = false, disabled = false }) => {  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    email: '',
    address: '',
    role: '',
    nic_no: '',
    password: '',
    confirmPassword: '',
    profile_image: null,
    first_name: '',
    last_name: '',
    gender: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  
  // If initialData is provided (for editing), populate the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Don't populate password fields in edit mode
        password: '',
        confirmPassword: '',
        // Removed: permissions: initialData.permissions || [],
      });
    }
  }, [initialData]);

  // When role changes, set default permissions (only if not editing existing staff)
  useEffect(() => {
    if (!isEdit && formData.role) {
      setFormData((prev) => ({
        ...prev,
        // Removed: permissions: ROLE_DEFAULT_PERMISSIONS[formData.role] || [],
      }));
    }
  }, [formData.role, isEdit]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_image: file
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    // Required field validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.contact_number.trim()) newErrors.contact_number = "Contact number is required";
    else if (!phoneRegex.test(formData.contact_number)) newErrors.contact_number = "Please enter a valid 10-digit phone number";
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address";
    
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.nic_no.trim()) newErrors.nic_no = "NIC number is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    
    // Password validation (not required in edit mode if left empty)
    if (!isEdit || (formData.password || formData.confirmPassword)) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...dataToSubmit } = formData;
      if (isEdit && !dataToSubmit.password) {
        const { password, ...dataWithoutPassword } = dataToSubmit;
        await onSubmit(dataWithoutPassword);
      } else {
        await onSubmit(dataToSubmit);
      }
      // After user/staff creation, send user_details
      if (formData.user_id) {
        // Call user-details API (assume storeUserDetails is imported)
        await storeUserDetails({
          user_id: formData.user_id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_no: formData.contact_number,
          gender: formData.gender,
          email: formData.email,
          role: formData.role,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center col-span-1 space-y-4 md:col-span-2">
          <div className="flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-200 border-2 border-gray-300 rounded-full">
            {formData.profile_image ? (
              <img 
                src={typeof formData.profile_image === 'string' ? `http://localhost:8000/storage/${formData.profile_image}`  : URL.createObjectURL(formData.profile_image)} 
                alt="Profile Preview" 
                className="object-cover w-full h-full" 
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <label className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleImageUpload}
            />
            Upload Photo
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name *</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name *</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
        </div>

        

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.contact_number ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.contact_number && <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* NIC Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">NIC Number *</label>
          <input
            type="text"
            name="nic_no"
            value={formData.nic_no}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.nic_no ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.nic_no && <p className="mt-1 text-sm text-red-600">{errors.nic_no}</p>}
        </div>        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select a role</option>
            <option value="Superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="data_entry_operator">Data Entry Operator</option>
            <option value="conductor">Conductor</option>
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
        </div>

        {/* New fields for user_details */}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>
      </div>

        {/* Address */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`mt-1 block w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">User Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEdit ? 'Password (leave blank to keep current)' : 'Password *'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEdit ? 'Confirm Password (leave blank to keep current)' : 'Confirm Password *'}
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500`}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>

        

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {disabled ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Staff' : 'Create Staff')}
        </button>
      </div>
    </form>
  );
};

export default StaffForm;
