import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from '../components/Icons';

const initialForm = {
  name: '',
  email: '',
  role: 'user',
  password: '',
  confirm_password: '',
  first_name: '',
  last_name: '',
  phone_no: '',
  gender: '',
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data.filter(u => u.role === 'user'));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      confirm_password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_no: user.phone_no || '',
      gender: user.gender || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        setFormError('Failed to delete user.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setFormError(null);
    setSubmitting(true);
    if (!editingUser && form.password !== form.confirm_password) {
      setFormError('Passwords do not match.');
      setSubmitting(false);
      return;
    }
    const userPayload = {
      name: form.name,
      email: form.email,
      role: form.role,
      password: form.password,
    };
    const userDetailsPayload = {
      first_name: form.first_name,
      last_name: form.last_name,
      phone_no: form.phone_no,
      gender: form.gender,
      email: form.email,
      role: form.role,
    };
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, userPayload, userDetailsPayload);
        setUsers(users.map(u => (u.id === editingUser.id ? updated : u)));
      } else {
        const created = await createUser(userPayload, userDetailsPayload);
        setUsers([...users, created]);
      }
      setShowForm(false);
      setEditingUser(null);
      setForm(initialForm);
    } catch (err) {
      if (err.response && err.response.data) {
        const msg = err.response.data.message || 'Failed to save user.';
        const details = err.response.data.errors ? Object.values(err.response.data.errors).flat().join(' ') : '';
        setFormError(`${msg} ${details}`.trim());
      } else {
        setFormError('An unexpected error occurred.');
      }
    }
    setSubmitting(false);
  };

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.phone_no?.toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">User Management</h1>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-2 mr-4 w-60"
            />
            <button className="px-4 py-2 bg-blue-700 text-white rounded" onClick={() => { setShowForm(true); setEditingUser(null); setForm(initialForm); }}>Add User</button>
          </div>
          <table className="min-w-full mb-6">
            <thead>
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">First Name</th>
                <th className="text-left py-2">Last Name</th>
                <th className="text-left py-2">Phone</th>
                <th className="text-left py-2">Gender</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id || user.email} className="border-t">
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.role}</td>
                  <td className="py-2">{user.first_name}</td>
                  <td className="py-2">{user.last_name}</td>
                  <td className="py-2">{user.phone_no}</td>
                  <td className="py-2">{user.gender}</td>
                  <td className="py-2 flex gap-2">
                    <button title="Edit" className="p-2 bg-yellow-500 text-white rounded-full" onClick={() => handleEdit(user)}><FaEdit /></button>
                    <button title="Delete" className="p-2 bg-red-600 text-white rounded-full" onClick={() => handleDelete(user.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal for Add/Edit User */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => { setShowForm(false); setEditingUser(null); setForm(initialForm); }}>&times;</button>
                <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && <div className="text-red-600 text-sm font-medium">{formError}</div>}
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Password {editingUser ? '(Leave blank to keep unchanged)' : ''}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full border rounded px-3 py-2 pr-10"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required={!editingUser}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full border rounded px-3 py-2 pr-10"
                          value={form.confirm_password}
                          onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword(v => !v)}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.phone_no} onChange={e => setForm({ ...form, phone_no: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Gender</label>
                    <select className="w-full border rounded px-3 py-2" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="submit" className={`px-4 py-2 bg-blue-700 text-white rounded${submitting ? ' opacity-50 cursor-not-allowed' : ''}`} disabled={submitting}>{submitting ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update' : 'Create')}</button>
                    <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => { setShowForm(false); setEditingUser(null); setForm(initialForm); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;