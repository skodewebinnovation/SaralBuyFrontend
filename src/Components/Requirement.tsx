import type React from "react";
import RecentProductCard from "./RecentProductCard";

type Props = {
  seeAllButton?:boolean ;
  title:string;
  color?:string
}
const Requirement:React.FC<Props> = ({seeAllButton = false,title,color='gray'}) => {
  return (
    <div className="px-16 relative bg-no-repeat z-0 bg-cover  py-10  min-h-82 bg-[url('./grid.png')] requirement-bg ">
     <div className="absolute inset-0 bg-gray-200/70 -z-[1]"></div>
  <div className="flex justify-between items-center">
       <p className={`font-bold text-3xl sm:text-4xl text-${color}-600 border-l-5 border-${color}-600 pl-3 tracking-tight`}>
        {title}
      </p>
     {
      seeAllButton &&   <button className="text-md text-orange-600 hover:underline font-semibold">
          See All
        </button>
     }
  </div>

      {/* Card */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
    <RecentProductCard/>
    <RecentProductCard/>
    <RecentProductCard/>
    </div>
    </div>
  );
};

export default Requirement;