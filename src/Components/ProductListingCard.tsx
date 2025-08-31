
import { format } from "date-fns";
import { Button } from "../Components/ui/button";
import { User, MapPin, List } from "lucide-react";
import { getUserProfile } from "@/zustand/userProfile";
import { useState } from "react";
import LoginPopup from "./Popup/LoginPopup";
import OtpPopup from "./Popup/OTPPopup";
import { useNavigate } from "react-router-dom";
const ProductListingCard = ({product}:{product:any}) => {
  let {user} = getUserProfile();
  const [open,setOpen] = useState(false)
 const [otpPopup, setOtpPopup] = useState(false);
 const navigate = useNavigate()
 const [number,setNumber] = useState('')
  const handleSendOtp =()=>{
    if(!user){
       setOpen(true);
       return;
    }

    if(!(user as any)?.firstName && !(user as any)?.lastName && !(user as any)?.email){
      return navigate('/profile')
    }
  }
  return (
    <>
    {
      open && <LoginPopup open={true} setOpen={setOpen} setNumber={setNumber} setOtpPopup={setOtpPopup} />
    }
    {
      <OtpPopup open={otpPopup} setOpen={setOtpPopup} number={number} />
    }
      <div className='p-5 bg-white rounded-lg border '>
      <span className="border-2 border-gray-800 rounded-full mb-4 inline-block p-1  max-w-fit px-3 text-sm font-semibold">{product?.productType || 'No Type'}</span>
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
            <h2 className="font-bold text-xl text-gray-600  capitalize line-clamp-1">
            {product?.title}
            </h2>


            <div className="flex items-center text-sm text-gray-700 gap-2">
            <User size={16} /> {product?.createdBy?.userName || 'Pushpak'}
            </div>
            <div className="flex items-center text-sm text-gray-700 gap-2 line-clamp-1">
            <MapPin size={16} /> {product?.createdBy?.Location || 'Gurgaon'}
            </div>
            <div className="flex items-center text-sm text-gray-700 gap-2">
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
     <Button onClick={handleSendOtp} variant="ghost" size="lg" className="border  shadow-orange-500 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white cursor-pointer">
          Place Quotation
    </Button>
    </div>
     </div>
    </>
  )
}

export default ProductListingCard