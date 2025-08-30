import Banner from '@/Components/Banner/Banner';
import ItemCard from '@/Components/ItemCard'
import { useCategoriesStore } from '@/zustand/getCategories';

import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
const Requirement = () => {
 const { data, loading, error } = useCategoriesStore();


  return (
    <div className="w-full max-w-7xl mx-auto px-4 min-h-screen">
      <Banner/>
     
        <h1 className="text-3xl font-bold text-orange-600 mt-10 mb-4">Select a Category</h1>
     <div className="grid grid-cols-8 ">
      {
   data &&  (data as any[])?.map((item:any)=><ItemCard key={item._id} {...item}/>)
      }
    </div>
    {/* looking for div */}
    <div className='bg-orange-50 p-5 rounded-lg mt-10'>
      <h1 className='text-lg font-bold text-start'>Didn't Find What You'r Looking For ?</h1>
      <div className='flex justify-between items-center m-1'>
        <p className='text-gray-600 text-sm'>What know not every category fit into a box. if your need doesn't match one of the listed options. Click <Link to={"/"} className='text-blue-600 underline'>Other </Link> to tell us more.</p>
        <MoveRight className="h-4 w-4 text-gray-600" />
      </div>
    </div>
   </div>
  )
}

export default Requirement