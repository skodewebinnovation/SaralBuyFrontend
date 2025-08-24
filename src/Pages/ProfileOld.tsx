import React, { useState } from "react";
import ProfileSidebarOld from "@/Components/Profile/ProfileOld";
import Footer from "../Components/Footer/Footer";
import "../Styling/Profile/Profile.css";


const ProfileOld = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null); // ✅ Moved here

  const handleAadhaarUpload = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadhaarImage((reader as any).result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="profile-container">
        <ProfileSidebarOld />

        <div className="profile-details">
          <h2>Profile</h2>
          <div className="profile-section">
            <div className="profile-right-section">
              {/* Personal Details */}
              <div className="profile-grid-box">
                <h3>Personal Details</h3>
                <div className="grid">
                  <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid">
                  <div className="email-input-wrapper">
                    <label htmlFor="email">Email Address</label>
                    <div className="email-input-container">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                      />
                      <button
                        type="button"
                        className="verify-button-inside"
                        onClick={() => console.log("Verify clicked")}
                      >
                        Verify
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter     phone number"
                      pattern="^\+91\s[0-9]{10}$"
                      title="Format: +91 9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="grid address-grid">
                  <div className="textarea-wrapper">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter address"
                    />
                    <button type="button" className="add-new-address-btn">
                      + Add New Address
                    </button>
                  </div>
                </div>
              </div>

              {/* Aadhaar Section */}
              <div className="profile-grid-box">
                <div className="aadhaar-verification">
                  <h3>Aadhaar Verification</h3>

                  <div className="form-group">
                    <label htmlFor="aadhaarNumber">Aadhaar Number</label>
                    <input
                      type="text"
                      id="aadhaarNumber"
                      name="aadhaarNumber"
                      placeholder="Enter Aadhaar Number"
                      pattern="^\d{12}$"
                      title="Aadhaar number must be 12 digits"
                      required
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                    />
                  </div>

                  <div className="form-group aadhaar-image-group">
                    <label htmlFor="aadhaarUpload">Aadhaar Card Image</label>
                   <div className={`aadhaar-image-wrapper ${!aadhaarImage ? 'no-image' : ''}`}>
  {aadhaarImage && (
    <img
      src={aadhaarImage}
      alt="Aadhaar Preview"
      className="aadhaar-preview"
    />
  )}
  <label htmlFor="aadhaarUpload" className="update-button">
    {aadhaarImage ? "Update Image" : "Upload Image"}
  </label>
  <input
    type="file"
    id="aadhaarUpload"
    accept="image/*"
    onChange={handleAadhaarUpload}
    style={{ display: "none" }}
  />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="save-button-footer">
                <button>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileOld;
