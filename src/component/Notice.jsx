import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notice() {
  const [notices, setNotices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL 
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await axios.post(`${apiUrl}/api/verify`, {}, { withCredentials: true });

        if (user.status === 200) {
          setIsAuthenticated(true);
        } else {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500); // Ensure spinner is visible for at least 500ms
      }
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotices();
  }, [isAuthenticated]); // Add isAuthenticated in the dependency array

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/messages`,{},{withCredentials: true});
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {isAuthenticated ? (
        <div className="max-w-4xl mx-auto p-6 bg-blue-200 rounded-lg shadow-lg mt-6 overflow-hidden">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-4">
            📢 Notices & Announcements
          </h2>
          <div
            className="relative h-96 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={containerRef}
              className={`space-y-4 ${isPaused ? "" : "animate-scroll"} transition-all duration-300`}
            >
              {notices.length > 0 ? (
                notices.map((notice, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white border-l-4 border-blue-500 shadow-md rounded-lg relative transition transform hover:scale-105 hover:shadow-lg"
                  >
                    <p className="text-gray-800 text-lg font-semibold">{notice.message}</p>
                    {notice.link && (
                      <a
                        href={notice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-white bg-blue-600 px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        🔗 View More
                      </a>
                    )}
                    <p className="absolute bottom-2 right-4 text-gray-500 text-sm font-medium">
                      📅 {new Date(notice.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No notices available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>You are not authorized to access this page.</p>
        </div>
      )}
    </div>
  );
}

export default Notice;
