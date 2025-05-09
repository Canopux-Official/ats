import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import { FaArrowLeft, FaBriefcase, FaBuilding, FaCalendarAlt, FaGraduationCap, FaStar } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import hiring from "../assets/hiring.json";
import Lottie from "lottie-react";
import axios from 'axios';

const JobRecuriter = () => {
  const [formData, setFormData] = useState({
    jobRole: "",
    description: "",
    skills: "",
    experience: "",
    cgpa: "",
    jobType: "",
    companyName: "",
  });
  const [refreshKey, setRefreshKey] = useState(0); // to manually trigger rerender
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [createdJobs, setCreatedJobs] = useState(true); // State to track created jobs
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null)
  // navigate hook

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      alert("Please login to access this page.");
      return navigate("/login"); // Redirect to login
    }

    try {
      const token = JSON.parse(stored).token;
      const decoded = jwtDecode(token);
      if (decoded.role !== "RECRUITER") {
        setAccessDenied(true);
      } else {
        fetchJobs()
      }
    } catch (err) {
      console.error("Invalid token format or error decoding:", err);
      localStorage.removeItem("token"); // Clear invalid token
      alert("Session invalid or expired. Please login again.");
      return navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    console.log("rerendring")
    fetchJobs()
  }, [refreshKey])
  

  


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchJobs = useCallback(async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored?.token;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/my-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data); // store all jobs in state
      console.log("Fetched jobs:", response.data);
    } catch (error) {
      console.error("Failed to fetch recruiter jobs:", error.response?.data || error.message);
    }
  });

  // Call this after posting a new job to re-fetch
  const triggerJobListUpdate = () => {
    console.log("trigger working")
    setRefreshKey(prev => prev + 1);
  };

  const createJobs = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored?.token;
      if (!token) throw new Error("No token found");

      setCreatedJobs(false);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Job posted:", response.data);
      setFormData({
        jobRole: "",
        description: "",
        skills: "",
        experience: "",
        cgpa: "",
        jobType: "",
        companyName: "",
      });
      triggerJobListUpdate()
      return true; // success
    } catch (error) {
      console.error("Error posting job:", error.response?.data || error.message);
      return false; // failure
    } finally {
      setCreatedJobs(true);
    }
  };


  //it fetches all the resumes for a particular job
  const fetchResumesForJob = async (jobId, setResumes) => {
    try {
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored.token;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${jobId}/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched resumes for job:", response.data);
      setResumes(response.data); // use your React state setter here
    } catch (error) {
      console.error("Error fetching resumes for job:", error.response?.data || error.message);
    }
  };


  const handleJobClick = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      fetchResumesForJob(jobId, setResumes);
    }
  };

  const downloadResume = async (filename) => {
    try {
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored?.token;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/resumes/${filename}`, {
        responseType: 'blob', // So the file is handled as binary
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Create a blob and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href); // Clean up memory
    } catch (error) {
      console.error("Failed to download resume:", error.response?.data || error.message);
    }
  };


  //delete a job
  const deleteJobPost = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post? This action cannot be undone.")) {
      return; // Stop if user cancels
    }

    const stored = JSON.parse(localStorage.getItem("token"));
    const token = stored?.token;
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Job deleted:", response.data.message);
      return response.data;
    } catch (error) {
      console.error("Error deleting job:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createJobs();
    if (success) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
    setShowModal(false);
    setResumes([]);
    console.log("Modal closed");
  };

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">You must be a recruiter to view this page.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-pink-200 to-blue-200">
      {/* 🔙 Back Arrow Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-50 flex items-center text-pink-600 hover:text-pink-800 transition duration-200"
      >
        <FaArrowLeft className="mr-2" />
        Home
      </button>

      {/* Left Panel with Lottie Animation */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center text-white px-10 relative">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-snug text-pink-700">
            Find the Best Talent Fast
          </h2>
          <p className="text-lg mb-6 text-pink-900 opacity-90">
            Post a job and let AI do the matching. Simplify hiring with our powerful resume screener.
          </p>
          <div className="w-72 mx-auto mb-6">
            <Lottie animationData={hiring} loop={true} />
          </div>
          <div className="text-left text-pink-900 mt-4">
            <h3 className="text-xl font-semibold mb-2">How it works:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>📢 Post a job with details and requirements</li>
              <li>🤖 Our AI screens incoming resumes</li>
              <li>🎯 Get top-matched candidates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right: Job Posting Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-lg border border-gray-200">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-600">
            📢 Post a Job
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
            <input
              type="text"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              required
              placeholder="Job Role"
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-pink-500 placeholder-gray-600"
            />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Company Name"
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-pink-500 placeholder-gray-600"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Job Description"
              rows={4}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-pink-500 placeholder-gray-600"
            />
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="Required Skills"
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-pink-500 placeholder-gray-600"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="Experience (yrs)"
                className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-pink-500 placeholder-gray-600"
              />
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                required
                placeholder="CGPA Requirement"
                className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-pink-500 placeholder-gray-600"
              />
            </div>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-pink-500 text-gray-700"
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition duration-200"
            >
              🚀 Submit Job
            </button>
          </form>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-4 md:p-6 order-2 md:order-none">
          <h2 className="text-3xl font-bold mb-6 text-center md:text-left text-pink-800">
             Your Posted Jobs ✨
          </h2>
           {/* Make this section scrollable if it exceeds viewport height */}
           <div className="space-y-4 max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"> {/* Added padding-right for scrollbar space */}
            {jobs.length === 0 ? (
              <div className="text-center py-10 px-6 bg-white rounded-xl shadow-md border border-gray-200">
                <FaBriefcase className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500 font-medium">You haven't posted any jobs yet.</p>
                <p className="text-sm text-gray-400 mt-2">Use the form to create your first job listing!</p>
              </div>
            ) : (
              jobs.map((job) => (
                // Improved Job Card
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job.id)} // Pass the whole job object
                  className="bg-white rounded-xl shadow-lg p-5 cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:ring-2 hover:ring-pink-300 border border-transparent hover:border-pink-300 group"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-pink-700 group-hover:text-pink-800">
                          {job.jobRole}
                       </h3>
                       <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full font-medium">
                           {job.jobType}
                       </span>
                  </div>

                  {/* Company Info */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FaBuilding className="mr-2 text-gray-400"/> {job.companyName}
                  </div>

                  {/* Key Details Row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 mb-3 border-t pt-3 mt-3 border-gray-100">
                     <span className="flex items-center"><FaStar className="mr-1 text-yellow-500"/> Exp: {job.experience} yrs</span>
                     <span className="flex items-center"><FaGraduationCap className="mr-1 text-blue-500"/> CGPA: {job.cgpa}+</span>
                     {/* Can add skills count or other details if needed */}
                  </div>

                  {/* Footer: Posted Date */}
                  <div className="text-xs text-gray-400 flex items-center justify-end">
                      <FaCalendarAlt className="mr-1"/> Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      {/* Detailed Job + Resumes Modal */}
      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto text-black">
            <h3 className="text-2xl font-semibold text-pink-600 mb-4">
              Job Details: {selectedJob.jobRole}
            </h3>
            <div className="text-left space-y-2 mb-6">
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <p><strong>Company Name:</strong> {selectedJob.companyName}</p>
              <p><strong>CGPA Requirement:</strong> {selectedJob.cgpa}</p>
              <p><strong>Experience:</strong> {selectedJob.experience} years</p>
              <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
              <p><strong>Skills:</strong> {selectedJob.skills}</p>
              <p><strong>Posted On:</strong> {new Date(selectedJob.createdAt).toLocaleString()}</p>
            </div>

            {resumes.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Resumes for this Job</h4>
                {resumes.map((resume) => (
                  <div key={resume.id} className="mb-4 border rounded p-3">
                    <p className="text-gray-700">File: {resume.filename}</p>
                    <p className="text-sm text-gray-500">ATS Score: {resume.atsScore}</p>
                    <button
                      onClick={() => downloadResume(resume.filename)}
                      className="text-pink-600 hover:underline"
                    >
                      View Resume
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No resumes submitted yet.</p>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={async () => {
                  try {
                    await deleteJobPost(selectedJob.id);
                    alert("Job deleted successfully");
                    triggerJobListUpdate()
                    closeModal();
                    // Optionally refresh job list
                  } catch (err) {
                    alert("Failed to delete job: " + err.response?.data?.message || err.message);
                  }
                }}
                className="px-6 py-2 mr-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Job
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal for Job Posting Success */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-2xl font-semibold text-pink-600 mb-4">🎉 Job Posted!</h3>
            <p className="text-gray-700 mb-6">Your job listing has been submitted successfully.</p>
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRecuriter;