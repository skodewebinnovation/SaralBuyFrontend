import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



//Pages
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";

//Style
import "./App.css";
import RequirementForm from "./Pages/RequirementForm";
import HomeNavbar from "./Components/Navbar/HomeNavbar";
import Footer from "./Components/Footer/Footer";
import Category from "./Components/Category/Category";
import Requirement from "./Pages/Requirement";
import ProductLisiting from "./Pages/ProductLisiting";
import { useCategoriesStore } from "./zustand/getCategories";

function App() {
 const categories = useCategoriesStore()
useEffect(() => {
  categories.execute();
}, [])
console.log(categories)

  return (
    <Router>
      <HomeNavbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/requirement" element={<Requirement/>} />
        <Route path="/:category/:select-item" element={<Category />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product-listing" element={<ProductLisiting/>}/>
        <Route
          path="/requirementform/:mainCategory/:subCategory"
          element={<RequirementForm />}
        />
      </Routes>
            {/* <Footer/> */}
    </Router>
  );
}

export default App;
