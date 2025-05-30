import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import paytm_payment_tune from "../assets/paytm_payment_tune.mp3";

const GuestSuccessPage = () => {
  const [audio] = useState(new Audio(paytm_payment_tune));
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state.bookingData);
      setIsGuest(location.state.isGuest || false);
    }
  }, [location.state]);

  useEffect(() => {
    const playAudio = () => {
      audio.play().catch((error) => console.error("Audio play failed", error));
      document.removeEventListener("mousemove", playAudio);
    };

    // Only play audio for completed payments (not pay-later)
    if (bookingData?.payLater !== true) {
      document.addEventListener("mousemove", playAudio, { once: true });
    }

    return () => {
      document.removeEventListener("mousemove", playAudio);
    };
  }, [audio, bookingData]);

  const handleSignUp = () => {
    // Save booking data to session storage before navigating to signup
    sessionStorage.setItem("guestBookingData", JSON.stringify(bookingData));
    navigate("/signup");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="flex flex-col items-center space-y-6 p-4 max-w-md text-center">
        {/* Animated Done Icon */}
        <motion.div
          className="flex items-center justify-center h-32 w-32 rounded-full bg-white shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <path d="M20 6L9 17l-5-5" />
          </motion.svg>
        </motion.div>

        {/* Dynamic Success Message */}
        {isGuest ? (
          <>
            <h1 className="text-4xl font-bold text-white">
              {bookingData?.payLater 
                ? "Booking Saved!" 
                : "Demo Payment Complete!"}
            </h1>
            <p className="text-lg text-white">
              {bookingData?.payLater
                ? "Your booking has been saved locally. Sign up now to confirm it."
                : "This was a demo payment. No actual transaction occurred."}
            </p>

            {/* Booking Details */}
            <div className="bg-white bg-opacity-20 p-4 rounded-lg w-full">
              <h2 className="text-xl font-semibold text-white mb-2">Booking Details</h2>
              <p className="text-white">
                <strong>Refills:</strong> {bookingData?.refills}
              </p>
              <p className="text-white">
                <strong>Amount:</strong> ₹{bookingData?.amount}
              </p>
              <p className="text-white">
                <strong>Status:</strong> {bookingData?.status}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 w-full">
              <button
                className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={handleSignUp}
              >
                Sign Up to Confirm Booking
              </button>
              <button
                className="rounded-lg bg-transparent border-2 border-white px-6 py-3 font-medium text-white shadow-md hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => navigate("/guest-dashboard")}
              >
                Continue as Guest
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-white">Payment Successful!</h1>
            <p className="text-lg text-white">
              Thank you for your payment. Your transaction was completed successfully.
            </p>
            <button
              className="mt-4 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => navigate("/user-dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GuestSuccessPage;