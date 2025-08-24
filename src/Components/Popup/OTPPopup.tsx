import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//Logo and Icons
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import crossIcon from "../../image/Icons/crossIcon.png";

//Style
import "../../Styling/Popup/LoginPopup.css";

const OTPPopup = ({ onClose }:{onClose?:()=>void}) => {
  //UseState
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  //UseRefs
  const inputsRef = useRef([]);

  //UseNavigate
  const navigate = useNavigate();

  //UseLocation
  const location = useLocation();

  //constants
  const mobileNumber = location.state?.mobileNumber;

  const maskMobileNumber = (number:any) => {
    if (!number || number.length < 5) {
      setError("Enter a valid 10 digit mobile number");
    }
    const firstThree = number.slice(0, 3);
    const lastTwo = number.slice(-2);
    const stars = "*".repeat(number.length - 5);

    return `${firstThree}${stars}${lastTwo}`;
  };

  const handleOtpChange = (index:number, event:any) => {
    const value = event.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      if (value && index < 5) {
        (inputsRef.current[index + 1] as any).focus();
      }
    }
  };

  const handleKeyDown = (index:number, event:any) => {
    if (event.key === "Backspace" && otp[index] === "" && index > 0) {
      (inputsRef.current[index - 1] as any).focus();
    }
  };

  const handleContinue = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter a valid 6 digit OTP number");
    }
  };

  return (
    <div className="home-page-layout-login">
      <div className="login-popup-overlay">
        <button
          className="close-button"
          aria-label="Close popup"
          onClick={() => {
            if (onClose) onClose();
            else navigate(-2);
          }}
        >
          <img src={crossIcon} alt="Close Icon" />
        </button>

        <div className="logo-container">
          <img src={saralBuyLogo} alt="Logo" className="SaralBuyLogoLayout" />
        </div>

        <div className="login-text">OTP Verification</div>
        <div className="login-text-content">
          Enter the OTP code sent on your number{" "}
          <strong>{maskMobileNumber(mobileNumber)}</strong>
        </div>
        <div className="otp-input-container">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              className={`otp-input-box ${error ? "invalid-input" : ""}`}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              ref={(el) => (inputsRef.current[idx] = el)}
            />
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}
        <button
          className="send-otp-button send-otp-text"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OTPPopup;
