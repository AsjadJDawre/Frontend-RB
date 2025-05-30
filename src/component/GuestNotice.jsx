import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "./Header";

function GuestNotice() {
  const [notices, setNotices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const dummyData = [
    {
      message: "📁 View My Portfolio – Showcasing Full Stack Projects and Skills",
      link: "https://asjad-dev.vercel.app/",
      createdAt: "2025-02-05T10:19:42.808+00:00",
    },
    {
      message: "🤝 Let's Connect Professionally on LinkedIn",
      link: "https://www.linkedin.com/in/asjad-johar",
      createdAt: "2025-02-15T14:25:00.000+00:00",
    },
    {
      message: "🔁 Refill Booking Now Available for September - Book Early to Avoid Delays!",
      link: "https://asjad-dev.vercel.app",
      createdAt: "2025-08-01T09:00:00.000+00:00",
    },
    {
      message: "📦 Delivery Update: Cylinders booked before 25th July will be delivered by 31st July.",
      link: null,
      createdAt: "2025-07-28T15:45:00.000+00:00",
    },
    {
      message: "⚠️ Safety Reminder: Check your cylinder for leakage before connecting.",
      link: "https://example.com/safety-guidelines",
      createdAt: "2025-07-20T10:00:00.000+00:00",
    },
    {
      message: "🧾 Subsidy Alert: Updated LPG subsidy rates applicable from 1st August 2025.",
      link: "https://example.com/subsidy-update",
      createdAt: "2025-07-31T18:30:00.000+00:00",
    },
    {
      message: "📱 New Feature: Track your cylinder delivery status in real-time!",
      link: "https://asjad-dev.vercel.app",
      createdAt: "2025-07-25T12:00:00.000+00:00",
    },
    {
      message: "🔒 Booking Security: Use your registered mobile number for secure bookings.",
      link: null,
      createdAt: "2025-07-22T08:30:00.000+00:00",
    },
    {
      message: "🏷️ Price Update: LPG cylinder price revised from 1st August.",
      link: "https://example.com/price-update",
      createdAt: "2025-07-30T14:00:00.000+00:00",
    },
    {
      message: "⛔ Service Downtime: Booking system maintenance from 2 AM to 4 AM on 3rd August.",
      link: null,
      createdAt: "2025-08-02T10:15:00.000+00:00",
    },
  ];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/messages`, {
          withCredentials: true,
        });
        setNotices(response.data.length > 0 ? response.data : dummyData);
      } catch (error) {
        console.warn("API error, falling back to dummy data:", error.message);
        setNotices(dummyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    let animationFrameId;

    const scrollStep = () => {
      if (!container || isPaused) {
        animationFrameId = requestAnimationFrame(scrollStep);
        return;
      }

      container.scrollTop += 1.5;

      // Reset to top when end is reached
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        container.scrollTop = 0;
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl mt-8 overflow-hidden border border-gray-100">
        <h2 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mb-6 animate-pulse">
          📢 Notices & Announcements
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-blue-300/50 rounded-xl shadow-sm h-24 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (<>
  
    <Header/>
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl mt-8 overflow-hidden border border-gray-100">
      <h2 className="text-4xl font-bold text-center text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mb-6">
        📢 Notices & Announcements
      </h2>

      <div
        className="relative h-96 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-blue-50/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-indigo-50/80 to-transparent z-10 pointer-events-none"></div>

        <div
          ref={containerRef}
          className="space-y-4 overflow-y-auto scroll-smooth pr-2 h-full"
        >
          {notices.map((notice, index) => (
            <div
              key={index}
              className="p-6 bg-white/90 backdrop-blur-sm border-l-4 border-blue-500 shadow-sm rounded-xl transition-transform duration-300 hover:scale-[1.02] hover:border-blue-600 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-1">
                  {index % 4 === 0 ? "📢" : index % 4 === 1 ? "🔔" : index % 4 === 2 ? "📅" : "🎯"}
                </div>

                <div className="flex-grow">
                  <p className="text-gray-800 text-lg font-medium group-hover:text-gray-900 mb-2">
                    {notice.message}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {notice.link && (
                      <a
                        href={notice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-white bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm text-sm"
                      >
                        <span className="mr-1.5">🔗</span>
                        <span>View</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}
                    <p className="text-gray-500 text-xs bg-white/80 px-2 py-1 rounded-full border border-gray-200">
                      📅{" "}
                      {new Date(notice.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default GuestNotice;
