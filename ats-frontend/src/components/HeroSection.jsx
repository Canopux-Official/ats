import { motion } from "framer-motion";
import Lottie from "lottie-react";
import ResumeAiAnimation from "../assets/ResumeAiAnimation.json";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-7 relative bg-gradient-to-r from-blue-500 to-purple-600 text-white h-auto overflow-y-auto flex flex-col items-center justify-center px-6 text-center py-18 pb-2">
      {/* 🔥 Animated Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-full font-semibold shadow-md mb-4 z-10"
      >
        <FaCheckCircle className="text-green-500 text-lg" />
        Trusted by 10,000+ Job Seekers
      </motion.div>

      {/* 📝 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold z-10"
      >
        AI-Powered Resume Screening for Smarter Job Applications!
      </motion.h1>

      {/* ⚡ AI-Powered Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-2 text-md md:text-lg font-medium text-white/90 z-10"
      >
        Powered by advanced AI to boost your hiring chances.
      </motion.p>

      {/* 📊 Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-4 text-lg md:text-xl max-w-2xl z-10"
      >
        Optimize your resume, improve ATS ranking, and get job recommendations instantly.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-6 flex flex-col md:flex-row gap-4 z-10"
      >
        <button onClick={() => {navigate('/job')}} className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-6 py-3 text-center shadow-md transition">
          📂 Upload Resume
        </button>

        <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium text-sm px-6 py-3 text-center rounded-lg shadow-md transition">
          🔍 See How It Works
        </button>
      </motion.div>

      {/* 📈 Real-Time Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-6 flex flex-wrap gap-6 justify-center text-white/90 z-10"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold">50K+</h3>
          <p className="text-sm">Resumes Screened</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold">98%</h3>
          <p className="text-sm">Accuracy Rate</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold">10K+</h3>
          <p className="text-sm">Successful Placements</p>
        </div>
      </motion.div>

      {/* Lottie Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-5 w-76 md:w-96 z-10"
      >
        <Lottie animationData={ResumeAiAnimation} loop={true} />
      </motion.div>
    </div>
  );
};

export default HeroSection;
