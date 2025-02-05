import axios from "axios";
import React, { useEffect, useState } from "react";

const Test = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('i am in use effect')
        const response = await axios.post("/api/get-bookings"); 
        console.log('My response',response)
        if (!response.status === 200) {
          throw new Error("Failed to fetch booking data.");
        }
        console.log("trying",response.data.bookings)
        const data = response.data.bookings
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []
);

console.log('FROM FORNT',bookings);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Booking History</h2>

      {loading && <p className="text-blue-500">Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-gray-500">No bookings found.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">
                Applicant: {booking.applicantName}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Payment Status:</strong>{" "}
                <span
                  className={`${
                    booking.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {booking.paymentStatus}
                </span>
              </p>
              <div className="mt-2">
                <h4 className="font-medium">Booking Details:</h4>
                <ul className="text-sm text-gray-700">
                  <li>
                    <strong>Amount:</strong> ₹{booking.bookingDetails.amount}
                  </li>
                  <li>
                    <strong>Booking Type:</strong>{" "}
                    {booking.bookingDetails.bookingType}
                  </li>
                  <li>
                    <strong>Total Refills:</strong>{" "}
                    {booking.bookingDetails.totalRefill}
                  </li>
                  <li>
                    <strong>Mobile:</strong> {booking.bookingDetails.mobile}
                  </li>
                </ul>
              </div>
              <p className="text-sm mt-2">
                <strong>Payment ID:</strong>{" "}
                <span className="text-blue-600">{booking.razorpayPaymentId}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Test;
