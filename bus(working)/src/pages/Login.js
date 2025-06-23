import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
import { loginUser, fetchUser, checkProfileCompletion } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import GoogleAuthButton from "../components/Auth/GoogleAuthButton";
import { FaEye, FaEyeSlash } from '../admin/components/Icons';

const Login = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    // Get 'from' from query param if present (for Google login)
    const fromParam = searchParams.get("from");
    let redirectTo = fromParam || from;
    // Prevent redirecting back to /login
    if (redirectTo === "/login") redirectTo = "/";
    if (token) {
      setLoading(true);
      localStorage.setItem("token", token);
      setToken(token);
      fetchUser()
        .then(async (userData) => {
          setUser(userData);
          const needsCompletion = await checkProfileCompletion();
          if (needsCompletion) {
            navigate("/complete-profile");
          } else if (userData.role === "admin") {
            navigate("/admin", { replace: true });
          } else if (userData.role === "agent") {
            navigate("/agent", { replace: true });
          } else if (userData.role === "staff") {
            navigate("/staff-dashboard", { replace: true });
          } else {
            navigate(redirectTo, { replace: true });
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user after Google login:", error);
          setErrorMessage("Failed to authenticate. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams, setUser, setToken, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const loginResponse = await loginUser(email, password);
      localStorage.setItem("token", loginResponse.access_token);
      setToken(loginResponse.access_token);
      const userData = await fetchUser();
      setUser(userData);

      const needsCompletion = await checkProfileCompletion();
      if (needsCompletion) {
        navigate("/complete-profile");
      } else if (userData.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (userData.role === "staff") {
        navigate("/staff-dashboard", { replace: true });
      } else {
        // Prevent redirecting back to /login
        const redirectTo = from === "/login" ? "/" : from;
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else if (err.response.data.errors) {
          const allErrors = Object.values(err.response.data.errors).flat();
          setErrorMessage(allErrors.join(", "));
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 w-full max-w-3xl">
        {loading && <SpinnerOverlay />}
        <div className="flex flex-col justify-center p-8 md:p-14 w-full">
          <span className="mb-3 text-4xl font-bold">Welcome back</span>
          <span className="font-light text-gray-400 mb-8">
            Welcome back! Please enter your details
          </span>

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} method="POST">
            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                name="email"
                required
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 pr-10"
                  required
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
            <div className="w-full py-4">
              <Link to="/forgot">
                <span className="font-bold text-md">Forgot password?</span>
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 border rounded-lg mb-6 transition-all duration-200 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-primary border-primary hover:bg-primary hover:text-white hover:border"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <GoogleAuthButton>Sign in with Google</GoogleAuthButton>

          <div className="text-center text-gray-400">
            Don’t have an account?
            <Link to="/signup">
              <span className="px-2 font-bold text-blue-600 hover:text-primary">Sign up for free</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;