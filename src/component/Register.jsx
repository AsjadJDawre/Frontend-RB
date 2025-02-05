import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const Register = () => {
const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        mobile: "",
        ConsumerId: "",
        Distributor: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zip: "",
            country: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setFormData({ ...formData, address: { ...formData.address, [field]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form Data:", formData);
  
      try {
          const response = await axios.post("api/register", formData);
          console.log("Success:", response.data);
  
          if (response.status === 201) {
              toast.success("🎉 User registered successfully!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
              });

              setTimeout(() => {
                  navigate("/login");
              }, 2000);
          }
  
      } catch (error) {
          console.error("Error:", error);
  
          if (error.response) {
              // Handle specific server responses
              if (error.response.status === 400 && error.response.data.message === "User already exists") {
                toast.error("🚨 Email ,ConsumerId or  username already in use!", {
                  position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                  });
              } else {
                  toast.error(`⚠️ ${error.response.data.message || "Registration failed!"}`, {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                  });
              }
          } else if (error.request) {
              // Handle no response from server
              toast.error("🔌 Server not responding. Please try again later!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
              });
          } else {
              // Handle other unexpected errors
              toast.error("❌ An unexpected error occurred!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
              });
          }
      }
  };
  
    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} className={inputStyle} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className={inputStyle} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className={inputStyle} required />
                    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className={inputStyle} required />
                    <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} className={inputStyle} />
                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className={inputStyle} required />
                    <select name="gender" onChange={handleChange} className={inputStyle} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="tel" name="mobile" placeholder="Mobile" onChange={handleChange} className={inputStyle} required />
                    <input type="text" name="ConsumerId" placeholder="Consumer ID" onChange={handleChange} className={inputStyle} required />
                    <select name="Distributor" onChange={handleChange} className={inputStyle} required>
                        <option value="">Select Distributor</option>
                        <option value="Distributor1">Distributor 1</option>
                        <option value="Distributor2">Distributor 2</option>
                    </select>
                </div>
                <h3 className="text-lg font-semibold">Address Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="addressLine1" placeholder="Address Line 1" onChange={handleChange} className={inputStyle} required />
                    <input type="text" name="addressLine2" placeholder="Address Line 2" onChange={handleChange} className={inputStyle} />
                    <input type="text" name="city" placeholder="City" onChange={handleChange} className={inputStyle} required />
                    <input type="text" name="state" placeholder="State" onChange={handleChange} className={inputStyle} required />
                    <input type="text" name="zip" placeholder="Zip Code" onChange={handleChange} className={inputStyle} required />
                    <input type="text" name="country" placeholder="Country" onChange={handleChange} className={inputStyle} required />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Register</button>
            </form>
            <Toaster richColors toposition="top-right" />
        </div>
    );
};

export default Register;

const inputStyle = "border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
