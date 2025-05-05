import React from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
const Contact = () => {
    const navigate = useNavigate()
  return (
    <div>
        <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md text-black shadow-md flex justify-between items-center px-8 py-4 z-50">
        <p
          className="text-3xl font-extrabold tracking-wide cursor-pointer hover:text-blue-500 transition"
          onClick={() => navigate("/")}
        >
          AI Resume Screener
        </p>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto mt-32 p-8 bg-white shadow-lg rounded-lg"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">Get in Touch</h1>

        <div className="space-y-4 text-lg text-gray-700">
          <p>
            <strong>Email:</strong> contact@yourcompany.com
          </p>
          <p>
            <strong>Phone:</strong> +91 98765 43210
          </p>
          <p>
            <strong>Address:</strong> 123 Tech Street, Bangalore, India – 560001
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
