import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AdminMessage() {
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await axios.post("/api/verify", {}, { withCredentials: true });

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
  }, []);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL 
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/messages`,{},{ withCredentials: true });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchMessages();
  }, [isAuthenticated]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/messages`, { message, link },{ withCredentials: true });
      setMessages([...messages, response.data]); // Update UI
      if(response.status===200){
        toast.success("Message sent successfully!");
      }
      setMessage("");
      setLink("");
    } catch (error) {
      toast.error("Error sending message, please try again!");
      console.error("Error saving message:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
    const res =  await axios.delete(`${apiUrl}/api/messages/${id}`,{},{ withCredentials: true });
      setMessages(messages.filter((msg) => msg._id !== id)); // Update UI after deletion
      if(res.status===200){
        toast.success("Message deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting message, please try again!");
      console.error("Error deleting message:", error);
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Messages</h2>

      {/* Message Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Enter an important message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a related link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Save Message
        </button>
      </form>

      {/* Display Messages */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Saved Messages</h3>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="p-4 mb-3 border rounded-lg shadow-md relative bg-gray-50">
              <p className="text-gray-900">{msg.message}</p>
              {msg.link && (
                <a
                  href={msg.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {msg.link}
                </a>
              )}
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(msg._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
              >
                Delete ❌
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}
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

export default AdminMessage;
