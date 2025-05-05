// src/pages/Pricing.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate()
  return (
    <>
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md text-black shadow-md flex justify-between items-center px-8 py-4 z-50">
        <p
          className="text-3xl font-extrabold tracking-wide cursor-pointer hover:text-blue-500 transition"
          onClick={() => navigate("/")}
        >
          AI Resume Screener
        </p>
      </nav>
    <div className="min-h-screen bg-white p-8 text-gray-800 mt-12">
      <h1 className="text-4xl font-bold text-center mb-10">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Free</h2>
          <p className="text-lg mb-6">Perfect for individuals getting started.</p>
          <p className="text-3xl font-bold mb-4">$0</p>
          <ul className="space-y-2 mb-6">
            <li>✓ 1 Resume Scan</li>
            <li>✓ Basic Analytics</li>
            <li>✓ Email Support</li>
          </ul>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-6 shadow-lg bg-gray-100 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-4">Pro</h2>
          <p className="text-lg mb-6">For professionals and job seekers.</p>
          <p className="text-3xl font-bold mb-4">$9.99/mo</p>
          <ul className="space-y-2 mb-6">
            <li>✓ 20 Resume Scans</li>
            <li>✓ Advanced Matching</li>
            <li>✓ Priority Support</li>
          </ul>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Upgrade Now
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
          <p className="text-lg mb-6">For recruiters and hiring teams.</p>
          <p className="text-3xl font-bold mb-4">Custom</p>
          <ul className="space-y-2 mb-6">
            <li>✓ Unlimited Resume Scans</li>
            <li>✓ Custom Integrations</li>
            <li>✓ Dedicated Support</li>
          </ul>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Pricing;
