import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//components
import LoginPopup from "./Components/Popup/LoginPopup";
import OTPPopup from "./Components/Popup/OTPPopup";

//Pages
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";

//Style
import "./App.css";
import RequirementForm from "./Pages/RequirementForm";
import HomeNavbar from "./Components/Navbar/HomeNavbar";
import Footer from "./Components/Footer/Footer";
import Category from "./Components/Category/Category";

function App() {
  return (
    <Router>
      <HomeNavbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPopup/>} />
        <Route path="/requirement" element={<LoginPopup/>} />
        <Route path="/login/otp" element={<OTPPopup />} />
        <Route path="/:category/:select-item" element={<Category />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/requirementform/:mainCategory/:subCategory"
          element={<RequirementForm />}
        />
      </Routes>
            <Footer/>
    </Router>
  );
}

export default App;
