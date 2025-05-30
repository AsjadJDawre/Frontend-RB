import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header";
import { Carousel } from "./Carousel";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight, FaClipboardList, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

function Guestdashboard() {
  const navigate = useNavigate();
  const viewDiv = useRef(null)
  useEffect(()=>{
    if(viewDiv.current){
      viewDiv.current.scrollIntoView({behavior:'smooth'})
    }
  },[])
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <Carousel />

      {/* Welcome Message */}
      <motion.div  ref={viewDiv}
        className="container mx-auto px-4 sm:px-6 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-16"  variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-4">
            Welcome to Refill Buddy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience seamless gas refill bookings with our intuitive platform. 
            <span className="block mt-2 text-blue-600 font-medium">
              Sign up to unlock exclusive features and manage your bookings effortlessly.
            </span>
          </p>
        </motion.div>

        {/* Guest Actions */}
        <motion.div 
          className="flex justify-center items-center gap-8 md:gap-16 py-8 flex-wrap"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
            <Link to="/guest-booking" className="group block">
              <div className="relative text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <img 
                  src="/Bookin-logo.webp" 
                  alt="Book Gas" 
                  className="w-40 h-40 mx-auto object-contain mt-8 group-hover:scale-105 transition-transform duration-300"
                />
                <p className="mt-6 text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Apply For Refill
                  <FaArrowRight className="inline-block ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
            <Link to="/guest-booking-history" className="group block">
              <div className="relative text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <img 
                  src="/booking-history-logo23.png" 
                  alt="Booking History" 
                  className="w-40 h-40 bg-gray-700 mx-auto object-contain mt-8 group-hover:scale-105 transition-transform duration-300"
                />
                <p className="mt-6 text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Booking History
                  <FaArrowRight className="inline-block ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
            <Link to="/guest-bookingStatus" className="group block">
              <div className="relative text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <FaClipboardList className="h-8 w-8 text-white" />
                </div>
                <img 
                  src="/application-status.png" // Replace with your actual image path
                  alt="Booking Status" 
                  className="w-40 h-40 mx-auto object-contain mt-8 group-hover:scale-105 transition-transform duration-300"
                />
                <p className="mt-6 text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Booking Status
                  <FaArrowRight className="inline-block ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
            <Link to="/guest-notice" className="group block">
              <div className="relative text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <FaBell className="h-8 w-8 text-white" />
                </div>
                <img 
                  src="/notice.png" // Replace with your actual image path
                  alt="Guest Notices" 
                  className="w-40 h-40 mx-auto object-contain mt-8 group-hover:scale-105 transition-transform duration-300"
                />
                <p className="mt-6 text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Guest Notices
                  <FaArrowRight className="inline-block ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Sign Up CTA */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 rounded-2xl shadow-2xl text-center mt-20 max-w-3xl mx-auto relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full"></div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
            Ready to experience the full potential?
          </h3>
          <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto relative z-10">
            Create your account today and enjoy seamless gas refill bookings, order tracking, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
            >
              Get Started
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Existing User? Login
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-6 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Refill Buddy
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your trusted partner for quick, safe, and seamless gas refill bookings. 
              We're committed to delivering exceptional service with every order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-white">About Us</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Company Overview</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/guest-booking" className="text-gray-400 hover:text-white transition-colors">Refill Booking</Link></li>
                <li><Link to="/guest-notice" className="text-gray-400 hover:text-white transition-colors">Notices</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Customer Support</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-white">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <FaPhoneAlt className="text-white" />
                  </div>
                  <span>+91 1122334455</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <FaEnvelope className="text-white" />
                  </div>
                  <span>support@refillbuddy.com</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <span>123 Refill Lane, Gas City, INDIA</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center space-x-6 text-xl">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors flex items-center justify-center">
              <FaFacebookF className="hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-400 transition-colors flex items-center justify-center">
              <FaTwitter className="hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 transition-colors flex items-center justify-center">
              <FaInstagram className="hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 transition-colors flex items-center justify-center">
              <FaLinkedin className="hover:scale-110 transition-transform" />
            </a>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Refill Buddy. All Rights Reserved. | 
              <a href="#" className="hover:text-white ml-2 transition-colors">Privacy Policy</a> | 
              <a href="#" className="hover:text-white ml-2 transition-colors">Terms of Service</a>
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Made with ❤️ by the Refill Buddy Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Guestdashboard;