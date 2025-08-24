import React, { useState } from "react";

//Logo and Icons
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import crossIcon from "../../image/Icons/crossIcon.png";

//Style
import "../../Styling/Popup/LoginPopup.css";
import "../../Styling/Home/homePage.css";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ onClose }:{onClose?:()=>void}) => {
  //UseStates
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");

  //UseNavigate
  const navigate = useNavigate();

  const handleNumberChange = (event:any) => {
    const value = event.target.value;

    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
      setError("");
    }
  };

  const handleSendOTP = () => {
    if (mobileNumber.length !== 10) {
      setError("Enter a valid 10 digit mobile number");
      return;
    }
    if (!error) {
      navigate("/login/otp", { state: { mobileNumber } });
    }
  };

  return (
    <div className="home-page-layout-login">
      <div className="login-popup-overlay">
        <button
          className="close-button"
          onClick={() => {
            if (onClose) onClose();
            else navigate(-1);
          }}
          aria-label="Close popup"
        >
          <img src={crossIcon} alt="Close Icon" />
        </button>

        <div className="logo-container">
          <img src={saralBuyLogo} alt="Logo" className="SaralBuyLogoLayout" />
        </div>

        <div className="login-text">Login Here</div>
        <div className="login-text-content">
          Enter Your Phone Number to Sign In/ Sign Up Your Account
        </div>
        <input
          className="login-number-input"
          type="text"
          placeholder="Enter your Mobile Number"
          value={mobileNumber}
          onChange={handleNumberChange}
        />
        {error && <div className="error-message">{error}</div>}
        <button
          className="send-otp-button send-otp-text"
          onClick={handleSendOTP}
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
