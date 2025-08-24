// //Default
// import React, { useState, useEffect } from "react";

// //Images
// import electronicsImage from "../../image/Category/electronicsImage.png";
// import automobileImage from "../../image/Category/automobileImage.png";
// import furnitureImage from "../../image/Category/furnitureImage.png";
// import fashionImage from "../../image/Category/fashionImage.png";
// import sportsImage from "../../image/Category/sportsImage.png";
// import homeApplicancesImage from "../../image/Category/homeAppliancesImage.png";
// import beautyImage from "../../image/Category/beautyImage.png";
// import industrialImage from "../../image/Category/industrialImage.png";
// import serviceImage from "../../image/Category/serviceImage.png";
// import dropdownIcon from "../../image/Icons/dropdownIcon.png";

// //Style
// import "../../Styling/Category/Category.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// //variables
// const categoryImages = {
//   Electronics: {
//     name: ["Electronics", "& Appliances"],
//     image: electronicsImage,
//   },
//   Automobile: {
//     name: ["Automobiles"],
//     image: automobileImage,
//   },
//   Furniture: {
//     name: ["Furnitures"],
//     image: furnitureImage,
//   },
//   Fashion: {
//     name: ["Fashions"],
//     image: fashionImage,
//   },
//   Sports: {
//     name: ["Sports &", "Stationary"],
//     image: sportsImage,
//   },
//   "Home Appliances": {
//     name: ["Home", "Appliances"],
//     image: homeApplicancesImage,
//   },
//   Beauty: {
//     name: ["Beauty &", "Healthcare"],
//     image: beautyImage,
//   },
//   Industrial: {
//     name: ["Industrial &", "Construction", "Materials"],
//     image: industrialImage,
//   },
//   Service: {
//     name: ["Services"],
//     image: serviceImage,
//   },
// };

// const Category = ({ isHomeScreen = false }) => {
//   //useState
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [categoryDropdownData, setCategoryDropdownData] = useState(
//  [
//    {
//     category: "electronicsDropdownCategory",
//     items: [
//       "TVs and Screens",
//       "Computer & Laptops",
//       "Fridges",
//       "Mobile/Tablets",
//       "Mobile Accessories",
//       "Computer Accessories",
//       "Gaming Accessories",
//       "Washing Machine",
//       "AC",
//       "Camera/Lenses"
//     ]
//   },
//   {
//     category: "automobileDropdownCategory",
//     items: [
//       "Cars",
//       "Motorcycles",
//       "Truck/Buses",
//       "Scooters",
//       "Bicycles",
//       "Two wheeler Accessories",
//       "Four wheeler Accessories",
//       "Three wheelers",
//       "Others"
//     ]
//   },
//   {
//     category: "furnitureDropdownData",
//     items: [
//       "Sofa",
//       "Beds & Wardrobes",
//       "Dinings",
//       "Tables and chairs",
//       "Kids Furniture",
//       "Mattres",
//       "Others"
//     ]
//   },
//   {
//     category: "fashionDropdownData",
//     items: [
//       "Clothes",
//       "Fashion Jewellery",
//       "Fashion Accessories",
//       "Footwears",
//       "Eyewears",
//       "Beauty Products",
//       "Others"
//     ]
//   },
//   {
//     category: "sportsDropdownData",
//     items: [
//       "Books & Papers",
//       "SportsWears",
//       "Gym and Fitness",
//       "Music Instruments",
//       "Online Gaming setups",
//       "Others"
//     ]
//   },
//   {
//     category: "homeAppliancesDropdownData",
//     items: [
//       "Electric Home Appliances",
//       "Kitchen home Appliances",
//       "Daily Usage items",
//       "Grocery Materials",
//       "Event and Pooja materials",
//       "Decoration materials",
//       "Bedroom Accessories",
//       "Others"
//     ]
//   },
//   {
//     category: "beautyDropdownData",
//     items: [
//       "Medicines",
//       "Sexual wellness",
//       "Beauty Products",
//       "Others"
//     ]
//   },
//   {
//     category: "industrialDropdownData",
//     items: [
//       "Cement",
//       "Bricks",
//       "Tiles & Marbels",
//       "Iron & Steel Pipes",
//       "Paint and Plasters",
//       "Tools",
//       "Home accessories",
//       "Others"
//     ]
//   },
//   {
//     category: "serviceDropdownData",
//     items: [
//       "Education",
//       "Tour and Travels",
//       "Home Repair",
//       "Health & Beauty",
//       "Electronic Repairs",
//       "Cleaning & pest control",
//       "Automobile Services",
//       "Legal Documentation Services",
//       "Other Services"
//     ]
//   } 
//  ]
// );

//   //useNavigate
//   const navigate = useNavigate();

//   // // useEffect
//   // useEffect(() => {
//   //   axios
//   //     .get("/saralbuy/requirement/categories")
//   //     .then((response) => {
//   //       const data = response?.data;
//   //       const grouped = {};
//   //       data.forEach((item) => {
//   //         if (!grouped[item.mainCategory]) {
//   //           grouped[item.mainCategory] = [];
//   //         }
//   //         grouped[item.mainCategory].push({
//   //           subcategory: item.subCategory,
//   //           categoryId: item.categoryId,
//   //         });
//   //       });

//   //       const formatted = Object.keys(grouped).map((mainCategory) => ({
//   //         name: categoryImages[mainCategory]?.name,
//   //         image: categoryImages[mainCategory]?.image,
//   //         dropdown: grouped[mainCategory],
//   //       }));

//   //       setCategoryDropdownData(formatted);
//   //     })
//   //     .catch((error) => {
//   //       console.error("failed to fetch categories : ", error);
//   //     });

//   //   const handleOutsideClick = (e) => {
//   //     if (!e.target.closest(".category-item")) {
//   //       setHoveredIndex(null);
//   //     }
//   //   };

//   //   document.addEventListener("mousedown", handleOutsideClick);
//   //   return () => document.removeEventListener("mousedown", handleOutsideClick);
//   // }, []);

//   const saveDropdownValue = (mainCategory, subCategory, categoryId) => {
//     navigate(`/requirementform/${mainCategory}/${subCategory}`, {
//       state: {
//         categoryId: categoryId,
//       },
//     });
//   };

//   return (
//     <div
//       className={`category-wrapper ${
//         isHomeScreen ? "home-screen" : "requirement-screen"
//       }`}
//     >
//       {!isHomeScreen && <div className="category-header">Select a Category</div>}
//       <div className="category-grid">
//         {categoryDropdownData.map((category, index) => (
//           <div
//             className="category-item"
//             key={index}
//             onClick={() =>
//               setHoveredIndex(hoveredIndex === index ? null : index)
//             }
//           >
//             <img
//               src={category.image}
//               alt={category?.name.join(" ")}
//               className="category-image"
//             />
//             <div className="category-text">
//               {category?.name.map((line, i) => (
//                 <div key={i}>
//                   {line}
//                   {i === category.name.length - 1 && (
//                     <img
//                       src={dropdownIcon}
//                       alt="dropdown"
//                       className="dropdown-icon"
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//             {hoveredIndex === index && (
//               <div className="dropdown-wrapper">
//                 <div className="category-dropdown">
//                   {category.dropdown.map((item, idx) => (
//                     <div
//                       className="dropdown-item"
//                       key={idx}
//                       onClick={(event) => {
//                         event.stopPropagation();
//                         saveDropdownValue(
//                           category.name[0],
//                           item.subcategory,
//                           item.categoryId
//                         );
//                       }}
//                     >
//                       {item.subcategory}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       {!isHomeScreen && (
//         <div className="others-box">
//           <div className="others-header">
//             Didn’t Find What You’re Looking For?
//           </div>
//           <div className="others-content">
//             We know not every category fits into a box. If your need doesn’t
//             match any of the listed options, Click{" "}
//             <span className="others-link">“Other”</span> to tell us more.
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Category;
