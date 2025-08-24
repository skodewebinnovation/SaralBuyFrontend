//Styles
import "../Styling/Home/homePage.css";
import Banner from "@/Components/Banner/Banner";
import ItemCard from "@/Components/ItemCard";
import Requirement from "@/Components/Requirement";
import SwiperBidSlider from "@/Components/SwiperBidSlider";


const dropdownData = [
  {
    category: "electronics",
    items: [
      "TVs and Screens",
      "Computer & Laptops",
      "Fridges",
      "Mobile/Tablets",
      "Mobile Accessories",
      "Computer Accessories",
      "Gaming Accessories",
      "Washing Machine",
      "AC",
      "Camera/Lenses"
    ]
  },
  {
    category: "automobile",
    items: [
      "Cars",
      "Motorcycles",
      "Truck/Buses",
      "Scooters",
      "Bicycles",
      "Two wheeler Accessories",
      "Four wheeler Accessories",
      "Three wheelers",
      "Others"
    ]
  },
  {
    category: "furniture",
    items: [
      "Sofa",
      "Beds & Wardrobes",
      "Dinings",
      "Tables and chairs",
      "Kids Furniture",
      "Mattres",
      "Others"
    ]
  },
  {
    category: "fashion",
    items: [
      "Clothes",
      "Fashion Jewellery",
      "Fashion Accessories",
      "Footwears",
      "Eyewears",
      "Beauty Products",
      "Others"
    ]
  },
  {
    category: "sports",
    items: [
      "Books & Papers",
      "SportsWears",
      "Gym and Fitness",
      "Music Instruments",
      "Online Gaming setups",
      "Others"
    ]
  },
  {
    category: "home",
    items: [
      "Electic Home Appliances",
      "Kitchen home Appliances",
      "Daily Usage items",
      "Grocery Materials",
      "Event and Pooja materials",
      "Decoration materials",
      "Bedroom Accessories",
      "Others"
    ]
  },
  {
    category: "beauty",
    items: [
      "Medicines",
      "Sexual wellness",
      "Beauty Products",
      "Others"
    ]
  },
  {
    category: "industrial",
    items: [
      "Cement",
      "Bricks",
      "Tiles & Marbels",
      "Iron & Steel Pipes",
      "Paint and Plasters",
      "Tools",
      "Home accessories",
      "Others"
    ]
  },

];



const Home = () => {
  return (
<main>
  <div className="w-full max-w-7xl mx-auto px-4">
  
  <Banner />
  {/* bid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-5">
    <SwiperBidSlider/>
    <SwiperBidSlider/>
  </div>
</div> 
{/* requirement  */}
  <div className="mt-10">
    <Requirement title="Your Requirements" color="orange"/>
  </div>
</main> );
};

export default Home;
