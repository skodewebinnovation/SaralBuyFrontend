
import { mergeName } from "@/helper/mergeName";
import { Button } from "../Components/ui/button";
import { User, MapPin, List } from "lucide-react";
import { dateFormatter } from "@/helper/dateFormatter";
import { useNavigate } from "react-router-dom";
const RecentProductCard = ({item}:{item:any}) => {
  const navigate = useNavigate()
  return (
      <div className='p-5 bg-white rounded-lg shadow-md '>
      <span className="border-2 border-gray-800 rounded-full mb-4 inline-block p-1  max-w-fit px-3 text-sm font-semibold"> Sationary</span>
      {/* image */}
      <div className='flex flex-row justify-start items-center gap-x-6'>
        <div className="w-24 h-24 flex-shrink-0">
            <img
            
            src={item?.productId?.image || '/no-image.webp'}
            alt={item?.productId?.title || 'No Image'}
            className="w-full h-full object-cover rounded-lg"
            />
            </div>
        
        {/* Content */}
            <div className="space-y-1">
            <h2 className="font-bold text-md text-gray-600 ">
            {item?.productId?.title}
            </h2>


            <div className="flex items-center text-sm text-gray-700 gap-2">
            <User size={16} /> {mergeName(item?.buyerId)}
            </div>
            <div className="flex items-center text-sm text-gray-700 gap-2">
            <MapPin size={16} /> {item?.currentLocation || 'N/A'}
            </div>
            <div className="flex items-center text-sm text-gray-700 gap-2">
            <List size={16} /> {item?.productId?.quantity} units
            </div>
            </div>
      </div>
    <div
    className="flex flex-row items-center justify-between mt-3"
    >
<p className="text-sm text-gray-600 font-semibold ">Dated: {dateFormatter(item.createdAt)}</p>
     <Button
     onClick={
      ()=>{
        navigate(`/product-overview?productId=${item?.productId?._id}`)
      }
     }
     
     variant="ghost" size="lg" className="border  shadow-orange-500 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer">
          Place Quotation
    </Button>
    </div>
     </div>
  )
}

export default RecentProductCard