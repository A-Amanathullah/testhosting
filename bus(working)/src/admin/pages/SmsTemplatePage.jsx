import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { usePermissions } from '../../context/PermissionsContext';

const API_URL = 'http://localhost:8000/api/sms-templates';

const SmsTemplatePage = () => {
  const [templates, setTemplates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ name: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Get permissions
  const { permissions } = usePermissions();

  // Helper functions to check permissions
  const hasPermission = (action) => {
    if (!permissions || !permissions['SMS Template']) return false;
    return !!permissions['SMS Template'][action];
  };

  const canAdd = () => hasPermission('add');
  const canEdit = () => hasPermission('edit');
  const canDelete = () => hasPermission('delete');

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch templates from backend
  useEffect(() => {
    setLoading(true);
    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(res => {
        setTemplates(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load templates');
        setLoading(false);
      });
  }, []);

  const openAdd = () => {
    if (!canAdd()) {
      setNotification({
        message: 'You do not have permission to add SMS templates.',
        type: 'error'
      });
      return;
    }
    setEditing(null);
    setForm({ name: '', content: '' });
    setModalOpen(true);
  };
  
  const openEdit = (tpl) => {
    if (!canEdit()) {
      setNotification({
        message: 'You do not have permission to edit SMS templates.',
        type: 'error'
      });
      return;
    }
    setEditing(tpl);
    setForm({ name: tpl.name, content: tpl.content });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Double-check permissions before saving
      if (editing && !canEdit()) {
        setNotification({
          message: 'You do not have permission to edit SMS templates.',
          type: 'error'
        });
        return;
      }
      
      if (!editing && !canAdd()) {
        setNotification({
          message: 'You do not have permission to add SMS templates.',
          type: 'error'
        });
        return;
      }
      
      if (editing) {
        const res = await axios.put(`${API_URL}/${editing.id}`, form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTemplates(templates.map(t => t.id === editing.id ? res.data : t));
        setNotification({
          message: 'Template updated successfully.',
          type: 'success'
        });
      } else {
        const res = await axios.post(API_URL, form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTemplates([...templates, res.data]);
        setNotification({
          message: 'Template created successfully.',
          type: 'success'
        });
      }
      setModalOpen(false);
    } catch (err) {
      setError('Failed to save template');
      setNotification({
        message: 'Failed to save template.',
        type: 'error'
      });
    }
  };
  const handleDelete = async (id) => {
    if (!canDelete()) {
      setNotification({
        message: 'You do not have permission to delete SMS templates.',
        type: 'error'
      });
      return;
    }
    
    if (window.confirm('Delete this template?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTemplates(templates.filter(t => t.id !== id));
        setNotification({
          message: 'Template deleted successfully.',
          type: 'success'
        });
      } catch (err) {
        setError('Failed to delete template');
        setNotification({
          message: 'Failed to delete template.',
          type: 'error'
        });
      }
    }
  };

  // List of available backend fields
  const availableFields = [
    { key: '{bus}', label: 'Bus Name/Number' },
    { key: '{date}', label: 'Date' },
    { key: '{seat}', label: 'Seat Number' },
    { key: '{user}', label: 'User Name' },
    { key: '{amount}', label: 'Amount' },
    // Add more as needed
  ];

  // Insert field at cursor position in textarea
  const insertField = (field) => {
    const textarea = document.getElementById('sms-content-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    const newContent = before + field + after;
    setForm({ ...form, content: newContent });
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + field.length;
    }, 0);
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Notification */}
        {notification.message && (
          <div className={`mb-4 p-4 rounded-md ${
            notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            <div className="whitespace-pre-line">{notification.message}</div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">SMS Templates</h1>
          {canAdd() ? (
            <button onClick={openAdd} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">Add Template</button>
          ) : (
            <button 
              onClick={() => setNotification({
                message: 'You do not have permission to add SMS templates.',
                type: 'error'
              })}
              className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            >
              Add Template
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Content</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map(tpl => (
                  <tr key={tpl.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{tpl.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{tpl.content}</td>
                    <td className="px-4 py-2 flex items-center">
                      <button onClick={() => setViewing(tpl)} className="mr-2 px-3 py-1 rounded flex items-center" title="View">
                        <FaEye className='text-blue-500'/>
                      </button>
                      {canEdit() ? (
                        <button onClick={() => openEdit(tpl)} className="mr-2 px-3 py-1 rounded flex items-center" title="Edit">
                          <FaEdit className='text-yellow-500'/>
                        </button>
                      ) : (
                        <button 
                          onClick={() => setNotification({
                            message: 'You do not have permission to edit SMS templates.',
                            type: 'error'
                          })}
                          className="mr-2 px-3 py-1 rounded flex items-center opacity-50 cursor-not-allowed" 
                          title="Edit not permitted"
                        >
                          <FaEdit className='text-gray-400'/>
                        </button>
                      )}
                      {canDelete() ? (
                        <button onClick={() => handleDelete(tpl.id)} className="px-3 py-1 rounded flex items-center" title="Delete">
                          <FaTrash className='text-red-600'/>
                        </button>
                      ) : (
                        <button 
                          onClick={() => setNotification({
                            message: 'You do not have permission to delete SMS templates.',
                            type: 'error'
                          })}
                          className="px-3 py-1 rounded flex items-center opacity-50 cursor-not-allowed" 
                          title="Delete not permitted"
                        >
                          <FaTrash className='text-gray-400'/>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {templates.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6 text-gray-400">No templates found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{editing ? 'Edit' : 'Add'} Template</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {availableFields.map(f => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => insertField(f.key)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 border border-gray-300"
                      title={f.label}
                    >
                      {f.key}
                    </button>
                  ))}
                </div>
                <textarea
                  id="sms-content-textarea"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
                <button 
                  onClick={handleSave} 
                  className={`px-4 py-2 ${
                    (editing && !canEdit()) || (!editing && !canAdd())
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-800'
                  } text-white rounded`}
                  disabled={(editing && !canEdit()) || (!editing && !canAdd())}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* View Modal */}
        {viewing && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Template Message</h2>
              <div className="mb-4">
                <div className="font-semibold mb-2">{viewing.name}</div>
                <div className="whitespace-pre-wrap text-gray-800 border rounded p-3 bg-gray-50 text-sm">
                  {viewing.content}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setViewing(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmsTemplatePage;