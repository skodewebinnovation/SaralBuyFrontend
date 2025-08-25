import React, { useState } from "react";
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../ui/input-otp"; 
import {
  Dialog,
  DialogContent,
} from "../ui/dialog";

type Props={
  open:boolean;
  setOpen:React.Dispatch<React.SetStateAction<boolean>>
} 
const OtpPopup:React.FC<Props> = ({open,setOpen}) => {


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full p-6 space-y-3">
    
        <div className="h-16 flex justify-center">
          <img
            src={saralBuyLogo}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
       <div className="space-y-2">
         <h1 className=" text-gray-700 text-3xl font-bold">OTP Verification</h1>
         <p>Enter the OTP code send on your number 9785******</p>
       </div>

        <div className="flex justify-center items-center flex-col space-y-5">
         <InputOTP maxLength={6}>
      <InputOTPGroup className="space-x-4">
        <InputOTPSlot
          index={0}
          className="bg-secondary rounded-md border-l border-accent shadow-none font-semibold h-10 w-10"
        />
        <InputOTPSlot
          index={1}
          className="bg-secondary rounded-md border-l border-accent shadow-none font-semibold"
        />
        <InputOTPSlot
          index={2}
          className="bg-secondary rounded-md border-l border-accent shadow-none font-semibold"
        />
        <InputOTPSlot
          index={3}
          className="bg-secondary rounded-md border-l border-accent shadow-none font-semibold"
        />
      </InputOTPGroup>
    </InputOTP>
     <Button className="w-full py-5 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-md" >
               Continue
              </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpPopup;
