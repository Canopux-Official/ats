import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const jwt = parsed?.token;

        if (jwt) {
          const decoded = jwtDecode(jwt); // <- fixed
          if (decoded?.role === "JOB_SEEKER" || decoded?.role === "RECRUITER") {
            setRole(decoded.role);
          }
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    const navbarHeight = document.querySelector("nav").offsetHeight;

    if (section) {
      const offsetTop = section.offsetTop - navbarHeight - 10;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const dashboardLink = role === "RECRUITER" ? "/dashboard/Admin" : "/dashboard/User";

  return (
    <nav id="home" className="bg-white shadow-md w-full fixed top-0 z-50 h-[60px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        {/* Company Name */}
        <div className="text-2xl font-bold text-blue-600">AI Resume Screening</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={(e) => handleScroll(e, "home")}>
            Home
          </Link>
          <Link className="text-gray-700 hover:text-blue-600" onClick={(e) => handleScroll(e, "features")}>
            Features
          </Link>
          <Link className="text-gray-700 hover:text-blue-600" onClick={(e) => handleScroll(e, "how-it-works")}>
            How It Works
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
        </div>

        {/* Auth Button */}
        <div>
          {role ? (
            <Link to={dashboardLink}>
              <button
                type="button"
                className="text-white bg-gradient-to-br from-green-600 to-teal-500 hover:bg-gradient-to-bl 
                  focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 
                  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Dashboard
              </button>
            </Link>
          ) : (
            <Link to="/signup">
              <button
                type="button"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl 
                  focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 
                  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Login / Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
