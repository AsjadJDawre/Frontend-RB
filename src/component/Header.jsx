import React, { useState } from "react";
import "../styles/Header.css";
import { faFacebook, faInstagram, faLinkedin, faYoutube, faTwitter } from "@fortawesome/free-brands-svg-icons";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
const Header = () => {

    const [fontSize, setFontSize] = useState(16); // Default font size in pixels

    const updateFontSize = (size) => {
      setFontSize(size);
      document.body.style.fontSize = `${size}px`;
    };
  



  return (
    <header className="header-container">
      {/* Left Section */}
      <div className="header-left">
        <img src="/Header-logo.png" alt="HP Logo" className="hp-logo" />
        {/* <div className="header-text">
          <h1 className="hindi-text">हिंदुस्तान पेट्रोलियम कॉर्पोरेशन लिमिटेड</h1>
          <h2>Hindustan Petroleum Corporation Limited</h2>
          <p>(A Maharatna Company)</p>
          </div> */}
          <hr className="nav-vertical-hr"/>
      </div>
      {/* Middle Section */}
      <div className="header-middle ">
        <img src="/Header-logo2.jpg" alt="50 Years Logo" className=" anniversary-logo " />
        <div className="info-section">
          <img src="Header-logo3.png" alt="1906 Logo" className="info-logo" />
          <p className="delivering-happiness">Delivering Happiness</p>
        </div>
        <hr className="nav-vertical-hr"/>

      </div>

      <div className="header-controls flex justify-center items-center text-size-controls">
      <button
        className="text-size"
        onClick={() => updateFontSize(fontSize + 2)}
      >
        A+
      </button>
      <button className="text-size" onClick={() => updateFontSize(16)}>
        A
      </button>
      <button
        className="text-size"
        onClick={() => updateFontSize(Math.max(12, fontSize - 2))}
      >
        A-
      </button>

    </div>
    <div className="header-right   flex justify-center items-center space-x-4 py-2">
  <a
    href="https://twitter.com/HPCL"
    target="_blank"
    title="Twitter"
    aria-label="Twitter"
    className=" flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-400 hover:border-blue-500"
  >
    <FontAwesomeIcon icon={faTwitter} className="text-blue-500 text-2xl hover:text-blue-700" />
  </a>
  <a
    href="https://www.facebook.com/hpcl"
    target="_blank"
    title="Facebook"
    aria-label="Facebook"
    className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-500 hover:border-blue-600"
  >
    <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-2xl hover:text-blue-800" />
  </a>
  <a
    href="https://www.instagram.com/hpcl/"
    target="_blank"
    title="Instagram"
    aria-label="Instagram"
    className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-600 hover:border-blue-700"
  >
    <FontAwesomeIcon icon={faInstagram} className="text-pink-500 text-2xl hover:text-pink-700" />
  </a>
  <a
  href="https://www.linkedin.com/in/asjad-johar"
  target="_blank"
    title="LinkedIn"
    aria-label="LinkedIn"
    className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-700 hover:border-blue-800"
  >
    <FontAwesomeIcon icon={faLinkedin} className="text-blue-700 text-2xl hover:text-blue-900" />
  </a>
  <a
    href="https://www.youtube.com/hindustanpetroleum74/"
    target="_blank"
    title="YouTube"
    aria-label="YouTube"
    className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-800 hover:border-blue-900"
  >
    <FontAwesomeIcon icon={faYoutube} className="text-red-600 text-2xl hover:text-red-800" />
  </a>
</div>









      {/* Right Section */}
      {/* <div className="header-right">
        <nav className="header-links">
          <a href="#main-content">Skip to main content</a>
          <a href="#feedback">Complaints & Feedback</a>
          <a href="#login">Login Dealer/Vendor</a>
          <a href="#contact">Contact Us</a>
        </nav>
        <div className="header-controls">
          <div className="text-size-controls">
            <span className="text-size">A+</span>
            <span className="text-size">A-</span>
          </div>
          <button className="language-toggle">हिंदी</button>
          <div className="icon-buttons">
            <i className="icon">🔍</i>
            <i className="icon">📸</i>
            <i className="icon">🎥</i>
            <i className="icon">📷</i>
          </div>
        </div>
      </div> */}
    </header>
  );
};

export default Header;
