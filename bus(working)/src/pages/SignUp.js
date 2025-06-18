import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from "react";
import { signupUser, storeUserDetails, fetchUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import GoogleAuthButton from "../components/Auth/GoogleAuthButton";
import { FaEye, FaEyeSlash } from '../admin/components/Icons';

const SignUp = () => {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formErrors, setFormErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !firstName || !lastName || !email || !password || !confirmPassword) {
      return setFormErrors(["All required fields must be filled."]);
    }

    if (password !== confirmPassword) {
      return setFormErrors(["Passwords do not match."]);
    }

    setLoading(true);
    setFormErrors([]);

    try {
      // Register user
      const { access_token, user } = await signupUser(name, email, password, 'user');
      localStorage.setItem("token", access_token);
      setToken(access_token);

      // Store additional user details
      await storeUserDetails({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone_no: phoneNo,
        gender,
        email,
        role: user.role,
      });

      // Fetch updated user data
      const userData = await fetchUser();
      setUser(userData);

      if (userData.role === "admin") {
        navigate("/adminPanel");
      } else if (userData.role === "driver") {
        navigate("/staff-dashboard");
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Signup failed:", error);
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
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-2 sm:px-4">
        <div className="relative flex flex-col m-2 sm:m-6 space-y-8 bg-white shadow-2xl rounded-2xl w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl md:flex-row md:space-y-0">
          {loading && <SpinnerOverlay />}
          <div className="flex flex-col justify-center p-4 sm:p-8 md:p-14 w-full">
            <span className="mb-3 text-2xl sm:text-3xl md:text-4xl font-bold">Register</span>
            <span className="font-light text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Welcome! Please enter your details
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

            <form method="POST" onSubmit={handleSubmit}>
              
              <div className="py-2">
                <span className="mb-2 text-md">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base"
                  name="first_name"
                />
              </div>
              <div className="py-2">
                <span className="mb-2 text-md">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base"
                  name="last_name"
                />
              </div>
              <div className="py-2">
                <span className="mb-2 text-md">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base"
                  name="email"
                />
              </div>
              <div className="py-2">
                <span className="mb-2 text-md">Phone Number</span>
                <input
                  type="text"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base"
                  name="phone_no"
                />
              </div>
              <div className="py-2">
                <span className="mb-2 text-md">Gender</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                  name="gender"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="py-2">
                <span className="mb-2 text-md">User Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base"
                  name="name"
                />
              </div>
              <div className="py-2">
                <span className="mb-2 text-md">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base pr-10"
                    name="password"
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
              <div className="py-2">
                <span className="mb-2 text-md">Confirm Password</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 text-sm sm:text-base pr-10"
                    name="confirm_password"
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
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-2 border rounded-lg my-4 sm:my-6 transition-all duration-200 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-primary border-primary hover:bg-primary hover:text-white hover:border"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <GoogleAuthButton />

            <div className="text-center text-gray-400 text-xs sm:text-sm">
              Already have an account?
              <Link to="/login">
                <span className="px-2 font-bold text-blue-600 hover:text-primary">
                  Login to your account
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;