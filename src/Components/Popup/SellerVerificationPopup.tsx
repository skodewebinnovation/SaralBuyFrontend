import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select"; // Adjust path based on your structure
import { Button } from "../ui/button";
import { Spinner } from "../ui/shadcn-io/spinner";

type Props={
  open:boolean;
  setOpen:React.Dispatch<React.SetStateAction<boolean>>;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  value?:string;
  handleCreteBid:()=>void;
  createBidLoading:boolean

} 
const SellerVerificationPopup:React.FC<Props> = ({open,setOpen,setValue,value,handleCreteBid,createBidLoading}) => {
    

  return (
    <>    
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-4xs">
    <form onSubmit={(e)=>{
        e.preventDefault();
        handleCreteBid();
    }} className="p-2 max-w-md inline-block space-y-5 ">
    <div className="space-y-2">
         <DialogHeader className=" text-black text-3xl font-extrabold ">Seller Verification</DialogHeader>
         <DialogTitle className=" text-sm text-gray-600"> Placing Bid as an Individual or Business Owner?</DialogTitle>
       </div>
     <div className="space-y-5">
    <Select onValueChange={(value) => setValue?.(value)} value={value}>
      <SelectTrigger id="userType" className="w-full py-5 rounded-md border border-gray-300">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent className="p-1">
        <SelectItem value="individual" className="dropdown-hover">Individual</SelectItem>
        <SelectItem value="business" className="dropdown-hover">Business Owner</SelectItem>
      </SelectContent>
    </Select>

         <Button 
         disabled={!value || createBidLoading}
         type="submit" className="w-full rounded-sm py-5  text-white font-bold cursor-pointer" >
            {
              createBidLoading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Place Bid'
            }
          </Button>
  </div>
    </form>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SellerVerificationPopup;
