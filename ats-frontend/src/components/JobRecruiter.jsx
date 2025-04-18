import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import { FaArrowLeft } from "react-icons/fa"; // left arrow icon
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
  // useEffect(() => {
  //   fetchJobs();
  // }, [refreshKey]);

  const [showModal, setShowModal] = useState(false);
  const [createdJobs, setCreatedJobs] = useState(true); // State to track created jobs
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // to manually trigger rerender
  const navigate = useNavigate(); // navigate hook

  //this is the sample response stored in resume state after the corresponding function is called
  // [
  //   {
  //     "id": "resume001",
  //     "filename": "john_doe_resume.pdf",
  //     "path": "uploads/john_doe_resume.pdf", //use this to display or download the file
  //     "mimetype": "application/pdf",
  //     "size": 204800,
  //     "uploadedAt": "2025-04-11T10:15:30.000Z",
  //     "jobRole": "Frontend Web Developer",
  //     "atsScore": 92.5,
  //     "userId": "user123"
  //   },
  //   {
  //     "id": "resume002",
  //     "filename": "jane_smith_resume.pdf",
  //     "path": "uploads/jane_smith_resume.pdf",
  //     "mimetype": "application/pdf",
  //     "size": 198000,
  //     "uploadedAt": "2025-04-10T08:45:00.000Z",
  //     "jobRole": "Frontend Web Developer",
  //     "atsScore": 87.0,
  //     "userId": "user456"
  //   }
  // ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //fetches all jobs posted by the recruiter
  //working fine, but need to handle the case when the recruiter has no jobs posted
  const fetchJobs = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored?.token;

      const response = await axios.get("http://localhost:3000/jobs/my-jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data); // store all jobs in state
      console.log("Fetched jobs:", response.data);
    } catch (error) {
      console.error("Failed to fetch recruiter jobs:", error.response?.data || error.message);
    }
  };

  // Call this after posting a new job to re-fetch
  const triggerJobListUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const createJobs = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored.token;
      if (!token) {
        console.error("No token found. Please log in again.");
        return;
      }
      setCreatedJobs(false)
      const response = await axios.post(
        'http://localhost:3000/jobs',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //accept a success message from the backend Not created till now
      console.log('Job posted:', response.data);
      // Show success message or navigate
      setCreatedJobs(true)
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
      // Show error message to user
    } finally {
      setCreatedJobs(true)
    }
  }

  //it fetches all the resumes for a particular job
  const fetchResumesForJob = async (jobId, setResumes) => {
    try {
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored.token;
  
      const response = await axios.get(`http://localhost:3000/jobs/${jobId}/resumes`, {
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

  //calling the funtion, make sure to pass the jobId
  //use the below function example when rendering all jobs in the ui
  // {jobs.map((job) => (
  //   <div
  //     key={job.id}
  //     onClick={() => handleJobClick(job.id)} // 👈 Pass the jobId here
  //     className="p-4 border-b cursor-pointer hover:bg-gray-100"
  //   >
  //     <h3 className="text-lg font-semibold">{job.jobRole}</h3>
  //     <p>{job.description}</p>
  //     <p className="text-sm text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
  //   </div>
  // ))}
  //the response will be stored in resume
  
  const handleJobClick = (jobId) => {
    fetchResumesForJob(jobId, setResumes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(true);
    createJobs();

  };

  const closeModal = () => {
    setShowModal(false);
  };

  //create a section where the recruiter can see all the jobs posted by him
  //handle the case of the recuriter has no jobs
  //if (jobs.length === 0) {
  // return <p>No jobs found.</p>;
  // }
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
              <li>🎯 Get top-matched candidates instantly</li>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-2xl font-semibold text-pink-600 mb-4">
              🎉 Job Posted!
            </h3>
            <p className="text-gray-700 mb-6">
              Your job listing has been submitted successfully.
            </p>
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
