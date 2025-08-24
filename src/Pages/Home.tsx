//Styles
import "../Styling/Home/homePage.css";
import Banner from "@/Components/Banner/Banner";
import ItemCard from "@/Components/ItemCard";
import Requirement from "@/Components/Requirement";
import SwiperBidSlider from "@/Components/SwiperBidSlider";





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
