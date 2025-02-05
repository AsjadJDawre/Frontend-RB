import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import paytm_payment_tune from "../assets/paytm_payment_tune.mp3";
const SuccessPage = () => {
  const [audio] = useState(new Audio(paytm_payment_tune));
  const navigate = useNavigate();
  useEffect(() => {
    const playAudio = () => {
      audio.play().catch((error) => console.error("Audio play failed", error));
      document.removeEventListener("mousemove", playAudio);
    };

    // Listen for the first mouse movement
    document.addEventListener("mousemove", playAudio, { once: true });

    return () => {
      document.removeEventListener("mousemove", playAudio);
    };
  }, [audio]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="flex flex-col items-center space-y-6">
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

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-white">Payment Successful!</h1>
        <p className="text-lg text-white text-center">
          Thank you for your payment. Your transaction was completed successfully.
        </p>

        {/* Button to Go Back */}
        <button
          className="mt-4 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() =>  navigate("/user-dashboard")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
