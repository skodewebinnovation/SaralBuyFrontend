// ===== Imports =====
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// ===== Images & Icons =====
import backIcon from "../image/Icons/backIcon.png";
import electrnicsImage from "../image/FormImages/electronicsFormImage.png";
import automobileImage from "../image/FormImages/automobileFormImage.png";
import furnitureImage from "../image/FormImages/furnitureFormImage.png";
import fashionImage from "../image/FormImages/fashionFormImage.png";
import sportImage from "../image/FormImages/sportsFormImage.png";
import homeAppliancesImage from "../image/FormImages/homeapplianceFormImage.png";
import beautyImage from "../image/FormImages/beautyFormImage.png";
import constructionImage from "../image/FormImages/constructionFormImage.png";
import serviceImage from "../image/FormImages/servicesFormImage.png";
import uploadImageIcon from "../image/Icons/uploadImageIcon.png";
import browseDocumentIcon from "../image/Icons/browseDocumentIcon.png";
import calenderIcon from "../image/Icons/calenderIcon.png";

// ===== Components =====
import HomeNavbar from "../Components/Navbar/HomeNavbar";
import Footer from "../Components/Footer/Footer";
import PlaceRequirementPopup from "../Components/Popup/PlaceRequirementPopup";

// ===== Styles =====
import "../Styling/RequiremenrForm/RequirementForm.css";
import "../Styling/Popup/PlaceRequirementPopup.css";

// ===== Helper Function: Category Image Mapping =====
const categoryImageMap = {
  Electronics: electrnicsImage,
  Automobiles: automobileImage,
  Furnitures: furnitureImage,
  Fashions: fashionImage,
  "Sports &": sportImage,
  Home: homeAppliancesImage,
  "Beauty &": beautyImage,
  "Industrial &": constructionImage,
  Services: serviceImage,
};

const RequirementForm = () => {
  // ===== Hooks =====
  const { mainCategory, subCategory } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = location?.state || {};

  // ===== State =====
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isGstRequired, setIsGstRequired] = useState(false);
  const [isPlacementRequirementPopup, setIsPlacementRequirementPopup] =
    useState(false);

  // ===== Refs =====
  const dateInputRef = useRef(null);

  // ===== Data Fetching =====
  useEffect(() => {
    if (!categoryId || !mainCategory || !subCategory) return;

    // Fetch brands
    axios
      .get(`/saralbuy/requirement/brand/${mainCategory}/${subCategory}`, {
        params: { categoryId },
      })
      .then((res) => {
        setBrands(res?.data.map((item) => item?.brands) || []);
      })
      .catch((err) => console.error("Error fetching brands:", err));

    // Fetch measurement units
    axios
      .get("/saralbuy/requirement/measurementunits")
      .then((res) => setUnits(res?.data || []))
      .catch((err) => console.error("Error fetching measurement units:", err));

    // Fetch payment methods
    axios
      .get("/saralbuy/requirement/paymentmethods")
      .then((res) => setPaymentMethods(res?.data || []))
      .catch((err) => console.error("Error fetching payment methods:", err));
  }, [categoryId, mainCategory, subCategory]);

  // ===== Handlers =====
  const goBack = () => navigate(-1);

  const handleFormImage = () => categoryImageMap[mainCategory] || "";

  const handleSubmit = () => setIsPlacementRequirementPopup(true);

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.();
      dateInputRef.current.click();
    }
  };

  // ===== JSX =====
  return (
    <div>
      {/* Popup */}
      {isPlacementRequirementPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <PlaceRequirementPopup
              onClose={() => setIsPlacementRequirementPopup(false)}
            />
          </div>
        </div>
      )}

      <HomeNavbar />

      {/* Header */}
      <div className="requirement-header">
        <div className="requirement-left">
          <img
            src={backIcon}
            alt="Back"
            className="back-arrow"
            onClick={goBack}
          />
          <span className="selected-text">Selected Category : </span>
          <h2 className="requirement-title">{mainCategory}</h2>
        </div>
        <button className="requirement-btn">+Add Product</button>
      </div>

      {/* Content */}
      <div className="requirement-content">
        {/* Left Section */}
        <div className="requirement-left-content">
          <div className="requirement-description">
            <div className="line-bold">
              Please help us tailor the experience by filling out the form
              below.
            </div>
            <div className="line-normal">
              If this isn’t the category you meant to choose, you can go back
              and select another one.
            </div>
          </div>
          <img
            src={handleFormImage()}
            alt="Category"
            className="requirement-image"
          />
        </div>

        {/* Right Section */}
        <div className="requirement-right-content">
          {/* Product Details */}
          <div className="requirement-box">
            <h3 className="box-title">Product Details</h3>
          </div>

          {/* Other Details */}
          <div className="second-box">
            <div className="box-title">Other Details</div>
            <div className="horizontal-labels">
              {/* Upload Image */}
              <div>
                <div className="field-label">Product Image</div>
                <button className="upload-container">
                  <img
                    src={uploadImageIcon}
                    alt="upload"
                    className="upload-image"
                  />
                  <div className="upload-image-text">Upload image</div>
                </button>
              </div>
              {/* Supporting Docs */}
              <div>
                <div className="field-label">Supporting Documents</div>
                <button className="upload-container">
                  <img
                    src={browseDocumentIcon}
                    alt="browse"
                    className="browse-document-icon"
                  />
                  <div className="browse-document-header">
                    Browse From Device
                  </div>
                  <div className="browse-document-subheader">
                    (.doc and .pdf)
                  </div>
                </button>
              </div>
            </div>
            {/* Description */}
            <div className="description-group">
              <textarea
                className="description-textarea"
                placeholder="Description*"
              ></textarea>
            </div>
          </div>

          {/* Payment & Delivery */}
          <div className="third-box">
            <div className="box-title">Payment & Delivery Details</div>
            <div className="horizontal-labels">
              {/* Delivery Date */}
              <button className="payment-input" onClick={handleCalendarClick}>
                <div>
                  <div className="paymentButtonPlaceholder">
                    Required Delivery Date
                  </div>
                  <img
                    className="calenderIcon"
                    src={calenderIcon}
                    alt="calendar"
                  />
                </div>
              </button>
              <input
                type="date"
                ref={dateInputRef}
                style={{ display: "none" }}
                onChange={(e) => console.log("Selected date:", e.target.value)}
              />
              <input className="payment-input" />
            </div>

            {/* GST Required */}
            <div className="horizontal-labels">
              <select
                className="payment-input"
                onChange={(e) => setIsGstRequired(e.target.value === "yes")}
              >
                <option>GST Input Required</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {isGstRequired && <input className="payment-input" />}
            </div>

            {/* Extra GST Fields */}
            {isGstRequired && (
              <div className="horizontal-labels">
                <input className="payment-input" />
                <input className="payment-input" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="button-right-content">
        <button className="draft-button">Save as Draft</button>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default RequirementForm;
