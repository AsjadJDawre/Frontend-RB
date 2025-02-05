import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState([]);
  const [adminQuotaData, setadminQuotaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // Default: Newest First
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL 
const navigate = useNavigate()
    useEffect(() => {
      const checkUser = async () => {
        try {
          const user = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });
          console.log("Response:", user);
          if (user.status === 200) {
  setIsAuthenticated(true);
            toast.success("You are logged in successfully");
          } else {
            console.log("user ",user)
            setLoading(true)
            setTimeout(() => {
              navigate("/login");
              
            }, 2000);
                    }
        } catch (error) {
          setLoading(true)
          console.log(error)
          // console.log("Error verifying user:", error.message);
          setTimeout(() => {
            navigate("/login");
            
          }, 2000);
              }
        finally {
          setLoading(false);  // End loading state after verification attempt
        }
      };
  
      checkUser(); // 
    }, []); // 
  

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return; 
      try {
        const response = await axios.post(`${apiUrl}/api/get-bookings`,{},{ withCredentials: true });
        if (response.status !== 200) throw new Error("Failed to fetch booking data.");

        setBookings(response.data.data.bookings);
        setadminQuotaData(response.data.data.adminQuota);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  const combinedData = [...bookings, ...adminQuotaData];

  const handleTabClick = (status) => setActiveTab(status);

const handleLogout = async () => {
  const resp = await axios
    .post(`${apiUrl}/api/logout`,{},{ withCredentials: true })
    .then((response) => {
      console.log(response.data);
      toast.success("User logged out successfully!");
setTimeout(() => {
navigate("/");
})    })
    .catch((error) => {
      console.error("Logout error:", error);
      toast.error("Logout failed, please try again!");
    });
};

  // Filter Bookings based on active tab
  const filteredBookings = combinedData.filter((booking) => {
    if (activeTab === "Pending") return booking.paymentStatus === "Pending";
    if (activeTab === "Paid") return booking.paymentStatus === "Paid";
    if (activeTab === "Rejected") return booking.adminStatus === "Rejected";
    return true; // Default to showing all if "Upcoming" is selected
  });

  // **Sort Bookings by Date**
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt) // Oldest First
      : new Date(b.createdAt) - new Date(a.createdAt); // Newest First
  });
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
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Booking History</h2>
    <button 
      onClick={handleLogout} 
      className="text-red-500 px-4 py-2 border border-red-500 rounded-xl font-semibold 
                 hover:text-white hover:bg-red-500 transition duration-300"
    >
      Log Out
    </button>
  </div>

        {/* Tab Buttons */}
        <div className="mb-4 flex mt-6 gap-2">
          {["Upcoming", "Pending", "Paid", "Rejected"].map((status) => (
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

 

          {/* Sort Button */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 bg-gray-300 rounded ml-auto"
          >
Sort by Date {sortOrder === "asc" ? "⬆️ Ascending" : "⬇️ Descending"}
</button>
        </div>

        {loading && <p className="text-blue-500">Loading bookings...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && sortedBookings.length === 0 && (
          <p className="text-gray-500">No bookings found.</p>
        )}

        {/* Display Sorted Bookings */}
        {!loading && !error && sortedBookings.length > 0 && (
          <div className="grid gap-4">
            {sortedBookings.map((booking) => (
              <div key={booking._id} className="border p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">
                  Applicant: {booking.applicantName}
                </h3>

                {/* Payment Status */}
                <p className="text-sm text-gray-600">
                  <strong>Payment Status:</strong>{" "}
                  <span
                    className={`${
                      booking.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                    } font-semibold`}
                  >
                    {booking.paymentStatus}
                  </span>
                </p>

                {/* Booking Details */}
                <div className="mt-2">
                  <h4 className="font-medium">Booking Details:</h4>
                  <ul className="text-sm text-gray-700">
                    <li><strong>Amount:</strong> ₹{booking.bookingDetails.amount}</li>
                    <li><strong>Booking Type:</strong> {booking.bookingDetails.bookingType}</li>
                    <li><strong>Total Refills:</strong> {booking.bookingDetails.totalRefill}</li>
                    <li><strong>Mobile:</strong> {booking.bookingDetails.mobile}</li>
                  </ul>
                </div>

                {/* Payment ID */}
                <p className="text-sm mt-2">
                  <strong>Payment ID:</strong>{" "}
                  <span className="text-blue-600">
                    {booking.paymentStatus === "Pending" ? "Pending" : booking.razorpayPaymentId}
                  </span>
                </p>

                {/* Admin Status */}
                <p className="text-sm mt-2">
                  <strong>Admin Status: </strong>
                  <span
                    className={`${
                      booking.adminStatus === "Rejected"
                        ? "text-red-600"
                        : booking.adminStatus === "Approved"
                        ? "text-green-600"
                        : booking.adminStatus === "Pending"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
                    {booking.adminStatus}
                  </span>
                </p>

                {/* Booking Date */}
                {booking.createdAt && (
                  <p className="text-sm mt-2">
                    <strong>Date:</strong>{" "}
                    <span className="text-blue-600">
                      {new Date(booking.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        weekday: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
    )
    : (
     <div className="text-center">
       <p>You are not authorized to access this page.</p>
     </div>
      
     )}
    </div>
  );
};

export default BookingHistory;
