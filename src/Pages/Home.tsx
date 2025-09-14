//Styles
import Brands from "@/Components/Brands";
import "../Styling/Home/homePage.css";
import Banner from "@/Components/Banner/Banner";

import Requirement from "@/Components/Requirement";
import SwiperSlider from "@/Components/SwiperSlider";
import TrendingCategory from "@/Components/TrendingCategory";
import { dateFormatter } from "@/helper/dateFormatter";
import { useEffect, useState } from "react";
import { useFetch } from "@/helper/use-fetch";
import bidService from "@/services/bid.service";
import { Skeleton } from "@/Components/ui/skeleton";


const ItemSkeleton = ()=>(
     <div className="flex flex-col space-y-5">
     <div className="space-y-2 flex justify-between items">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-1/4" />
      </div>
      <Skeleton className="h-full w-full rounded-xl" />
     
    </div> 
)


const Home = () => {


    const { fn: getLatestThreeBidsFn, data: getLatestBidsThreeRes,loading:bidResponseLoading } = useFetch(bidService.getThreeLatestBids);
  const [bids,setBids]=useState([])
  const [drafts,setDrafts]=useState([
      {
      id: 1,
      date: "10-10-2025",
      category: "Stationary",
      title: "Children Books",
      deliveryDate: "10-10-2025",
      totalBids: 10,
      image:
        "https://media.istockphoto.com/id/1355687160/photo/various-sport-equipment-gear.jpg?s=612x612&w=0&k=20&c=NMA7dXMtGLJAin0z6N2uqrnwLXCRCXSw306SYfS49nI=",
    }, 
  ])




  

  useEffect(() => {
    getLatestThreeBidsFn()
  },[])
  useEffect(()=>{
    console.log(getLatestBidsThreeRes)
    if(getLatestBidsThreeRes){
      getLatestBidsThreeRes.map((bid:any)=>{
        setBids((prev:any)=>{
          return [...prev,{
            _id:bid._id,
            date:dateFormatter(bid.createdAt),
            category:bid.productId.categoryId.categoryName,
            title:bid.productId.title,
            deliveryDate:dateFormatter(bid.earliestDeliveryDate),
            totalBids:bid.bidCount || 0,
            image:bid.productId.image,
          }]
        })
      })
    }

  },[getLatestBidsThreeRes])
  return (
<main className="relative min-h-screen ">
  <div className="w-full max-w-7xl mx-auto px-4">
  <Banner /> 
  {/* bid */}

  <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-5">
    {
      bidResponseLoading ?
      <ItemSkeleton/>
      :
      bids.length > 0 &&<SwiperSlider title="Your Bids" target="bids" color="gray" data={bids}/>
    }
    {
      drafts.length > 0 && <SwiperSlider title="Your Drafts" target="drafts" color="orange" data={drafts}/>
    }
  </div>
</div> 
{/* requirement  */}
  <div className="mt-10">
    <Requirement title="Your Requirements" color="orange" bg/>
  </div>
    {/* trending Section */}
    <div className="mt-10 relative mx-auto px-4 w-full">
  <TrendingCategory />
<img src="All In One Market Place that Fits You.png" className="absolute -top-5 left-0 w-full">

</img>





</div>

    {/* requirement  */}
  <div >
    <Requirement title="Electronics" color="orange"/>
  </div>
  {/* brands */}
  <Brands></Brands>

</main> );
};

export default Home;
