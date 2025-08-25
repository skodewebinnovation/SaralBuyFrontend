import React, { useState } from "react";
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { XCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

type Props={
  open:boolean;
  setOpen:React.Dispatch<React.SetStateAction<boolean>>
} 
const PlaceRequirementPopup:React.FC<Props> = ({open,setOpen}) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
      setError("");
    }
  };

  const handleSendOTP = () => {
    if (mobileNumber.length !== 10) {
      setError("Enter a valid 10 digit mobile number");
      return;
    }
    if (!error) {
      navigate("/login/otp", { state: { mobileNumber } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full p-6 space-y-5">
              <DialogHeader>
            <DialogTitle className=" text-gray-700 text-3xl font-bold">Place Requirement</DialogTitle>
            <DialogDescription>
              How Long Should You Bid Remain Active ?
            </DialogDescription>
          </DialogHeader>


        <div className="space-y-4 w-full">   
          <Input
            className="w-full py-5"
            type="text"
            placeholder="Enter your bid"
            value={mobileNumber}
            onChange={handleNumberChange}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button className="w-full py-5 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-md" onClick={handleSendOTP}>
            Place Requirement 
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceRequirementPopup;
