import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "What is an ATS score?",
    answer:
      "An ATS score is a ranking assigned to your resume by an Applicant Tracking System (ATS) to determine how well it matches a job description.",
  },
  {
    question: "How does job matching work?",
    answer:
      "Our AI analyzes your resume and compares it with job descriptions, highlighting missing skills and optimizing your match.",
  },
  {
    question: "Is my resume data safe?",
    answer:
      "Yes, we prioritize your privacy. Your resume is processed securely and never shared with third parties.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-blue-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          FAQs 🤔
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/30 backdrop-blur-lg border border-gray-200 rounded-xl p-5 shadow-lg cursor-pointer transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                {openIndex === index ? (
                  <FaMinus className="text-gray-600" />
                ) : (
                  <FaPlus className="text-gray-600" />
                )}
              </div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden text-gray-700 text-sm mt-2"
              >
                {openIndex === index && <p>{faq.answer}</p>}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
