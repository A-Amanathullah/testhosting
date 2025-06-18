import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const API_URL = 'http://localhost:8000/api/sms-templates';

const SmsTemplatePage = () => {
  const [templates, setTemplates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ name: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    setEditing(null);
    setForm({ name: '', content: '' });
    setModalOpen(true);
  };
  const openEdit = (tpl) => {
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
      if (editing) {
        const res = await axios.put(`${API_URL}/${editing.id}`, form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTemplates(templates.map(t => t.id === editing.id ? res.data : t));
      } else {
        const res = await axios.post(API_URL, form, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTemplates([...templates, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      setError('Failed to save template');
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this template?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setTemplates(templates.filter(t => t.id !== id));
      } catch (err) {
        setError('Failed to delete template');
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">SMS Templates</h1>
          <button onClick={openAdd} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">Add Template</button>
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
                      <button onClick={() => setViewing(tpl)} className="mr-2 px-3 py-1 rounded  flex items-center" title="View">
                        <FaEye className='text-blue-500'/>
                      </button>
                      <button onClick={() => openEdit(tpl)} className="mr-2 px-3 py-1 rounded  flex items-center" title="Edit">
                        <FaEdit className='text-yellow-500'/>
                      </button>
                      <button onClick={() => handleDelete(tpl.id)} className="px-3 py-1  rounded flex items-center" title="Delete">
                        <FaTrash className='text-red-600'/>
                      </button>
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
                <button onClick={handleSave} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">Save</button>
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