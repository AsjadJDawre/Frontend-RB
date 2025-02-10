import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import{toast , Toaster} from "sonner"
function Booking() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [value, setValue] = useState(0);
  const [PayLater, setPayLater]=useState(false)
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL 
      useEffect(() => {
      const checkUser = async () => {
        try {
          const user = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });
  
          if (user.status === 200) {
  setIsAuthenticated(true);
            toast.success("You are logged in successfully");
          } else {
            navigate("/login");
          }
        } catch (error) {
          // console.log("Error verifying user:", error.message);
          navigate("/login");
        }
        finally {
          setLoading(false);  // End loading state after verification attempt
        }
      };
  
      checkUser(); // 
    }, []); // 
  
  const [QuotaLeftAfterUpdate ,setQuotaLeftAfterUpdate]=useState(0)
const [Disable , setDisable]=useState(false)
  const [formData, setFormData] = useState({
    bookingType: "Book for Self",
    optionType: "Mobile Number",
    inputValue: "",
  });

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


  useEffect(() => {
    if (!isAuthenticated) return; 
    const fetchQuota = async () => {
      try {
        const resp = await axios.post(`${apiUrl}/api/get-quota`, {}, { withCredentials: true });
        const quotaLeft = resp.data.RefillsQuotaLeft;
    
        // Update state
        setQuotaLeftAfterUpdate(quotaLeft);
    
        // Set disable based on the fetched value
        if (quotaLeft === 0) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      } catch (error) {
        console.error("Error fetching quota:", error.message);
      }
    };
    
    fetchQuota()
  },[isAuthenticated])
  const [step, setStep] = useState(1); // Step 1: Booking Form, Step 2: Payment Options
  const handleIncrease = () => setValue((prev) => prev + 1);
  const handleDecrease = () => setValue((prev) => (prev > 0 ? prev - 1 : 0)); // Prevent negative values
  const [refillLeft, setRefillLeft] = useState(0);
  useEffect(() => {
    console.log("useEffect is running");
    const getRefillLeft = async () => {
      try {
        const response = await axios.get("/api/get-refill-left", {
          withCredentials: true,
        });
        // console.log("API Response:", response); // Log the full response
        const refills = response.data.Total_Refill;
        setRefillLeft(refills);
        // console.log("from Booking to browser Log ", refills); // Log refills
      } catch (error) {
        console.log("Error in API call:", error.message);
      }
    };
    getRefillLeft();
  }, [isAuthenticated]);
  
  

  // useEffect(() => {
  //   const checkUser =async  ()=>{
  //     const response = await axios.post('/api/check-user', {}, { withCredentials: true });

  //     console.log(response)
  //     if (response.data.status === 401) {

  //       navigate('/login');
  //     }
  //   }
  //  checkUser()
  // },[])


  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, inputValue: e.target.value });
  };

  // Handle radio button changes
  const handleRadioChange = (key, value) => {
    setFormData({ ...formData, [key]: value, inputValue: "" });
  };

  // Proceed to payment step
  const handleProceed = () => {
    if (!formData.inputValue.trim()) {
      alert("Please fill in the required information.");
      return;
    }
    setTotalAmount(value *950)

    setStep(2);
  };

  // Back to booking form (optional feature)
  const handleBack = () => {
    setStep(1);
  };

  // Get dynamic placeholder based on selected optionType
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

  // Handle payment with Razorpay
  const handleProceedToPayment = async ( ) => {

    // console.log("QuotaLeftAfterUpdate",QuotaLeftAfterUpdate)
      if(QuotaLeftAfterUpdate===0){
        try {
          // console.log("Paylater : ",PayLater)
          const response = await axios.post(
            `${apiUrl}/api/create-booking-adminQuota`,
            {
              amount: totalAmount,
              refills: value,
              bookingDetails: formData,
              payLater: PayLater,
            },
            { withCredentials: true }
          );
        if(response.status===200){
          console.log('Hello')
          navigate('/successful-AdminBooking');
        }
       
          console.log("Booking successful:", response.data);
        } catch (error) {
          console.error("Error creating booking:", error.response?.data || error.message);
          alert(error.response?.data?.message || "Something went wrong!");
        }
        
        return
      }
    if (PayLater) {
      // Create booking without Razorpay details when Pay Later is selected
      try {
        const response = await axios.post(`${apiUrl}/api/create-booking`, {
          amount: totalAmount,
          refills: value,
          bookingDetails: formData,
          payLater: true,  // Include PayLater flag
        }, { withCredentials: true });
  
        // console.log(response.data);
        if(response.status===200){
          // console.log('The reponse of booking : ',response)
        const   UpdatedQuota = response.data.data.QuotaLeftAfterUpdate
        // console.log("This is my updated Quota",UpdatedQuota);
        
          setQuotaLeftAfterUpdate(UpdatedQuota)
          toast.success("Booking Created Successfully!  Payment is Pending.");
          navigate('/successful Booking');

        }
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("Error creating booking. Please try again.");
      }
      return; // Exit after creating booking without payment
    }
    

    const RAZORPAY_KEY_ID = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID;
// console.log('this is my style',RAZORPAY_KEY_ID)
    try {
      // Step 1: Fetch user details for Razorpay prefill
      const userResponse = await axios.get(`${apiUrl}/api/user-details`, {
        withCredentials: true, // Ensure cookies are sent
      });
  
      if (userResponse.data.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
  
      const userDetails = userResponse.data;
      // console.log("User Details for Prefill:", userDetails);
  
      // Step 2: Send booking data and create Razorpay order
      const bookingResponse = await axios.post(
        `${apiUrl}/api/create-order`,
        {
          amount: totalAmount, // Dynamic amount
          currency: "INR",
          bookingDetails: formData, // Booking form data
          refills: value, // Additional details
        },
        { withCredentials: true }
      );
  
      const order = bookingResponse.data;
      // console.log("Booking Order:", order);
      // console.log("Razorpay OrderId:", order.order.id);

  
      // const RAZORPAY_KEY_ID = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID;
  
      
      // Step 3: Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "HP Gas Booking",
        description: "Gas Cylinder Booking Payment",
        order_id: order.order.id,
        handler: async (response) => {
          try {
            // console.log("this is my response L :",response)
         const   razorpay_signature1 = response.razorpay_signature

            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
        
            // console.log("Sending payload to /api/verify-payment:", payload);
        
            const verifyResponse = await axios.post(
              `${apiUrl}/api/verify-payment`,
              payload,
              { withCredentials: true }
            );
        
            const verifyResult = verifyResponse.data;
  
            if (verifyResult.success) {
              alert("Payment Successful!");
  
              // Step 5: Save booking details in the database
              const bookingSaveResponse = await axios.post(
                `${apiUrl}/api/create-booking`,
                {
                  amount: totalAmount,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpay_Signature:razorpay_signature1,
                  bookingDetails: formData,
                  refills: value,
                },
                { withCredentials: true }
              );
  
              if (bookingSaveResponse.data) {
                // console.log("Booking Created:", bookingSaveResponse.data);
                navigate('/successful Booking ')
                alert("Booking Created Successfully!");
              }
            } else {
              alert("Payment Verification Failed!");
            }
          } catch (verifyError) {
            console.error("Error verifying payment:", verifyError);
            alert("Payment Verification Error!");
          }
        },
        prefill: {
          name: userDetails?.fullName || "", // Dynamic user name
          email: userDetails?.email || "", // Dynamic user email
          contact: userDetails?.contact || "", // Dynamic user contact
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      // Step 6: Open Razorpay checkout
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login", { replace: true });
      } else {
        console.error("An error occurred:", error);
      }
      alert("Something went wrong. Please try again.");
    }
  };
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
<div className="container mx-auto p-4">
  <div className="flex justify-between items-center mb-4">
    <button 
      onClick={handleLogout} 
      className="text-red-500 px-4 py-2 border border-red-500 rounded-xl font-semibold 
                 hover:text-white hover:bg-red-500 transition duration-300"
    >
      Log Out
    </button>
  </div>
</div>


<div
  className={`fixed top-36 right-4 px-6 py-3 rounded-lg shadow-xl text-lg font-semibold border-2 ${
    Disable
      ? "bg-red-500 text-white border-red-700" // Warning theme
      : "bg-blue-500 text-white border-blue-700" // Inform theme
  }`}
>
  <span className="font-bold">Remaining Quota:</span> {QuotaLeftAfterUpdate}
</div>



<div className="max-w-md mt-4 mx-auto p-6 bg-white shadow-lg rounded-lg">
      {step === 1 ? (
        // Booking Form
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            HP Gas
          </h2>

          {/* Booking Options */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              <input
                type="radio"
                name="bookingType"
                className="mr-2"
                value="Book for Self"
                checked={formData.bookingType === 'Book for Self'}
                onChange={(e) => handleRadioChange('bookingType', e.target.value)}
              />
              Book for Self
            </label>
            <label className="block text-gray-700">
              <input
                type="radio"
                name="bookingType"
                className="mr-2"
                value="Book for Others"
                checked={formData.bookingType === 'Book for Others'}
                onChange={(e) => handleRadioChange('bookingType', e.target.value)}
              />
              Book for Others
            </label>
          </div>

          {/* Selection Options */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Choose Option</h4>
            <label className="block text-gray-700 mb-2">
              <input
                type="radio"
                name="optionType"
                className="mr-2"
                value="Mobile Number"
                checked={formData.optionType === 'Mobile Number'}
                onChange={(e) => handleRadioChange('optionType', e.target.value)}
              />
              Mobile Number
            </label>
            <label className="block text-gray-700 mb-2">
              <input
                type="radio"
                name="optionType"
                className="mr-2"
                value="Consumer Number"
                checked={formData.optionType === 'Consumer Number'}
                onChange={(e) => handleRadioChange('optionType', e.target.value)}
              />
              Consumer Number
            </label>
            <label className="block text-gray-700">
              <input
                type="radio"
                name="optionType"
                className="mr-2"
                value="LPG ID"
                checked={formData.optionType === 'LPG ID'}
                onChange={(e) => handleRadioChange('optionType', e.target.value)}
              />
              LPG ID
            </label>
          </div>

          {/* Dynamic Input Field */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              {formData.optionType}
            </h4>
            <input
              type={formData.optionType === 'Mobile Number' ? 'tel' : 'text'}
              placeholder={getInputPlaceholder()}
              value={formData.inputValue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <h2>Enter the Number of refills you want</h2>
          <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded shadow-md w-48">
      <button
        onClick={handleDecrease}
        className="w-8 h-8 bg-red-500 text-white text-lg flex items-center justify-center rounded hover:bg-red-600 active:scale-95 transition"
      >
        -
      </button>
      <input
        type="text"
        readOnly
        value={value}
        className="w-16 text-center bg-white border border-gray-300 rounded text-lg focus:outline-none"
      />
      <button
        onClick={handleIncrease}
        className="w-8 h-8 bg-green-500 text-white text-lg flex items-center justify-center rounded hover:bg-green-600 active:scale-95 transition"
      >
        +
      </button>
    </div>





          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition duration-200"
          >
            Proceed
          </button>
        </>
      ) : (
        // Payment Options
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Payment Options
          </h2>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800">Opted Distributor:</h4>
            <p className="text-gray-700">CHIRAYU GAS SERVICE</p>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800">Amount (₹):</h4>
            <p className="text-gray-700">{totalAmount}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Please Choose Payment Option
            </h4>
            <label className="block text-gray-700 mb-2">
              <input type="radio" name="paymentOption" className="mr-2" disabled={Disable}  />
              Book and Pay Now
            </label>
            <label className="block text-gray-700 mb-2">
              <input type="checkbox" className="mr-2" />
              I agree to <span className="text-blue-500 underline">terms and conditions</span>.
            </label>
            <label className="block text-gray-700">
              <input type="radio" name="paymentOption"  className="mr-2" onClick={()=>setPayLater(true)} />
              Book Now Pay on Delivery
            </label>
          </div>

          
          <div className="flex justify-between"  style={{display:step===3?"none":"flex"}}>
            <button
              onClick={handleBack}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 transition duration-200"
            >
              Confirm
            </button>
          </div>
          {
            step===3 && (
              <div className="space-y-4 flex">
              <h2 className="text-xl font-semibold">Payment Options</h2>
              <button
                onClick={handleBack}
                className="text-blue-500 underline"
              >
                Back
              </button>
              <button
                onClick={handleProceedToPayment}
                className="bg-green-500 text-white py-2 ml-16 px-4 rounded-md"
              >
                Proceed to Payment
              </button>
            </div>
            )
          }
        
        </>
      )}
    </div>


<Toaster />
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    
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

export default Booking