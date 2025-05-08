import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Home } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: name === "role" ? (value === "job-seeker" ? "JOB_SEEKER" : "RECRUITER") : value,
    });
  };
  

  // Function to send signup data to backend
  const registerUser = async () => {
    if (!formData.email || !formData.password || !formData.role) {
      alert("Please fill in all fields before proceeding.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://ats-backend.railway.internal/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }
  
      if (data.success && data.token) {
        localStorage.setItem('token', JSON.stringify(data.token)); // ✅ Store token
        localStorage.setItem('email', formData.email); // Store email in localStorage

        alert("Signup successful!");
  
        // Reset form after successful signup
        setFormData({ email: "", password: "", role: "" });
  
        navigate("/");
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
  
      if (error.message === "Email is already registered") {
        alert("This email is already registered. Please log in instead.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!formData.email || !formData.password || !formData.role) {
      alert("Please fill in all fields before proceeding.");
      return;
    }
  
    setLoading(true);  
  
    try {
      localStorage.setItem('email', formData.email)
      await registerUser(); // Call register function only if validation passes
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Link
        to="/"
        className="fixed top-4 left-4 bg-white p-4 rounded-full text-blue-600 hover:text-blue-700 shadow-lg transition"
      >
        <Home size={28} strokeWidth={2.5} />
      </Link>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
        <div className="w-full max-w-lg bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Create an Account
          </h2>
          <p className="text-center text-gray-700 mb-8 font-medium">
            Step Into the Future of Hiring
          </p>

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
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* Role Selection Dropdown */}
            {/* Role Selection Dropdown */}
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-500 transition"
                required
              >
                <option value="" disabled>
                  Select Your Role
                </option>
                <option value="job-seeker">Job Seeker</option>
                <option value="job-recruiter">Job Recruiter</option>
              </select>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" required />
              <span className="text-gray-800">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Terms & Conditions
                </a>
              </span>
            </div>

            {/* Submit Button with Hover Effect */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg font-bold text-white transition duration-300 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing Up...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-800 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
