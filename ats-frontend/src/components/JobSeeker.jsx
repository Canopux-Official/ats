import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { UploadCloud, ArrowRightCircle, Briefcase } from "lucide-react";
import axios from "axios";

const JobSeeker = () => {
  const [jobRole, setJobRole] = useState({ role: "", ids: [] });//user selected job role
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allJobs, setAllJobs] = useState([])
  const [uniqueJobs, setUniqueJobs] = useState([]) //array of all the unique jobRoles, Will hold array of { role: string, ids: string[] }
  const [atsScore, setAtsScore] = useState(0.0)
  const [modelJobRole, setModelJobRole] = useState("")//job role given by model need to update everywhere
  const [evaltext, setEvaltext] = useState({})
  const [topSuggestions, setTopSuggestions] = useState([]); // if jobRole is None, this will hold the top 3 suggestions
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllJobs();
  }, []);

  //this calls all the jobs in the database regardless of the job description, need to optimise it
  const fetchAllJobs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/jobs");
      const jobs = response.data;
      setAllJobs(response.data);
      console.log("All jobs fetched successfully:", response.data);

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
    }
    catch (error) {
      console.error("Error fetching all jobs:", error.response?.data || error.message);
    }
  }

  const modelCallForResume = async () => {
    if (!resume) {
      console.error("No resume file selected.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume); // "resume" should match the key expected by your backend/model

      const response = await axios.post("https://ats-flask-prisma.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === true) {
        console.log("Model response:", response.data.text);

        return response.data.text; // Assuming the model returns a text response
      }
      else {
        console.error("Model response error:");
      }
    } catch (error) {
      console.error("Error sending resume to model:", error.response?.data || error.message);
    }
  };

  const getAtsScore = async (textResume) => {
    try {
      const response = await axios.post("https://ats-flask-prisma.onrender.com/calculate_ats_scoreMERN", {
        text: textResume,
        selectedOption: jobRole.role || "",
        allJobs,
      });

      console.log("Model evaluation response:", response.data);
      if (response.data.success && response.data.topMatches.length > 0) {
        const topMatch = response.data.topMatches[0];

        // Use selectedOption if provided, otherwise fall back to topMatch.jobRole
        const jobRoleToSet = response.data.selectedOption || topMatch.jobRole;
        const atsScoreToSet = topMatch["ATS Score"];
        console.log("Top match job role:", jobRoleToSet);
        console.log("Top match ATS score:", atsScoreToSet);

        setModelJobRole(jobRoleToSet);
        setAtsScore(atsScoreToSet);

        if (jobRole.role === "None") {
          const topThree = response.data.topMatches.slice(0, 3);
          setTopSuggestions(topThree);
        } else {
          setTopSuggestions([]); // Clear it if role is selected
        }

        return { atsScore: atsScoreToSet, jobRole: jobRoleToSet };
      }
    } catch (error) {
      console.error("Error sending data to model:", error.response?.data || error.message);
    }
  };

  const getFeedback = async (textResume) => {
    try {
      const response = await axios.post("https://ats-flask-prisma.onrender.com/feedbackMERN", {
        text: textResume,
      });
      if (response.data.success) {
        console.log("Model evaluation response:", response.data);
        setEvaltext(response.data.data); // Assuming the response contains feedback
      }
    }
    catch (err) {
      console.error("Error getting feedback:", err.response?.data || err.message);
    }
  }



  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)
    ) {
      setResume(file);
    } else {
      alert("Please upload a valid resume (PDF, DOC, DOCX).");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobRole || !resume) {
      alert("Please select a job role and upload your resume.");
      return;
    }
  
    setLoading(true);
    try {
      const textResume = await modelCallForResume();
      const { atsScore: score, jobRole: role } = await getAtsScore(textResume);
      await getFeedback(textResume);
  
      const stored = JSON.parse(localStorage.getItem("token"));
      const token = stored.token;
  
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("atsScore", score);      // correct key and value
      formData.append("jobRole", role);        // correct key and value
  
      const response = await axios.post("http://localhost:3000/resumes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Resume uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading resume:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center py-10">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md text-black shadow-md flex justify-between items-center px-8 py-4 z-50">
        <p className="text-3xl font-extrabold tracking-wide cursor-pointer hover:text-blue-500 transition" onClick={() => navigate("/")}>AI Resume Screener</p>
      </nav>

      {/* Hero Section */}
      <div className="mt-5 text-center py-10 px-6 max-w-3xl">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
          Land Your Dream Job
        </h1>
        <p className="text-lg mt-4 opacity-80">Upload your resume & get matched instantly with top recruiters.</p>
      </div>

      {/* Job Roles Marquee */}
      <div className="w-full bg-white shadow-sm py-3">
        <Marquee speed={60} gradient={false} pauseOnHover>
          {uniqueJobs.map((entry, index) => (
            <span key={index} className="mx-8 text-lg font-semibold flex items-center space-x-2">
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
          <h2 className="text-4xl font-extrabold text-center mb-3">Get your Dream Job!</h2>
          <p className="text-center opacity-80 mb-6">Upload your resume & select a job role</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Role Selection */}
            <div>
              <label className="block text-black font-medium mb-2">Select Job Role</label>
              <select
                className="w-full p-3 border rounded-lg bg-gray-100 text-black focus:ring-2 focus:ring-blue-500 transition"
                value={jobRole.role || ""}
                onChange={(e) => {
                  const selectedRole = e.target.value;
                  const fullJobObj = uniqueJobs.find((job) => job.role === selectedRole);
                  if (fullJobObj) {
                    setJobRole(fullJobObj);
                  }

                }}
                required
              >
                <option value="None">-- Choose a Job Role --</option>
                {uniqueJobs.map((entry, index) => (
                  <option key={index} value={entry.role}>{entry.role}</option>
                ))}
              </select>
            </div>

            {/* Resume Upload */}
            <div className="text-center">
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-500 p-6 rounded-lg bg-gray-50 hover:bg-gray-200 transition"
              >
                <UploadCloud size={40} className="text-blue-500" />
                <p className="text-gray-600 mt-2 font-medium">
                  {resume ? resume.name : "Click to upload resume (PDF, DOC, DOCX)"}
                </p>
              </label>
              <input id="resume-upload" type="file" accept=".pdf, .doc, .docx" className="hidden" onChange={handleResumeUpload} required />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition duration-300 shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>

        {/* Right - ATS Score Section */}
        <div className="hidden md:flex flex-col items-center">
          <p className="text-lg font-medium mb-2">Your ATS Score will be displayed here</p>
          <ArrowRightCircle size={24} className="text-blue-500 animate-bounce" />
          <div className="mt-4 w-60 h-40 bg-white shadow-md rounded-lg flex items-center justify-center border border-gray-300">
            <p className="text-gray-500 text-xl font-bold">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeeker;
