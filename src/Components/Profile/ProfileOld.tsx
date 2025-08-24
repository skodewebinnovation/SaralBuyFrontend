import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProfileSidebarOld = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Get current route

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Helper to check if current route matches
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="photo-container">
        <label htmlFor="profile-upload">
          <img
            src="https://ui-avatars.com/api/?name=Ajay+Kapoor&background=0D8ABC&color=fff&size=100"
            alt="Profile"
            className="profile-pic"
          />
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            style={{ display: "none" }}
          />
        </label>
        <p className="update-text">Update Photo</p>
      </div>

      <ul className="sidebar-menu">
        <li
          className={isActive("/profile") ? "active" : ""}
          onClick={() => handleNavigation("/profile")}
        >
          Profile
        </li>
        <li
          className={isActive("/account/cart") ? "active" : ""}
          onClick={() => handleNavigation("/account/cart")}
        >
          Cart
        </li>
        <li
          className={isActive("/account/bids") ? "active" : ""}
          onClick={() => handleNavigation("/account/bids")}
        >
          Your Bids
        </li>
        <li
          className={isActive("/account/requirements") ? "active" : ""}
          onClick={() => handleNavigation("/account/requirements")}
        >
          Requirements
        </li>
        <li
          className={isActive("/account/deals") ? "active" : ""}
          onClick={() => handleNavigation("/account/deals")}
        >
          Your Deal
        </li>
        <li
          className={isActive("/account/notifications") ? "active" : ""}
          onClick={() => handleNavigation("/account/notifications")}
        >
          Notifications
        </li>
      </ul>
    </div>
  );
};


export default ProfileSidebarOld;
