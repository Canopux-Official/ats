import { FaUpload, FaRobot, FaChartLine, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <FaUpload className="text-4xl text-blue-500" />,
    title: "Upload Resume",
    description: "Drag & drop your resume file for instant analysis.",
  },
  {
    icon: <FaRobot className="text-4xl text-purple-500" />,
    title: "AI Analyzes Resume",
    description: "Our AI scans your resume and extracts key details.",
  },
  {
    icon: <FaChartLine className="text-4xl text-green-500" />,
    title: "Get ATS Score & Suggestions",
    description: "Receive an ATS-friendly score with improvement tips.",
  },
  {
    icon: <FaBriefcase className="text-4xl text-yellow-500" />,
    title: "Explore Matched Jobs",
    description: "Find jobs that match your skills & experience.",
  },
];

const WorkingSection = () => {
  return (
    <section id="how-it-works" className="py-12 bg-gradient-to-br from-blue-100 to-purple-200 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">
          How It Works (Step-by-Step Guide)
        </h2>

        {/* Horizontal Timeline for Desktop */}
        <div className="hidden md:flex justify-between items-center relative mt-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col items-center w-1/4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border-2 border-purple-400">
                {step.icon}
              </div>
              <div className="w-40 text-center mt-3">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>

              {/* Connecting Line */}
              {index !== steps.length - 1 && (
                <div className="absolute top-8 left-1/2 transform -translate-x-0 w-full h-1 bg-purple-400"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile Step-by-Step Cards */}
        <div className="md:hidden flex flex-col gap-6 mt-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center p-4 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="p-4 bg-gray-200 rounded-full">{step.icon}</div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Try Now → Upload Resume
        </motion.button>
      </div>
    </section>
  );
};

export default WorkingSection;
