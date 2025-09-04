import React, { useEffect, useState } from "react";
import saralBuyLogo from "../../image/Logo/saralBuyLogo.png";
import { useFetch } from "@/helper/use-fetch";
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
import authService from "@/services/auth.service";
import { DialogTitle } from "@radix-ui/react-dialog";
import { getUserProfile } from "@/zustand/userProfile";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useNavigate } from "react-router-dom";

type Props={
  open:boolean;
  setOpen:React.Dispatch<React.SetStateAction<boolean>>;
  number?:string
} 
const OtpPopup:React.FC<Props> = ({open,setOpen,number}) => {
  const {fn,data,loading}= useFetch(authService.verifyOtp)
    const [value, setValue] = React.useState("")
  const getProfile=  getUserProfile()
  const navigate = useNavigate();
  const handleVerify = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fn(number,value);
    e?.currentTarget?.reset();
  }

  useEffect(()=>{
    if(data){
     getProfile.execute();
      setOpen(false);
      if(!(getProfile as any)?.firstName && !(getProfile as any)?.lastName && !(getProfile as any)?.email){
      navigate('/account')
    }
    }
  },[data])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full p-6 space-y-3">
    
        <div className="h-20 flex justify-center">
          <img
            src={saralBuyLogo}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
       <div className="space-y-2">
         <DialogTitle className=" text-gray-700 text-3xl font-extrabold ">OTP Verification</DialogTitle>
         <p className="text-sm">Enter the OTP code send on your number {number?.toString().slice(0,4)}******</p>
       </div>

        <form onSubmit={handleVerify} className="flex justify-center items-center flex-col space-y-5">
         <InputOTP maxLength={4}  value={value}
        onChange={(value) => setValue(value)}>
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
     <Button type="submit" disabled={loading|| value.length !== 4} className="w-full py-5  text-white font-bold rounded-sm" >
               {
                loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Continue'
                }
              </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpPopup;
