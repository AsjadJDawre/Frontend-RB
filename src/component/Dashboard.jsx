import React, { useEffect,useState } from "react";
import "../styles/Dashboard.css";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {Carousel} from "./Carousel";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
    
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL 


//   useEffect(() => {
//     const verifyJWT = async () => {
//       try {
//         const response = await axios.get("/api/user/dashboard");
//         if (response.status === 200) {
//           // toast.success("Welcome to the dashboard!");
//           console.log("Welcome Back")
//         }
//       } catch (error) {
//         console.error("JWT verification failed:", error);
//         toast.error("Unauthorized access. Redirecting to login...");
//         navigate("/");
//       }
//     };

//     verifyJWT();
//   }, [navigate]);



  const handleLogout = async () => {
    const resp = await axios
      .post(`${apiUrl}/api/logout`, {}, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        toast.success("User logged out successfully!");

        // Delay navigation after showing the success message
        setTimeout(() => {
          navigate("/");
        }, 2000); // Wait 2 seconds before redirecting
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed, please try again.");
      });
  };

  return (
   
<>
  <Header/>
    {/* <nav className="navbar">
      <div className="navbar-logo">
        <img src="/path-to-logo-placeholder.png" alt="HP Logo" />
      </div>
      <ul className="navbar-links">
        <li>Home</li>
        <li>About Us</li>
        <li>Our Businesses</li>
        <li>Newsroom</li>
        <li>Sustainability</li>
        <li>CSR</li>
        <li>Investors</li>
        <li>Careers</li>
        <li>Quick Links</li>
      </ul>
      <div className="navbar-actions">
        <input type="text" placeholder="Search" className="search-bar" />
        <button className="search-button">🔍</button>
      </div>
    </nav> */}

      
      <Carousel></Carousel>

      <div className="p-6 bg-gray-100 border border-red-500 space-y-6" style={{'border-bottom' :'1px solid red','border-top' :'2px solid red'}}>
      <div className="flex justify-between items-center">
  <h3 className="text-[#004e8f] text-lg font-bold">Overview</h3>
  <Link to={"/login"}>
  <h3 className="text-[#004e8f] text-lg font-bold">My HP Gas Customer Login</h3>
  </Link>
  <Link to={"/guest-dashboard"}>
  <h3 className="text-[#004e8f] text-lg font-bold">View As Guest</h3>
  </Link>
</div>

      
      <p className="text-gray-700 leading-relaxed">
        HP GAS, The HPCL brand of Liquified Petroleum Gas (LPG), popularly known as cooking gas, is a mixture of hydrocarbons that are gaseous at normal temperature, but can be liquified at moderate pressure, and can be stored in cylinders as a liquid under pressure, and is drawn out and used as gas.
      </p>
      
      <h3 className="text-2xl font-semibold text-blue-700">About Your Domestic Connection</h3>
      <ul className="list-disc list-inside space-y-3 text-gray-700">
        <li>
          <a href="#" className="text-blue-600 hover:underline">How to get a new HPGAS Domestic Connection? What are the charges?</a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">Service Charges for HPGAS connection</a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">KYC - Know Your Consumer rules</a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">Name change/Regularising the HPGAS connection</a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">HPGAS Refill Booking - HPAnytime, Online on Website</a>
        </li>
        <li>
          <a href="#" className="text-blue-600 hover:underline">Other Frequently Asked Questions about HPGAS - FAQS</a>
        </li>
      </ul>

      <h3 className="text-2xl font-semibold text-blue-700">Quality</h3>
      <p className="text-gray-700 leading-relaxed">
        LPG is a colorless gas. LPG is not poisonous. However, at the time of production, Ethyl mercaptan (a chemical compound) is added to it so as to give the now-familiar foul smell for easy detection of gas in the air, in case of any leakage. Even very small quantities of gas can be detected by this smell.
      </p>

      <h3 className="text-2xl font-semibold text-blue-700">Safety</h3>
      <p className="text-gray-700 leading-relaxed">
        Since LPG is almost twice the weight of the air, it tends to settle down at floor level, particularly in depressions. Hence, care has to be taken in placing the gas installations in the house. Also, the fact that 1 cc. of liquid LPG multiplies into about 250 cc. of gaseous LPG helps it spread very rapidly in the atmosphere. Hence, if a gas cylinder leaks, it should be immediately removed to an open area.
      </p>
    </div>
    <div className="bg-blue-800 text-white py-8">
  <div className="container mx-auto px-4 space-y-6">
    {/* Logo and Tagline */}
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold tracking-wider">Refill Buddy</h2>
      <p className="text-center text-sm mt-2">
        Your trusted partner for quick and seamless gas refill bookings.
      </p>
    </div>

    {/* Links Section */}
    <div className="flex flex-wrap justify-around">
      {/* About Us */}
      <div className="w-1/3 text-center">
        <h3 className="text-xl font-semibold mb-4">About Us</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Company Overview</a></li>
          <li><a href="#" className="hover:underline">Our Mission</a></li>
          <li><a href="#" className="hover:underline">Careers</a></li>
        </ul>
      </div>

      {/* Quick Links */}
      <div className="w-1/3 text-center">
        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Refill Booking</a></li>
          <li><a href="#" className="hover:underline">FAQs</a></li>
          <li><a href="#" className="hover:underline">Customer Support</a></li>
        </ul>
      </div>

      {/* Contact Us */}
      <div className="w-1/3 text-center">
        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
        <ul className="space-y-2">
          <li>
            <span className="flex items-center justify-center space-x-2">
              <i className="fas fa-phone-alt"></i>
              <span>+1 123 456 7890</span>
            </span>
          </li>
          <li>
            <span className="flex items-center justify-center space-x-2">
              <i className="fas fa-envelope"></i>
              <span>support@refillbuddy.com</span>
            </span>
          </li>
          <li>
            <span className="flex items-center justify-center space-x-2">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Refill Lane, Gas City, INDIA</span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    {/* Social Media Section */}
    <div className="flex justify-center space-x-6 mt-6">
      <a href="#" className="text-white hover:text-gray-300"><i className="fab fa-facebook-f"></i></a>
      <a href="#" className="text-white hover:text-gray-300"><i className="fab fa-twitter"></i></a>
      <a href="#" className="text-white hover:text-gray-300"><i className="fab fa-instagram"></i></a>
      <a href="#" className="text-white hover:text-gray-300"><i className="fab fa-linkedin"></i></a>
    </div>

    {/* Footer Bottom */}
    <div className="border-t border-blue-600 mt-6 pt-4 text-center text-sm">
      <p>© 2025 Refill Buddy. All Rights Reserved.</p>
      <p>Made with ❤️ by the Refill Buddy Team.</p>
    </div>
  </div>
</div>



    </>
  );
};

export default Dashboard;
