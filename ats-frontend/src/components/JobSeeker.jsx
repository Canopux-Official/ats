import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Marquee from "react-fast-marquee";
import { UploadCloud, ArrowRightCircle, Briefcase } from "lucide-react";
import axios from "axios";
import qs from 'qs';

const JobSeeker = () => {
  const [jobRole, setJobRole] = useState({ role: "", ids: [] }); //user selected job role
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [uniqueJobs, setUniqueJobs] = useState([]); //array of all the unique jobRoles, Will hold array of { role: string, ids: string[] }
  const [atsScore, setAtsScore] = useState(0.0);
  const [modelJobRole, setModelJobRole] = useState("");
  const [evaltext, setEvaltext] = useState({});
  const [topSuggestions, setTopSuggestions] = useState([]); // if jobRole is None, this will hold the top 3 suggestions
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState([]);
  const [expandedRole, setExpandedRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null)

  const [isCalculatingAts, setIsCalculatingAts] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      alert("Please login to access this page.");
      return navigate("/login"); // Redirect to login
    }

    try {
      const token = JSON.parse(stored).token;
      const decoded = jwtDecode(token);
      if (decoded.role !== "JOB_SEEKER") {
        setAccessDenied(true);
      } else {
        if (allJobs.length === 0) {
          fetchAllJobs()
        }
      }
    } catch (err) {
      console.error("Invalid token format:", err);
      navigate("/login");
      return
    }
  }, [navigate]);



  //this calls all the jobs in the database regardless of the job description, need to optimise it
  const fetchAllJobs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`);
      const rawJobs = response.data;

      const jobs = rawJobs.map((job) => {
      const normalizedSkills = job.skills
        .split(',')
        .map((skill) => skill.trim().toLowerCase().replace(/\./g, ''))
        .join(', ');

      return {
        ...job,
        skills: [normalizedSkills],
      };
    });

      setAllJobs(jobs);
      console.log("All jobs fetched successfully:", jobs);

      const roleMap = {};
      for (const job of jobs) {
        if (roleMap[job.jobRole]) {
          roleMap[job.jobRole].push(job.id);
        } else {
          roleMap[job.jobRole] = [job.id];
        }
      }

      // Convert roleMap to array
      const roleList = Object.entries(roleMap).map(([role, ids]) => ({
        role,
        ids,
      }));

      setUniqueJobs(roleList);
      console.log("Unique jobRoles with IDs:", roleList);
    } catch (error) {
      console.error(
        "Error fetching all jobs:",
        error.response?.data || error.message
      );
    }
  };

  //fetching job details for selected Job Role
  const fetchJobDetailsByIds = async (jobIds) => {
    try {
      console.log("inside calling function", jobIds)
      if (!Array.isArray(jobIds) || jobIds.length === 0 || jobIds.some(id => !id)) {
        console.warn("Invalid jobIds passed to fetchJobDetailsByIds:", jobIds);
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/by-ids`, {
        params: {
          ids: jobIds, // Axios handles array serialization: ?ids=1&ids=2
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
      });
      setSelectedJobDetails(response.data); // adjust based on your backend structure
    } catch (error) {
      console.error("Failed to fetch job details", error);
    }
  };

  const jobDetailsMap = useMemo(() => {
    const map = {};
    selectedJobDetails.forEach((job) => {
      map[job.id] = job;
    });
    return map;
  }, [selectedJobDetails]);

  const modelCallForResume = async () => {
    if (!resume) {
      console.error("No resume file selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const response = await axios.post(
        "https://ats-flask-prisma.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success === true) {
        console.log("Model response:", response.data.text);

        return response.data.text;
      } else {
        console.error("Model response error:");
      }
    } catch (error) {
      console.error(
        "Error sending resume to model:",
        error.response?.data || error.message
      );
    }
  };

  //need to handle the case where the user give gibberish resume and it doesnot matches the required Structure
  const getAtsScore = async (textResume) => {
    try {
      const response = await axios.post(
        "https://ats-flask-prisma.onrender.com/calculate_ats_scoreMERN",
        {
          text: textResume,
          selectedOption: jobRole.role || "",
          allJobs,
        }
      );

      console.log("Model evaluation response:", response.data);
      if (response.data.success && response.data.topMatches.length > 0) {
        const topMatch = response.data.topMatches[0];

        // Use selectedOption if provided, otherwise fall back to topMatch.jobRole
        const jobRoleToSet = response.data.selectedOption || topMatch.jobRole;
        const atsScoreToSet = topMatch["ATS Score"];
        console.log("Top match job role:", jobRoleToSet);
        console.log("Top match ATS score:", atsScoreToSet);
        console.log("Jobrole.role", jobRole.role)

        setModelJobRole(jobRoleToSet);
        setAtsScore(atsScoreToSet);

        if (jobRole.role === "") {
          const topThree = response.data.topMatches.slice(0, 3);
          setTopSuggestions(topThree);
          setAtsScore(0.0);
          setModelJobRole("");
          console.log("atsScore", atsScore, "JobRole", modelJobRole, "Resume not stored because the user has not selected any job role")
          return { atsScore: 0.0, jobRole: "" }
        } else {
          setTopSuggestions([]);
        }
        return { atsScore: atsScoreToSet, jobRole: jobRoleToSet };
      }
    } catch (error) {
      console.error(
        "Error sending data to model:",
        error.response?.data || error.message
      );
    }
  };

  const getFeedback = async (textResume) => {
    try {
      const response = await axios.post(
        "https://ats-flask-prisma.onrender.com/feedbackMERN",
        {
          text: textResume,
        }
      );
      if (response.data.success) {
        console.log("Model evaluation response:", response.data);
        setEvaltext(response.data.data);
      }
    } catch (err) {
      console.error(
        "Error getting feedback:",
        err.response?.data || err.message
      );
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setResume(file);
    } else {
      alert("Please upload a valid resume (PDF, DOC, DOCX).");
    }
  };

  const handleRoleSelect = async (role, jobIds) => {
    setSelectedRole({ role, jobIds });
    await fetchJobDetailsByIds(jobIds);
    setExpandedRole(role);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobRole || !resume) {
      alert("Please select a job role and upload your resume.");
      return;
    }

    setLoading(true); // For the main "Submit Application" button
    setAtsScore(0.0);
    setModelJobRole("");
    setEvaltext({});
    setTopSuggestions([]);
    setIsCalculatingAts(true); // Start ATS spinner
    setIsFetchingSuggestions(false); // Ensure suggestions spinner is reset
    try {
      const textResume = await modelCallForResume();
      if (!textResume) {
        alert("Could not process the resume. Please try a different file or check the file content.");
        setIsCalculatingAts(false); // Stop ATS spinner as we can't proceed
        // setLoading(false) will be handled in the finally block
        return; // Exit if resume text extraction failed
      }
      const { atsScore: score, jobRole: role } = await getAtsScore(textResume);
      setIsCalculatingAts(false);
      setIsFetchingSuggestions(true);
      await getFeedback(textResume);
      setIsFetchingSuggestions(false);

      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored.token;

      if (score != 0.0 && role != "") {
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("atsScore", score); // correct key and value
        formData.append("jobRole", role); // correct key and value

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/resumes/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Resume uploaded successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error(
        "Error uploading resume:",
        error.response?.data || error.message
      );
      alert("An error occurred during the submission. Please check the console for details.");
      setIsCalculatingAts(false);
      setIsFetchingSuggestions(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700">You must be a job seeker to view this page.</p>
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
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center py-10">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md text-black shadow-md flex justify-between items-center px-8 py-4 z-50">
        <p
          className="text-3xl font-extrabold tracking-wide cursor-pointer hover:text-blue-500 transition"
          onClick={() => navigate("/")}
        >
          AI Resume Screener
        </p>
      </nav>

      {/* Hero Section */}
      <div className="mt-5 text-center py-10 px-6 max-w-3xl">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
          Land Your Dream Job
        </h1>
        <p className="text-lg mt-4 opacity-80">
          Upload your resume & get matched instantly with top recruiters.
        </p>
      </div>

      {/* Job Roles Marquee */}
      <div className="w-full bg-white shadow-sm py-3">
        <Marquee speed={60} gradient={false} pauseOnHover>
          {uniqueJobs.map((entry, index) => (
            <span
              key={index}
              className="mx-8 text-lg font-semibold flex items-center space-x-2"
            >
              <Briefcase size={20} className="text-yellow-500" />
              {entry.role}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full px-6 py-12">
        {/* Left - Upload Form */}
        <div className="w-full max-w-lg bg-white shadow-md p-8 rounded-2xl border border-gray-300">
          <h2 className="text-4xl font-extrabold text-center mb-3">
            Get your Dream Job!
          </h2>
          <p className="text-center opacity-80 mb-6">
            Upload your resume & select a job role
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Role Selection */}
            <div>
              <label className="block text-black font-medium mb-2">
                Select Job Role
              </label>
              <select
                className="w-full p-3 border rounded-lg bg-gray-100 text-black focus:ring-2 focus:ring-blue-500 transition"
                value={jobRole.role || ""}
                onChange={(e) => {
                  const selectedRoleValue = e.target.value;
                  if (selectedRoleValue === "") { // User selected "Show General Suggestions"
                    setJobRole({ role: "", ids: [] });
                    setExpandedRole(null); // Clear details shown under the dropdown
                    setSelectedJobDetails([]);
                    setSelectedRole(null); // Clear the role that might trigger details display
                  } else {
                    const fullJobObj = uniqueJobs.find(
                      (job) => job.role === selectedRoleValue
                    );
                    if (fullJobObj) {
                      setJobRole(fullJobObj); // This jobRole.role is used by getAtsScore
                      handleRoleSelect(fullJobObj.role, fullJobObj.ids); // This fetches and displays job details under dropdown
                    }
                  }
                }}
              >
                <option value="">-- Show General Suggestions --</option>
                {uniqueJobs.map(({ role }) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              {/* Show job details when a role is selected */}
              {expandedRole && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Available Jobs for the Role: <span className="text-blue-600">{expandedRole}</span>
                  </h3>
                  {jobRole?.ids?.map((jobId) => {
                    const job = jobDetailsMap[jobId];
                    if (!job) return <p key={jobId}>Loading...</p>;

                    return (
                      <div key={job.id} className="border p-3 rounded bg-gray-50 shadow">
                        <p><strong>Job Title:</strong> {job.jobRole}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                        <p><strong>Skills:</strong> {job.skills}</p>
                        <p><strong>Experience:</strong> {job.experience} years</p>
                        <p><strong>CGPA Requirement:</strong> {job.cgpa}</p>
                        <p><strong>Job Type:</strong> {job.jobType}</p>
                        <p><strong>Company Name:</strong> {job.companyName}</p>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>


            {/* Resume Upload */}
            <div className="text-center">
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-500 p-6 rounded-lg bg-gray-50 hover:bg-gray-200 transition"
              >
                <UploadCloud size={40} className="text-blue-500" />
                <p className="text-gray-600 mt-2 font-medium">
                  {resume
                    ? resume.name
                    : "Click to upload resume (PDF, DOC, DOCX)"}
                </p>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf, .doc, .docx"
                className="hidden"
                onChange={handleResumeUpload}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition duration-300 shadow-md ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>

        {/* Right - ATS Score Section */}
        {/* Right - ATS Score Section */}
        <div className="w-full max-w-xl bg-white shadow-md p-8 rounded-2xl border border-gray-300">
          <h2 className="text-3xl font-extrabold mb-4 text-center">Results</h2>

          {/* Spinner for ATS Score Calculation / Top Suggestions Fetching */}
          {isCalculatingAts && (
            <div className="text-center py-4">
              <p className="text-lg font-semibold text-blue-600 animate-pulse">
                {jobRole.role ? "Calculating ATS Score..." : "Fetching Top Job Suggestions..."}
              </p>
            </div>
          )}

          {/* Content to display after ATS/Top Suggestions calculation is done */}
          {!isCalculatingAts && (
            <>
              {/* Case 1: A specific job role was selected by the user, AND it was matched by the model */}
              {jobRole.role && modelJobRole && atsScore > 0 && (
                <>
                  <p className="text-xl font-medium text-green-600 text-center mb-2">
                    ATS Score for <span className="font-semibold text-blue-600">{modelJobRole}</span>:
                    <span className="font-bold ml-2">{atsScore.toFixed(2)}%</span>
                  </p>
                  {/* modelJobRole is already part of the message above.
              If you need to display other details of this specific matched job, you can add them here.
           */}
                </>
              )}

              {/* Case 2: "Show General Suggestions" was selected (or no role), so display topSuggestions */}
              {/* topSuggestions are populated by getAtsScore when jobRole.role === "" */}
              {topSuggestions.length > 0 && (
                <div className="mt-4"> {/* Provides spacing if this is the primary result shown */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Top Suggested Job Roles for Your Resume:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {topSuggestions.map((job, idx) => (
                      <li key={idx}>
                        {job.jobRole} - Predicted ATS Score:{" "}
                        <span className="font-semibold text-green-600">
                          {/* Ensure job["ATS Score"] exists and is a number before calling toFixed */}
                          {typeof job["ATS Score"] === 'number' ? job["ATS Score"].toFixed(2) : 'N/A'}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Spinner for Resume Improvement Suggestions (evaltext) */}
              {/* This spinner appears after the ATS/Top Suggestions part is done, and evaltext is being fetched */}
              {isFetchingSuggestions && (
                <div className="text-center py-4 mt-6"> {/* mt-6 for spacing from previous results */}
                  <p className="text-lg font-semibold text-blue-600 animate-pulse">
                    Fetching resume improvement suggestions...
                  </p>
                </div>
              )}

              {/* Resume Improvement Suggestions (evaltext) - Displayed after fetching */}
              {!isFetchingSuggestions && evaltext && Object.keys(evaltext).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Resume Improvement Suggestions:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {Object.entries(evaltext).map(([key, value], index) => (
                      <li key={index}>
                        <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Placeholder: Shown if no specific results are ready to be displayed after all loading attempts */}
              {!loading && !isCalculatingAts && !isFetchingSuggestions &&
                !(jobRole.role && modelJobRole && atsScore > 0) && // No specific match shown
                topSuggestions.length === 0 &&                  // No top suggestions shown
                Object.keys(evaltext).length === 0 &&          // No evaltext shown
                (
                  <p className="text-center text-gray-500 mt-6">
                    Upload your resume. Your results and suggestions will appear here.
                  </p>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeeker;