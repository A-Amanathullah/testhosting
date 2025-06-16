import { useState } from "react";
import axios from "axios";

function AdminPanel() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user", // default
      });
      const [message, setMessage] = useState("");
    
      const token = localStorage.getItem("token"); // adjust based on how you store it
    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post(
            "http://localhost:8000/api/admin/create-user",
            form,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMessage(`✅ User created: ${res.data.user.name}`);
          setForm({ name: "", email: "", password: "", role: "user" });
        } catch (err) {
          setMessage(`❌ Error: ${err.response?.data?.message || "Unknown error"}`);
        }
      };
    
      return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-md">
          <h2 className="text-xl font-bold">Admin Create User</h2>
    
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
    
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
    
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
    
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
    
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create User
          </button>
    
          {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </form>
      );
}

export default AdminPanel