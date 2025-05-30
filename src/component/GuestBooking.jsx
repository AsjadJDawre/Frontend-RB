import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function GuestBooking() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [value, setValue] = useState(0);
  const [PayLater, setPayLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [mobileError, setMobileError] = useState("");
  const [QuotaLeftAfterUpdate, setQuotaLeftAfterUpdate] = useState(5);
  const [Disable, setDisable] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    bookingType: "Book for Self",
    optionType: "Mobile Number",
    inputValue: "",
  });

  // Mock consumer details (in a real app, these would come from an API)
  const [consumerDetails, setConsumerDetails] = useState({
    name: "Suresh Kumar",
    consumerNumber: "HPG123456789",
    agencyName: "GRAMIN VITARAK",
    deliveryAddress: "Ward No. 5, Gandhi Nagar\nNear Post Office\nNew Delhi - 110001"
  });

  // Initialize quota on first mount
  useEffect(() => {
    const storedQuota = parseInt(localStorage.getItem("QuotaLeftAfterUpdate"), 10);
    if (!isNaN(storedQuota)) {
      setQuotaLeftAfterUpdate(storedQuota);
    } else {
      localStorage.setItem("QuotaLeftAfterUpdate", 5);
      setQuotaLeftAfterUpdate(5);
    }
  }, []);

  useEffect(() => {
    setDisable(Number(QuotaLeftAfterUpdate) === 0);
  }, [QuotaLeftAfterUpdate]);

  const handleIncrease = () => {
    if (value < Number(QuotaLeftAfterUpdate)) {
      setValue((prev) => prev + 1);
    } else {
      toast.error("You have reached your refill limit.");
    }
  };

  const handleDecrease = () => {
    setValue((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setFormData({ ...formData, inputValue: input });

    if (formData.optionType === "Mobile Number") {
      if (!/^\d{0,10}$/.test(input)) {
        setMobileError("Mobile number must contain only digits (max 10).");
      } else if (input.length === 10 && !/^\d{10}$/.test(input)) {
        setMobileError("Please enter a valid 10-digit mobile number.");
      } else {
        setMobileError("");
      }
    }
  };

  const handleRadioChange = (key, value) => {
    setFormData({ ...formData, [key]: value, inputValue: "" });
  };

  const validateInput = () => {
    if (!formData.inputValue.trim()) {
      toast.error("Please fill in the required information.");
      return false;
    }

    if (
      formData.optionType === "Mobile Number" &&
      !/^\d{10}$/.test(formData.inputValue)
    ) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (value === 0) {
      toast.error("Please select at least one refill.");
      return false;
    }

    if (value > Number(QuotaLeftAfterUpdate)) {
      toast.error("Selected refills exceed remaining quota.");
      return false;
    }

    return true;
  };

  const handleProceed = () => {
    if (Number(QuotaLeftAfterUpdate) === 0) {
      toast.error("You have reached your refill limit.");
      return;
    }

    if (!validateInput()) return;

    setTotalAmount(value * 950);
    setStep(2); // Move to consumer details confirmation
  };

  const handleBack = () => setStep(step - 1);

  const handleConfirmDetails = () => {
    setStep(3); // Move to payment options
  };

  const getInputPlaceholder = () => {
    switch (formData.optionType) {
      case "Mobile Number":
        return "Enter linked mobile number";
      case "Consumer Number":
        return "Enter consumer number";
      case "LPG ID":
        return "Enter LPG ID";
      default:
        return "";
    }
  };

  const simulatePayment = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setLoading(false);
  };

  const handleProceedToPayment = async () => {
    if (!validateInput()) return;

    await simulatePayment();

    const bookingData = {
      id: `guest-${Date.now()}`,
      amount: totalAmount,
      refills: value,
      bookingDetails: formData,
      consumerDetails: consumerDetails,
      payLater: PayLater,
      status: PayLater ? "Pending" : "Payment Completed",
      createdAt: new Date().toISOString(),
    };

    const guestBookings = JSON.parse(localStorage.getItem("guestBookings") || "[]");
    guestBookings.push(bookingData);
    localStorage.setItem("guestBookings", JSON.stringify(guestBookings));

    // Update quota locally and in storage
    setQuotaLeftAfterUpdate((prev) => {
      const updated = prev - value;
      localStorage.setItem("QuotaLeftAfterUpdate", updated);
      return updated;
    });

    toast.success(
      PayLater
        ? "Your booking is saved locally. Please sign up to confirm it."
        : "Booking completed successfully (demo). Sign up to make it official."
    );

    setTimeout(() => {
      navigate("/booking-success", {
        state: {
          bookingData,
          isGuest: true,
        },
      });
    }, 500);
  };

  return (
    <div className="wrapper">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-screen text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Processing Payment, Please wait...</p>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <div className={`fixed top-36 right-4 px-6 py-3 rounded-lg shadow-xl text-lg font-semibold border-2 ${Disable ? "bg-red-500 text-white border-red-700" : "bg-blue-500 text-white border-blue-700"}`}>
            <span className="font-bold">Remaining Quota:</span> {QuotaLeftAfterUpdate}
          </div>

          {/* Progress Steps */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center relative">
              {/* Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
              {/* Steps */}
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {stepNumber}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {stepNumber === 1 ? "Booking Info" : stepNumber === 2 ? "Confirm Details" : "Payment"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  HP Gas (Guest Booking)
                </h2>

                {/* Booking Options */}
                <div className="mb-6">
                  {["Book for Self", "Book for Others"].map((type) => (
                    <label key={type} className="block text-gray-700 mb-2">
                      <input
                        type="radio"
                        name="bookingType"
                        className="mr-2"
                        value={type}
                        checked={formData.bookingType === type}
                        onChange={(e) => handleRadioChange("bookingType", e.target.value)}
                      />
                      {type}
                    </label>
                  ))}
                </div>

                {/* Option Type */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Choose Option</h4>
                  {["Mobile Number", "Consumer Number", "LPG ID"].map((option) => (
                    <label key={option} className="block text-gray-700 mb-2">
                      <input
                        type="radio"
                        name="optionType"
                        className="mr-2"
                        value={option}
                        checked={formData.optionType === option}
                        onChange={(e) => handleRadioChange("optionType", e.target.value)}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    {formData.optionType}
                  </h4>
                  <input
                    type={formData.optionType === "Mobile Number" ? "tel" : "text"}
                    placeholder={getInputPlaceholder()}
                    value={formData.inputValue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.optionType === "Mobile Number" && mobileError && (
                    <p className="text-red-600 text-sm mt-1">{mobileError}</p>
                  )}
                </div>

                {/* Quantity Selector */}
                <h2 className="text-lg font-medium text-gray-800 mb-2">
                  Enter number of refills
                </h2>
                <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded shadow-md w-48 mb-6">
                  <button
                    onClick={handleDecrease}
                    className="w-8 h-8 bg-red-500 text-white text-lg flex items-center justify-center rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={value}
                    className="w-16 text-center bg-white border border-gray-300 rounded text-lg"
                  />
                  <button
                    onClick={handleIncrease}
                    disabled={value >= QuotaLeftAfterUpdate}
                    className={`w-8 h-8 text-white text-lg flex items-center justify-center rounded ${
                      value >= QuotaLeftAfterUpdate
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition duration-200"
                >
                  Proceed
                </button>
              </>
            ) : step === 2 ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Confirm Consumer Details
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="font-semibold">{consumerDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Consumer Number</p>
                      <p className="font-semibold">{consumerDetails.consumerNumber}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Agency Name</p>
                    <p className="font-semibold">{consumerDetails.agencyName}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                    <p className="font-semibold whitespace-pre-line">{consumerDetails.deliveryAddress}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500">Refills Booked</p>
                    <p className="font-semibold">{value}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="font-semibold text-lg">₹{totalAmount}</p>
                  </div>
                </div>

                <div className="flex justify-between space-x-4">
                  <button
                    onClick={handleBack}
                    className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmDetails}
                    className="w-1/2 bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600"
                  >
                    Confirm & Proceed
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Payment Options (Demo)
                </h2>

                <div className="mb-4">
                  <p className="font-medium text-gray-800">Distributor:</p>
                  <p className="text-gray-700">CHIRAYU GAS SERVICE</p>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-gray-800">Total Amount:</p>
                  <p className="text-gray-700">₹{totalAmount}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={!PayLater}
                      disabled={Disable}
                      onChange={() => setPayLater(false)}
                      className="mr-2"
                    />
                    Pay Now (Demo)
                  </label>
                  <label className="block text-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      checked={PayLater}
                      onChange={() => setPayLater(true)}
                      className="mr-2"
                    />
                    Pay Later
                  </label>
                </div>

                <div className="flex justify-between space-x-4">
                  <button
                    onClick={handleBack}
                    className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={Disable}
                    className={`w-1/2 py-2 rounded-md font-semibold transition duration-200 ${
                      Disable
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GuestBooking;