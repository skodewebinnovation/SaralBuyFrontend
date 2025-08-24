import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import { Card } from "./ui/card";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ItemCard = ({category,items}:{category:string,items:string[]}) => {
  const navigate = useNavigate()

  return (
    <div className="group">
      
      <HoverCard >
      <HoverCardTrigger asChild className="overflow-hidden ">
        <div className="w-32 cursor-pointer rounded-2x">
          <img
            className="w-full h-28 object-cover rounded-xs"
            src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
            alt="Category"
          />
          <div className="py-2 text-center flex justify-between items-center">
            <p className="text-sm pl-1 capitalize font-semibold">{category}</p>
            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:rotate-180 transition duration-300 ease-in-out delay-700"/>
          </div>
        </div>
      </HoverCardTrigger>

      {/* Content that appears below when hovering */}
   <HoverCardContent
        side="bottom"
        className="w-64 p-0 border rounded-lg overflow-hidden shadow-lg bg-white"
      >
        {items.map((item, index) => (
          <div
            onClick={() => navigate(`/${category}/${encodeURIComponent(item)}`)}
            key={index}
            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b last:border-none"
          >
            <span>{item}</span>
          </div>
        ))}
      </HoverCardContent>
    </HoverCard>
    </div>
  );
};

export default ItemCard;
