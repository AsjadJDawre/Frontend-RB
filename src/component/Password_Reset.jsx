import React, { useState } from "react";
import { toast ,Toaster } from "sonner"; // For success/error messages
import { useNavigate } from "react-router-dom";
import { FiMail, FiKey } from "react-icons/fi";


function Forgot_Password() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
  const handleEmailSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/checkUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data)
        setGeneratedOtp(data.otp); // Assume API returns the OTP
        setStep(2); // Move to OTP step
        toast.success("OTP sent to your email!");
      } else {
        toast.error("Email not found!");
      }
    } catch (error) {
      toast.error("An error occurred while checking email.");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
  
      // Parse the JSON response
      const data = await response.json();
  
      if (response.status === 200) {
        console.log(data)
          toast.success("OTP verified successfully!");
          setStep(3); // Move to the next step (password reset)
      } else {
        // Handle server-side validation errors
        toast.error(data.message || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      // Handle network or other errors
      toast.error("An error occurred. Please try again.");
      console.error("Error during OTP verification:", error.message);
    }
  };
  

  const handlePasswordReset = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,otp, newPassword }),
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        setTimeout (()=>{
            navigate("/"); // Navigate to home

        },2000)
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      toast.error("An error occurred while resetting password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
            <div className="flex items-center mb-4">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b focus:outline-none flex-1"
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
            <p className="text-gray-500 mb-4">
              An OTP has been sent to your email. Please enter it below.
            </p>
            <div className="flex items-center mb-4">
              <FiKey className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="XXXX"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border-b focus:outline-none flex-1"
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <div className="flex items-center mb-4">
              <FiKey className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-b focus:outline-none flex-1"
              />
            </div>
            <button
              onClick={handlePasswordReset}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
      <Toaster richColors position ="top-right" />
    </div>
  );
}

export default Forgot_Password;
