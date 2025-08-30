import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useSearchParams, Navigate } from "react-router-dom";
//Pages
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import "./App.css";
import RequirementForm from "./Pages/RequirementForm";
import HomeNavbar from "./Components/Navbar/HomeNavbar";
import Footer from "./Components/Footer/Footer";
import Category from "./Components/Category/Category";
import Requirement from "./Pages/Requirement";
import ProductLisiting from "./Pages/ProductLisiting";
import { useCategoriesStore } from "./zustand/getCategories";
import { getUserProfile } from "./zustand/userProfile";

function App() {
 const categories = useCategoriesStore()
 const userProfile = getUserProfile();
 console.log(userProfile)
function TitleProtectWrapper() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  return title ? <ProductLisiting /> : <Navigate to="/" />;
}

useEffect(() => {
  categories.execute();
  userProfile.execute();
}, [])


  return (
    <Router>
      <HomeNavbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/requirement" element={<Requirement/>} />
        <Route path="/:category/:selectItem" element={<Category />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product-listing" element={<TitleProtectWrapper/>}/>
        <Route
          path="/requirementform/:mainCategory/:subCategory"
          element={<RequirementForm />}
        />
      </Routes>
            {/* {
              !pathname.includes('/product-listing') ? <Footer/> : null
            } */}
    </Router>
  );
}

export default App;
