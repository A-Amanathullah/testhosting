import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { storeUserDetails, fetchUser } from "../services/authService";

const CompleteProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    gender: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_no: user.phone_no || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone_no || !formData.gender) {
      return setFormErrors(["Phone number and gender are required."]);
    }

    setLoading(true);
    setFormErrors([]);

    try {
      await storeUserDetails({
        user_id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_no: formData.phone_no,
        gender: formData.gender,
        email: formData.email,
        role: user.role,
      });

      const userData = await fetchUser();
      setUser(userData);

      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "agent") {
        navigate("/agent");
      } else if (userData.role === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      if (error.response?.data?.errors) {
        const serverErrors = Object.values(error.response.data.errors).flat();
        setFormErrors(serverErrors);
      } else if (error.response?.data?.message) {
        setFormErrors([error.response.data.message]);
      } else {
        setFormErrors(["An unexpected error occurred. Please try again."]);
      }
    } finally {
      setLoading(false);
    }
  };

  const SpinnerOverlay = () => (
    <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
      <div className="w-16 h-16 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-2 sm:px-4">
      <div className="relative flex flex-col m-2 sm:m-6 space-y-8 bg-white shadow-2xl rounded-2xl w-full max-w-xs sm:max-w-md md:max-w-lg">
        {loading && <SpinnerOverlay />}
        <div className="flex flex-col justify-center p-4 sm:p-8 md:p-12">
          <span className="mb-3 text-2xl sm:text-3xl font-bold">Complete Your Profile</span>
          <span className="font-light text-gray-400 mb-6 text-sm sm:text-base">
            Please provide the missing details to complete your profile.
          </span>

          {formErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <ul className="list-disc list-inside">
                {formErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="py-2">
              <span className="mb-2 text-md">First Name</span>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                disabled
              />
            </div>
            <div className="py-2">
              <span className="mb-2 text-md">Last Name</span>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                disabled
              />
            </div>
            <div className="py-2">
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                disabled
              />
            </div>
            <div className="py-2">
              <span className="mb-2 text-md">Phone Number</span>
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="py-2">
              <span className="mb-2 text-md">Gender</span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 border rounded-lg my-4 transition-all duration-200 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-primary border-primary hover:bg-primary hover:text-white hover:border"
              }`}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;