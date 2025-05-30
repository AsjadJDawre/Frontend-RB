import React, { useEffect, useState } from "react";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";

const GuestBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("guestBookings")) || [];
    setBookings(storedBookings);
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "Paid") return booking.status === "Payment Completed";
    if (activeTab === "Pending") return booking.status === "Pending";
    return true;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="wrapper">
      <Header />
      <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl shadow-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600  bg-clip-text">
           🧾<span className="text-transparent"> Guest Booking History  </span> 
          </h2> 
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-3">
          {["All", "Paid", "Pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="ml-auto px-4 py-2 bg-gray-300 hover:bg-gray-400 text-sm rounded-full transition-all"
          >
            Sort by {sortOrder === "asc" ? "⬆️ Oldest" : "⬇️ Newest"}
          </button>
        </div>

        {sortedBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-10 animate-pulse">
            No bookings found.
          </p>
        ) : (
          <div className="grid gap-5">
            <AnimatePresence>
              {sortedBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)" }}
                  className="border p-5 rounded-xl bg-white shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Guest ID: {booking.id}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        booking.status === "Payment Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>

                  <div className="mt-3">
                    <h4 className="font-medium text-gray-800">Booking Details:</h4>
                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                      <li><strong>Amount:</strong> ₹{booking.amount}</li>
                      <li><strong>Refills:</strong> {booking.refills}</li>
                      <li><strong>Booking Type:</strong> {booking.bookingDetails?.bookingType}</li>
                      <li>
                        <strong>Input ({booking.bookingDetails?.optionType}):</strong>{" "}
                        {booking.bookingDetails?.inputValue}
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm mt-3">
                    <strong>Date:</strong>{" "}
                    <span className="text-blue-600">
                      {new Date(booking.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestBookingHistory;
