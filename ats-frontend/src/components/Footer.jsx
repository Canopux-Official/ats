import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-purple-700  text-black py-6 h-66">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        
        {/* Quick Links */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <ul className="flex space-x-6 mt-2">
            <li><a href="#" className="hover:text-gray-700">About</a></li>
            <li><a href="#" className="hover:text-gray-700">Privacy</a></li>
            <li><a href="#" className="hover:text-gray-700">Terms</a></li>
            <li><a href="#" className="hover:text-gray-700">Contact</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-gray-200">
            <FaFacebook size={20} className="text-black" />
          </a>
          <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-gray-200">
            <FaTwitter size={20} className="text-black" />
          </a>
          <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-gray-200">
            <FaLinkedin size={20} className="text-black" />
          </a>
          <a href="#" className="p-2 bg-white rounded-full shadow hover:bg-gray-200">
            <FaInstagram size={20} className="text-black" />
          </a>
        </div>

      </div>

      {/* Copyright Section */}
      <div className="mt-4 text-center text-sm border-t border-gray-300 pt-3">
        © {new Date().getFullYear()} YourBrand. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
