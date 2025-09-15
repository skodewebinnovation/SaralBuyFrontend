
import { useNavigate } from "react-router-dom";

//Logo and Icons
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import searchIcon from "../../image/Icons/searchIcon.png";
import chatIcon from "../../image/Icons/chatIcon.png";
import notificationIcon from "../../image/Icons/notificationIcon.png";
import cartIcon from "../../image/Icons/cartIcon.png";
import profileIcon from "../../image/Icons/profileIcon.png";
import locationIcon from "../../image/Icons/locationIcon.png";

//Style
import "../../Styling/Home/homeNavbar.css";
import "../../Styling/Home/homePage.css";
import "../../Styling/Logo/SaralBuyLogo.css";

const HomeNavbarOld = ({ profileScreen = false, requirementScreen = false }:{profileScreen?:boolean,requirementScreen?:boolean}) => {
  //UseStates

  //UseNavigate
  const navigate = useNavigate();

  const handleRaiseAReuirement = () => {
    navigate("/requirement/selectCategory");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
  <div className="navbar-row">
    <div className="logo-container">
      <img src={saralBuyLogo} alt="logo" className="navbar-logo" />
    </div>
    <div className="location-container">
      <img src={locationIcon} alt="location" className="location-icon" />
      <input className="location-input" placeholder="Location" />
    </div>
    <div className="navbar-search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="navbar-search"
          placeholder="Looking for..."
        />
        <img src={searchIcon} alt="search" className="search-icon" />
      </div>
    </div>
    <div className="icon-group">
    <button className="chat-button">
      <img src={chatIcon} alt="chat" className="chat-icon" />
    </button>
    <button className="notification-button">
      <img
        src={notificationIcon}
        alt="notification"
        className="notification-icon"
      />
    </button>
    <button className="cart-button">
      <img src={cartIcon} alt="cart" className="cart-icon" />
    </button>
    </div>
    <button
      disabled={requirementScreen}
      className="requirement-button"
      style={{
        opacity: requirementScreen ? 0.4 : 1,
        cursor: requirementScreen ? "not-allowed" : "pointer",
      }}
      onClick={handleRaiseAReuirement}
    >
      Raise a requirement
    </button>
    <button
      disabled={profileScreen}
      className="profile-button"
      style={{
        opacity: profileScreen ? 0.4 : 1,
        cursor: profileScreen ? "not-allowed" : "pointer",
      }}
      onClick={handleProfileClick}
    >
      <img className="profile-icon" src={profileIcon} alt="profile" />
    </button>
  </div>
</nav>

  );
};

export default HomeNavbarOld;
