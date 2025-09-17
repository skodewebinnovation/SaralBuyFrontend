
import { format } from "date-fns";
import { Button } from "../Components/ui/button";
import { User, MapPin, List, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Authentication from "./auth/Authentication";
const ProductListingCard = ({product}:{product:any}) => {
  console.log(product)
  // let {user} = getUserProfile();
  const [open,setOpen] = useState(false)
 const navigate = useNavigate()

  const handleSendOtp =()=>{
    // if(!user){
    //    setOpen(true);
    //    return;
    // }
    // if(!(user as any)?.firstName && !(user as any)?.lastName && !(user as any)?.email){
    //   return navigate('/profile')
    // }
    return navigate('/product-overview?productId=' + product._id);
  }
  return (
    <>
    <Authentication setOpen={setOpen} open={open}/>
      <div className='py-3 px-4 bg-white rounded-lg border shadow-sm '>
      <span className="border-2 border-gray-600 text-gray-600 min-w-32 text-center rounded-full mb-4 inline-block p-1  max-w-fit px-3 text-sm font-semibold capitalize">{product?.categoryId?.categoryName || 'No Type'}</span>
      {/* image */}
      <div className='flex flex-row justify-start items-center gap-x-8'>
        <div className="w-28 h-28 flex-shrink-0">
            <img
  
            src={product?.image}
            alt="Construction Material"
            className="w-full h-full object-contain rounded-lg"
            />
            </div>
        
        {/* Content */}
            <div className="space-y-1">
            <h2 className="font-bold text-xl mb-2 text-gray-800  capitalize line-clamp-1">
            {product?.title}
            </h2>


            <div className="flex items-center text-sm text-gray-700 gap-2 space-y-1 capitalize">
            <UserCircle size={16} /> {product?.userId?.firstName+ " "+ product?.userId?.lastName || 'No Name found'}
            </div>
            <div className="flex items-center text-sm  text-gray-700 gap-2 line-clamp-1">
            <MapPin size={16} /> {product?.userId?.address|| 'No Address found'}
            </div>
            <div className="flex items-center text-sm text-gray-700 gap-2 capitalize">
            <List size={16} /> {product?.quantity} units
            </div>
            </div>
      </div>
    <div
    className="flex flex-row items-center justify-between mt-3"
    >
{
  product?.createdAt && <p className="text-sm text-gray-600 font-semibold ">Date: {format(product?.createdAt, "dd/MM/yyyy")}</p>
}
     <Button onClick={handleSendOtp} variant="ghost" size="lg" className="border rounded-sm  font-semibold shadow-orange-500 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer">
          Place Bid
    </Button>
    </div>
     </div>
    </>
  )
}

export default ProductListingCard