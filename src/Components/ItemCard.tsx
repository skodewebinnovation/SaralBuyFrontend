
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// const ItemCard = ({categoryName,subCategories,image,_id}:{categoryName:string,subCategories:string[],image:string,_id:string}) => {
//   const navigate = useNavigate()

//   return (
//     <div className="group">
      
//       <HoverCard >
//       <HoverCardTrigger asChild className="overflow-hidden ">
//         <div className="cursor-pointer rounded-2x">
//           <img
//             className="w-full h-24 object-cover rounded-xs bg-blend-hard-light"
//             src={image}
//             alt="Category"
//           />
//           <div className="py-2 text-center flex justify-between items-center">
//             <p className="text-sm pl-1 capitalize font-semibold">{categoryName}</p>
//             <ChevronDown className="w-5 h-5 text-gray-500 group-hover:rotate-180 transition duration-300 ease-in-out delay-700"/>
//           </div>
//         </div>
//       </HoverCardTrigger>

//       {/* Content that appears below when hovering */}
//    <HoverCardContent
//         side="bottom"
//         className="w-64 p-0 border rounded-lg overflow-hidden shadow-lg bg-white"
//       >
//         {subCategories.map((item:any, index) => (
//           <div
//             onClick={() => navigate(`/category/${_id}/${item._id}`)}
//             key={index}
//             className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b last:border-none"
//           >
//             <span>{item?.name}</span>
//           </div>
//         ))}
//       </HoverCardContent>
//     </HoverCard>
//     </div>
//   );
// };

// export default ItemCard;





// import React, { useState } from "react";
// import { ChevronDown } from "lucide-react";
// import { useNavigate } from "react-router-dom";

const ItemCard = ({
  categoryName,
  subCategories,
  image,
  _id,
}: {
  categoryName: string;
  subCategories: string[];
  image: string;
  _id: string;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest(`#itemcard-${_id}`)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, _id]);

  return (
    <div className="group flex flex-col w-full relative" id={`itemcard-${_id}`}>
      {/* Card Trigger */}
      <div
        className="cursor-pointer rounded-2x w-full"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          className="w-full h-24 object-cover rounded-xs bg-blend-hard-light"
          src={image}
          alt="Category"
        />
        <div className="py-2 text-center flex justify-between items-center">
          <p className="text-sm pl-1 capitalize font-medium ">{categoryName === "beauty" ? 'Personal Care' : categoryName === "electronics" ? 'Electronics Appliances' : categoryName  === "sports" ? 'Sports & Stationary' : categoryName === 'home' ? 'Home Appliances' : categoryName  === 'industrial' ?"Industrial & Construction Material" : categoryName}</p>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown with scrollbar */}
      <div
        className={`
          absolute left-0 top-full rounded-md z-30 w-[200px] bg-white border border-gray-200 mt-1
          transition-all duration-300 origin-top
          ${open ? "max-h-56 opacity-100 scale-y-100 pointer-events-auto" : "max-h-0 opacity-0 scale-y-95 pointer-events-none"}
        `}
      >
        <div
          className="overflow-y-auto max-h-56 scroll-visible"
        >
          {subCategories.map((item: any, index) => (
            <div
              onClick={() => navigate(`/category/${_id}/${item._id}`)}
              key={index}
              className="px-3 py-2 text-sm hover:bg-orange-100 transition-all duration-300 hover:text-orange-500 ease-in-out hover:pl-5 cursor-pointer flex items-center justify-between border-b last:border-none"
            >
              <span>{item?.name || item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

