//default
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//icons
import crossIcon from "../../image/Icons/crossIcon.png";

//styles
import "../../Styling/Popup/PlaceRequirementPopup.css";
import "../../Styling/Home/homePage.css";
import "../../Styling/Popup/LoginPopup.css";

const PlaceRequirementPopup = ({ onClose = () => {} }) => {
  //useState
  const [bidDays, setBidDays] = useState("");
  const [error, setError] = useState("");

  //useNavigate
  const navigate = useNavigate();

  const handleBidDaysChange = (event:any) => {
    const value = event.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setBidDays(value);
      setError("");
    }
  };

  const handlePlaceRequirement = () => {
    if (bidDays.length === 0) {
      setError("Please enter number of days");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="popup-content">
      <button
        className="close-button"
        onClick={onClose}
        aria-label="Close popup"
      >
        <img src={crossIcon} alt="Close Icon" />
      </button>
      <h2 className="popup-header">Place Requirement</h2>
      <div className="popup-subtext">
        How Long Should Your Bid Remain Active?
      </div>
      <input
        type="text"
        className="popup-input"
        value={bidDays}
        onChange={handleBidDaysChange}
        placeholder="Enter your input here"
      />
      {error && <div className="popup-error">{error}</div>}
      <button className="popup-button" onClick={handlePlaceRequirement}>
        Place Requirement
      </button>
    </div>
  );
};

export default PlaceRequirementPopup;
