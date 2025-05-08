import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Home } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // ✅ For redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://ats-backend-production-33eb.up.railway.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.success && data.token) {
        localStorage.setItem('token', JSON.stringify(data.token)); // ✅ Store token
        localStorage.setItem('email', JSON.stringify(formData.email)); // Store email
        alert("Login successful!");
        navigate('/');
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Home Button */}
      <Link
        to="/"
        className="fixed top-4 left-4 bg-white p-4 rounded-full text-blue-600 hover:text-blue-700 shadow-lg transition"
      >
        <Home size={28} strokeWidth={2.5} />
      </Link>

      {/* Login Form Container */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
        <div className="w-full max-w-lg bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-700 mb-8 font-medium">
            Login to continue
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-3">
            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-3 text-gray-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-4 top-3 text-gray-600" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute top-2.5 right-4 text-gray-600 hover:text-gray-800 transition"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "transparent", border: "none", padding: 0 }}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg font-bold text-white transition duration-300 ${loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600"
                }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* Signup Link */}
            <p className="text-center text-gray-800 mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
