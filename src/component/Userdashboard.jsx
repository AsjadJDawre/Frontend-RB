import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { Link } from "react-router-dom";
import {Carousel} from "./Carousel";
function Userdashboard() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL 
  useEffect(() => {
    

    const checkUser = async () => {
      try {
        console.log("i am in useEffect");
        const user = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });

        if (user.status === 200) {
          setIsAuthenticated(true);
          console.log("User authenticated successfully");
        } else {
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.log("Error verifying user:", error.message);
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    checkUser();
  }, []);

  // ✅ Logs updated state only when `isAuthenticated` changes
  useEffect(() => {
    console.log("Updated authentication state:", isAuthenticated);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="wrapper">
  {
      isAuthenticated?  ( 
<>
<Header/>
<Carousel/>

<div className="flex justify-end items-center">
  <Link 
    to="/notice" 
    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
  >
    Notice's
  </Link>
</div>



<div className="flex justify-center items-center gap-10 py-6">
  <Link to="/user-booking" className="transition-transform hover:scale-105">
    <img 
      src="/Bookin-logo.webp" 
      alt="Logo One" 
    
      className="w-64 h-64 border-2 bg-gray-600 border-gray-700 rounded-full p-4 object-contain max-w-full"
    />
  </Link>
  <Link to="/booking-history" className=" transition-transform hover:scale-105">
    <img 
      src="/booking-history-logo23.png" 
      alt="Logo Two" 
      className="w-64 h-64 border-2 border-gray-700 rounded-full bg-gray-600 p-4 object-scale-down max-w-full"
    />
  </Link>
  

</div>







<footer className="mt-auto w-full bg-gray-800 text-white py-4">

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

</footer>
</>
)
: (
 <div className="text-center">
   <p>You are not authorized to access this page.</p>
 </div>
  
 )}
</div>
)
}

export default Userdashboard