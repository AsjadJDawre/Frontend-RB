import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, addMinutes, addHours, isAfter } from "date-fns";

function GuestBookingStatus() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deliveryStatuses, setDeliveryStatuses] = useState([]);

  // Calculate delivery timeline based on createdAt
  const calculateDeliveryTimeline = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    // Define time intervals for each stage (in minutes)
    const stageIntervals = {
      confirmed: 0,
      processing: 20,
      dispatched: 150, // 2.5 hours after creation
      outForDelivery: 250, // ~4 hours after creation
      delivered: 300 // ~5 hours after creation
    };

    // Calculate dates for each stage
    const confirmedDate = addMinutes(createdDate, stageIntervals.confirmed);
    const processingDate = addMinutes(createdDate, stageIntervals.processing);
    const dispatchedDate = addMinutes(createdDate, stageIntervals.dispatched);
    const outForDeliveryDate = addMinutes(createdDate, stageIntervals.outForDelivery);
    const deliveredDate = addMinutes(createdDate, stageIntervals.delivered);

    // Determine current status based on current time
    let currentStatus = "Order Confirmed";
    if (isAfter(now, processingDate)) currentStatus = "Processing";
    if (isAfter(now, dispatchedDate)) currentStatus = "Dispatched";
    if (isAfter(now, outForDeliveryDate)) currentStatus = "Out for Delivery";
    if (isAfter(now, deliveredDate)) currentStatus = "Delivered";

    return {
      statuses: [
        { 
          status: "Order Confirmed", 
          time: format(confirmedDate, "dd-MMM-yyyy hh:mm a"),
          completed: isAfter(now, confirmedDate)
        },
        { 
          status: "Processing", 
          time: format(processingDate, "dd-MMM-yyyy hh:mm a"),
          completed: isAfter(now, processingDate)
        },
        { 
          status: "Dispatched", 
          time: format(dispatchedDate, "dd-MMM-yyyy hh:mm a"),
          completed: isAfter(now, dispatchedDate)
        },
        { 
          status: "Out for Delivery", 
          time: format(outForDeliveryDate, "dd-MMM-yyyy hh:mm a"),
          completed: isAfter(now, outForDeliveryDate)
        },
        { 
          status: "Delivered", 
          time: isAfter(now, deliveredDate) ? format(deliveredDate, "dd-MMM-yyyy hh:mm a") : "Pending",
          completed: isAfter(now, deliveredDate)
        }
      ],
      currentStatus
    };
  };

  useEffect(() => {
    const loadBooking = async () => {
      try {
        // Get the most recent booking from localStorage
        const guestBookings = JSON.parse(localStorage.getItem("guestBookings") || []);
        if (guestBookings.length > 0) {
          const latestBooking = guestBookings[guestBookings.length - 1];
          
          // Calculate delivery timeline based on createdAt
          const { statuses, currentStatus } = calculateDeliveryTimeline(latestBooking.createdAt);
          
          // Enhance booking data with additional fields
          const enhancedBooking = {
            ...latestBooking,
            orderNumber: `ND${latestBooking.id.slice(-6)}`,
            deliveryOTP: [8, 3, 2, 5].join("   "),
            deliveryStatus: currentStatus,
            createdAtFormatted: format(new Date(latestBooking.createdAt), "dd-MMM-yyyy hh:mm a")
          };

          setBooking(enhancedBooking);
          setDeliveryStatuses(statuses);
        } else {
          toast.error("No bookings found");
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed to load booking details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-gray-600 text-lg">No booking details found</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white p-4">
          <h1 className="text-xl font-bold text-center">Booking Status</h1>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Order #{booking.orderNumber}</h2>
            <span className={`text-xs px-2 py-1 rounded ${
              booking.deliveryStatus === "Delivered" ? "bg-green-100 text-green-800" :
              booking.deliveryStatus === "Out for Delivery" ? "bg-blue-100 text-blue-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {booking.deliveryStatus}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{booking.createdAtFormatted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <p className="font-medium">
                {booking.payLater ? "Pay on Delivery" : "Payment Completed"}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Delivery OTP:</span> Share this OTP with the delivery executive
            </p>
            <div className="flex justify-center space-x-4 mb-2">
              {booking.deliveryOTP.split("   ").map((digit, index) => (
                <div key={index} className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold">
                  {digit}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center">
              Valid only during delivery time
            </p>
          </div>
        </div>

        {/* Delivery Timeline */}
     <div className="p-6">
  <h3 className="text-lg font-semibold mb-6">Delivery Progress</h3>
  <div className="relative">
    {/* Progress line */}
    <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200"></div>
    
    {/* Completed progress line */}
    <div 
      className="absolute left-0 top-4 h-1 bg-green-500 transition-all duration-500"
      style={{
        width: `${(deliveryStatuses.filter(s => s.completed).length / (deliveryStatuses.length - 1)) * 100}%`
      }}
    ></div>

    <div className="flex justify-between relative z-10">
      {deliveryStatuses.map((item, index) => (
        <div key={index} className="flex flex-col items-center" style={{ width: `${100 / (deliveryStatuses.length - 1)}%` }}>
          {/* Status dot */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            item.completed ? "bg-green-500" : "bg-gray-300"
          }`}>
            {item.completed ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-xs text-white">{index + 1}</span>
            )}
          </div>
          
          {/* Status text */}
          <div className="text-center">
            <p className={`text-sm font-medium ${
              item.completed ? "text-gray-800" : "text-gray-500"
            }`}>
              {item.status}
            </p>
            {item.time && (
              <p className="text-xs text-gray-500 mt-1">{item.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

        {/* Consumer Details */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Consumer Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{booking.consumerDetails?.name || "Guest Name"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{booking.bookingDetails?.optionType}</p>
              <p className="font-medium">{booking.bookingDetails?.inputValue || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Agency</p>
              <p className="font-medium">{booking.consumerDetails?.agencyName || "ANAND GAS SERVICE"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium whitespace-pre-line">
                {booking.consumerDetails?.deliveryAddress || "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Refills</p>
              <p className="font-medium">{booking.refills}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Amount per refill</p>
              <p className="font-medium">₹{(booking.amount / booking.refills).toFixed(2)}</p>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <p className="text-gray-800 font-semibold">Total Amount</p>
              <p className="text-red-600 font-bold">₹{booking.amount}</p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
          <div className="space-y-2">
            <button 
              className="w-full flex items-center justify-between py-2 px-3 bg-white border rounded-lg hover:bg-gray-50"
              onClick={() => toast.info("Support contact functionality would be implemented here")}
            >
              <span className="text-gray-700">Contact Support</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              className="w-full flex items-center justify-between py-2 px-3 bg-white border rounded-lg hover:bg-gray-50"
              onClick={() => toast.info("FAQ functionality would be implemented here")}
            >
              <span className="text-gray-700">View FAQ</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestBookingStatus;