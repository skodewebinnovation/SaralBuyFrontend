import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useSearchParams, Navigate } from "react-router-dom";
//Pages
import Home from "./Pages/Home";
import Profile from "./Pages/profile/Profile";
import "./App.css";
import HomeNavbar from "./Components/Navbar/HomeNavbar";
import Footer from "./Components/Footer/Footer";
import Category from "./Components/Category/Category";
import Requirement from "./Pages/Requirement";
import ProductLisiting from "./Pages/ProductLisiting";
import { useCategoriesStore } from "./zustand/getCategories";
import { getUserProfile } from "./zustand/userProfile";
// import "@fontsource/poppins"; // Imports the default 400 weight
import "@fontsource/poppins/400.css"; // Imports the regular 400 weight
import "@fontsource/poppins/600.css"; // Imports the bold 700 weight
import ProductOverView from "./Pages/ProductOverView";
import ContactVerification from "./Pages/ContactVerification";
import  BidRequirements from "./Pages/profile/Requirements";
import Chatbot from "./Pages/Chatbot";
import BidListing from "./Pages/profile/BidListing";
import { AccountSettings } from "./Components/Profile/account-setting";
import Notification from "./Components/Profile/notification";
import Cart from "./Pages/profile/cart";
import Deal from "./Pages/profile/Deal";
function App() {
 const categories = useCategoriesStore()
 const userProfile = getUserProfile();
function TitleProtectWrapper() {
  const [searchParams] = useSearchParams();
  // const title = searchParams.get("prt");
  // return title ? <ProductLisiting /> : <Navigate to="/" />;
  return <ProductLisiting/>
}

const ProtectedCategoryRoute =()=>{
  const {user} = userProfile;
    return (!(user as any)?.firstName && !(user as any)?.lastName && !(user as any)?.email)?
    <Navigate to="/profile"/>
    : <Category/>
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
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/account" element={<Profile />}  >
          <Route path="" element={<AccountSettings/>} index/>
          <Route path="bid" element={<BidListing/>}/>
          <Route path="cart" element={<Cart/>}/>
          <Route path="deal" element={<Deal/>}/>
          <Route path="requirements" element={<BidRequirements/>}/>
          <Route path="notification" element={<Notification/>}/>
        </Route>
        <Route path="/product-listing" element={<TitleProtectWrapper/>}/>
       <Route path="/product-overview" element={<ProductOverView />} />
        <Route path="/contact-verification" element={<ContactVerification/>}/>
        <Route path="/chat" element={<Chatbot/>}/>
      <Route path="*" element={<h1>No Page found</h1>}/>
      </Routes>
            <Footer/> 
    </Router>
  );
}

export default App;
