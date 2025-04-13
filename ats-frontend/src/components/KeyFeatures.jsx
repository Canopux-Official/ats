import { FaFileAlt, FaSearch, FaChartBar, FaLightbulb, FaBullseye } from "react-icons/fa";

const features = [
  {
    icon: <FaFileAlt className="text-4xl text-purple-500" />,
    title: "Resume Parsing & Analysis",
    description: "Extracts skills, experience & education.",
  },
  {
    icon: <FaSearch className="text-4xl text-blue-500" />,
    title: "Job Description Matching",
    description: "Finds missing skills & improves match.",
  },
  {
    icon: <FaChartBar className="text-4xl text-pink-500" />,
    title: "ATS Score Calculation",
    description: "Gives a match score for optimization.",
  },
  {
    icon: <FaLightbulb className="text-4xl text-yellow-500" />,
    title: "Improvement Suggestions",
    description: "Provides formatting & content fixes.",
  },
  {
    icon: <FaBullseye className="text-4xl text-green-500" />,
    title: "Job Category Prediction",
    description: "Suggests best job roles for your skills.",
  },
];

const KeyFeatures = () => {
  return (
    <section id="features" className="py-12 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-6">
          Why Choose Our AI Resume Screener?
        </h2>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {/* First 3 Features */}
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition">
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
            </div>
          ))}

          {/* Last 2 Features Centered */}
          <div className="col-span-3 flex justify-center gap-6">
            {features.slice(3, 5).map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition w-80">
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto gap-4 py-4 px-2">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center min-w-[200px] p-4 bg-gray-100 rounded-lg shadow-md">
              {feature.icon}
              <h3 className="text-lg font-semibold mt-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
