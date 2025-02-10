import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [bookings, setBookings] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc"); // Default: Newest First
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  console.log(loading)
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL 
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });

        if (user.status === 200 ) {
setIsAuthenticated(true);
          toast.success("You are logged in successfully");
        } else {
          setTimeout(() => {
            navigate("/login");
            
          }, 2000);
                }
      } catch (error) {
        // console.log("Error verifying user:", error.message);
        setTimeout(() => {
          navigate("/login");
          
        }, 2000);
            }
      finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);      }
    };

    checkUser(); // 
  }, [navigate]); // 



// console.log("this is the bookings length : ",bookings.length)
  useEffect(() => {
    if (!isAuthenticated) return; // Only execute if user is authenticated

    const fetchBookings = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/get-Allbookings`,{},{ withCredentials: true });
        if (response.status !== 200) {
          throw new Error("Failed to fetch booking data.");
        }
        // console.log('This is the response: ',response)
        // console.log(response.data.adminQuota);
        setBookings(response.data.adminQuota);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [isAuthenticated]);

  const handleTabClick = (status) => {
    setActiveTab(status);
  };

  const handleAction = async (id, action) => {
    try {
      const response=await axios.post(`${apiUrl}/api/update-booking`, { id, status: action },{ withCredentials: true });
      setBookings((prev) => prev.map((booking) => 
        booking._id === id ? { ...booking, adminStatus: action } : booking
      ));
      if(response.status===200){
        console.log("Booking status updated successfully");
        toast.success("Booking status updated successfully");
      }
    } catch (error) {
      console.error("Error updating booking status", error);
    }
  };


  const filteredBookings = activeTab === "Upcoming"
  ? bookings
  : bookings.filter((booking) => booking.adminStatus === activeTab);

const sortedBookings = [...filteredBookings].sort((a, b) => {
  return sortOrder === "asc"
    ? new Date(a.createdAt) - new Date(b.createdAt)
    : new Date(b.createdAt) - new Date(a.createdAt);
});

  const [userDetails, setUserDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user details from API
  const fetchUserDetails = async (applicantId) => {
    try {
      const response = await axios.post(`${apiUrl}/api/getUserDetails`, { applicantId },{ withCredentials: true });

      if (response.status !== 200)  {
        throw new Error("Failed to fetch user details");
      }
      // console.log("Get User a:",response.data.user)
      const data = response.data.user;
      setUserDetails(data);
      setIsModalOpen(true); // Open modal when data is received
    } catch (error) {
      toast.error("Error fetching user details!");
      console.error(error);
    }
  };
  const handleLogout = async () => {
    const resp = await axios
      .post(`${apiUrl}/api/logout`,{},{ withCredentials: true })
      .then((response) => {
        // console.log(response.data);
        toast.success("User logged out successfully!");
setTimeout(() => {
  navigate("/");
})    })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed, please try again!");
      });
  };

  // console.log("Address Data:", userDetails.address);
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
      <Header />
      <div className="container mx-auto p-4">
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
    <button onClick={handleLogout} className="text-red-500 px-4 py-2 border border-red-500 rounded-xl font-semibold 
                      hover:text-white hover:bg-red-500 transition duration-300">
      Log Out
    </button>
  </div>
  <div className="mb-4 flex mt-8 items-center">

  <div className="flex gap-2">
    {["Upcoming", "Approved", "Rejected"].map((status) => (
      <button
        key={status}
        className={`px-4 py-2 rounded ${
          activeTab === status ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleTabClick(status)}
      >
        {status}
      </button>
    ))}
  </div>
  {/* Sort Button */}
  <button
    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
    className="px-4 py-2 bg-gray-300 rounded ml-auto"
    >
Sort by Date {sortOrder === "asc" ? "⬆️ Ascending" : "⬇️ Descending"}
</button>
<button className="px-4 py-2 bg-gray-300 rounded ml-auto" onClick={() => navigate("/admin-message")}>Message</button>
</div>


        {loading && <p className="text-blue-500">Loading bookings...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && sortedBookings.length === 0 && (
          <p className="text-gray-500">No bookings found.</p>
        )}

        {!loading && !error && sortedBookings.length > 0 && (
          <div className="grid gap-4">
            {sortedBookings.map((booking) => (
              <div
                key={booking._id}
                className="border p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">
                  Applicant: {booking.applicantName}
                </h3>
                <p className="text-sm text-gray-600">
  <strong>Payment Status:</strong> 
  <span className={`font-semibold ${booking.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
    {booking.paymentStatus}
  </span>
</p>

                <div className="mt-2">
                  <h4 className="font-medium">Booking Details:</h4>
                  <ul className="text-sm text-gray-700">
                    <li><strong>Amount:</strong> ₹{booking.bookingDetails.amount}</li>
                    <li><strong>Booking Type:</strong> {booking.bookingDetails.bookingType}</li>
                    <li><strong>Total Refills:</strong> {booking.bookingDetails.totalRefill}</li>
                    <li><strong>Mobile:</strong> {booking.bookingDetails.mobile}</li>
                  </ul>
                </div>
                <p className="text-sm mt-2">
                  <strong>Payment ID:</strong> <span className="text-blue-600">{booking.paymentStatus === "Pending" ? "Pending" : booking.razorpayPaymentId}</span>
                </p>
                <p className="text-sm mt-2">
                  <strong>Admin Status : </strong> <span className="text-blue-600">{booking.adminStatus }</span>
                </p>
                {booking.createdAt && (
                  <p className="text-sm mt-2">
                    <strong>Date:</strong> <span className="text-blue-600">{new Date(booking.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      weekday: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}</span>
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleAction(booking._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleAction(booking._id, "Rejected")}
                  >
                    Reject
                  </button>
                  <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-yellow-400"
        onClick={() => fetchUserDetails(booking.applicantId)}
      >
        View User Details
      </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

            {/* Modal */}
            {isModalOpen && userDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">User Details</h2>
            <div className="space-y-2">
              <p>
                <strong className="text-gray-700">Name:</strong>{" "}
                <span className="text-blue-600">{userDetails.firstName+ " "+ userDetails.middleName +" "+ userDetails.lastName}</span>
              </p>
              <p>
                <strong className="text-gray-700">Email:</strong>{" "}
                <span className="text-blue-600">{userDetails.email}</span>
              </p>
              {userDetails.address ? (
  <>
    <p><strong>Address:</strong></p>
    <ul>
      {Object.entries(userDetails.address).map(([key, value]) => (
        <li key={key}><strong>{key}:</strong> {String(value)}</li>
      ))}
    </ul>
  </>
) : (
  <p>No Address Available</p>
)}

            </div>
            {/* Close Button */}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right"  expand={true} />

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
};

export default AdminDashboard;
