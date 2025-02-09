import React, { useState } from 'react';
// import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner"; // Import sonner

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [backdropBlur, setBackdropBlur] = useState('1.5px');
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || '/api';
console.log(apiUrl)
  const navigate = useNavigate(); // Initialize the navigate function

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const increaseBackdropBlur = () => {
    setBackdropBlur('5.2px');
  };

  const resetBackdropBlur = () => {
    setBackdropBlur('1.5px');
  };

  const [loading, setLoading] = useState(false);

    
  const checkAdmin = async (e) => {
    e.preventDefault(); // Prevent form submission

    const email = e.target.email.value;
    const password = e.target.password.value;

    setLoading(true);

    try {
      const resp = await axios.post(
        `${apiUrl}/api/login`, 
        {
          email,
          password,
        }, 
        {
          headers: {
            'Content-Type': 'application/json', // Change if the backend expects JSON payload
          },
          withCredentials: true, // Include credentials (cookies) in the request
        }
      );
      console.log(resp.data);
   
    

    // handling the response from the backend
    const res = resp.data;
    console.log(res)
    if (res.status === 200 && res.data.user.role==='user') {
      toast.success("User logged in successfully!",); // Success toast


      // const userData = res.data.user;
      // sessionStorage.setItem("user", JSON.stringify(userData));

      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate("/user-dashboard",{ replace: true });
      }, 2000); // Delay navigation to see the success message
    }

    else if (res.status ===200 && res.data.user.role==='admin') {
      toast.success("Welcome Admin, logged in successfully!",); // Success toast


    
      setTimeout(() => {
        navigate("/Admin",{ replace: true });
      }, 2000);
      
    }
   
  } catch (error) {
    if (error.response) {
      const { status, message } = error.response.data;

      if (status === 404) {
        toast.error("User does not exist!", {
          position: "top-right",
          draggable: false,
        });
      } else if (status === 401) {
        toast.error("Invalid credentials! Please check your email and password.", {
          position: "top-right",
          draggable: false,
        });
      } else {
        toast.error(message || "Login failed! Please try again.", {
          position: "top-right",
          draggable: false,
        });
      }
    } else {
      toast.error("Something went wrong!", {
        position: "top-right",
        draggable: false,
      });
    }
  } finally {
    setLoading(false);
  }

};
    

  return (
    <>
    <section className='login_section'> 
      <div
        className="form-box login_form_container"
        id="formBox"
        style={{ backdropFilter: backdropBlur }}
      >
        <div className="form-value login_form">
          <form onSubmit={checkAdmin}>
          {/* <form action="/api/login" method="post"> */}
            <h2 className='Login'>Login</h2>
            <div className="inputbox input_group">
              <i  className="mail-outline"></i>
              <input
                type="text"
                name="email"
                id="text"
                autoComplete='off'
                className="input_text"
                placeholder="Enter Username"
                required
                onFocus={increaseBackdropBlur}
                onBlur={resetBackdropBlur}
              />
              <label>Email</label>
            </div>
            <div className="inputbox input_group">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                className="input_text"
                id="passwordInput"
                placeholder="Enter Password"
                required
                  autoComplete='off'
                onFocus={increaseBackdropBlur}
                onBlur={resetBackdropBlur}
              />
              <i 
                id="passwordToggle"
                className={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                onClick={handlePasswordToggle}
              ></i>
              <label htmlFor="passwordInput">Password</label>
            </div>
            <div className="forget">
              <label>
              <Link to={'/password-reset'}>Forget Password</Link>
              </label>
            </div>
            <div className="button_group" id="login_button" disabled={loading}>
              <button type="submit"    className="custom_submit_button"
              >
          {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <div className="register">
              <p className='Login-paragraph'>
                Don't have an account ? <Link to="/register">Register</Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </section>

<div>
<Toaster richColors 
position="top-right" />


</div>
</>
  );
};

export default LoginForm;
