import { Gavel, Home, List, MapPin, Paperclip, UserRound } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../Components/ui/breadcrumb";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { DatePicker } from "@/utils/DatePicker";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "@/helper/use-fetch";
import productService from "@/services/product.service";
import { useEffect, useState } from "react";
import { mergeName } from "@/helper/mergeName";
import { currencyConvertor } from "@/helper/currencyConvertor";
import { dateFormatter } from "@/helper/dateFormatter";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getUserProfile } from "@/zustand/userProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { productOverviewBidSchema } from "@/validations/Schema";
import bidService from "@/services/bid.service";
import LoginPopup from "@/Components/Popup/LoginPopup";
import OtpPopup from "@/Components/Popup/OTPPopup";
import { Spinner } from "@/Components/ui/shadcn-io/spinner";
const ProductOverview = () => {
  const { productId } = useParams();
  const userProfile = getUserProfile()
  const navigate = useNavigate()
  const { fn: getProductById, data: productResponse, error } = useFetch(productService.getProductById);
  const { fn: createBidFn, data: createBidRes,loading:createBidLoading } = useFetch(bidService.createBid);
   const [open, setOpen] = useState(false)
    const [otpPopup, setOtpPopup] = useState(false);
    const [number, setNumber] = useState('')
  const { handleSubmit, formState: { errors }, register, reset, control } = useForm({
    resolver: zodResolver(productOverviewBidSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      budgetQuation: "",
      availableBrand: '',
      earliestDeliveryDate: undefined,
    }
  })
  useEffect(() => {
    getProductById(productId)
  }, [productId])

  // useEffect(() => {
  //   if (productResponse) {
  //     console.log(productResponse)
  //   }
  // }, [productResponse])


  console.log(productResponse)
  async function onSubmit(data: any) {
    const user = userProfile?.user
    if(!user?._id) return setOpen(true); // means need to login
    if(!productResponse) return console.log('product not found in frontend');
    const sellerId = productResponse.userId._id; // this is saller id  who is selling the product
    let obj ={
      ...data,
      status:"active"
    }
    await createBidFn(sellerId,productResponse._id,obj)
    
  }


  useEffect(()=>{
    if(createBidRes){
      toast.success('Bid created successfully') 
      reset({
        firstName: userProfile.user.firstName,
        lastName: userProfile.user.lastName,
        budgetQuation: '',
        availableBrand: '',
        earliestDeliveryDate: undefined
      });
    }
  },[createBidRes])


  useEffect(() => {
    if (userProfile?.user) {
      reset({
        firstName: userProfile.user.firstName,
        lastName: userProfile.user.lastName,
        budgetQuation: '',
        availableBrand: '',
        earliestDeliveryDate: undefined
      });
    }
  }, [userProfile, reset]);

  useEffect(() => {
    if (error === 'invalid product ID') {
      //  send to 404 page (API error)
    }
  }, [])


  useEffect(() => {
    for (let i = 0; i < Object.entries(errors).length; i++) {
      toast.error(Object.entries(errors)[i][1]?.message)
      break;
    }
  }, [errors])

  useEffect(() => window.scrollTo(0, 0), [])
  return (
    <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
      {/* Breadcrumb */}
       {
        open && <LoginPopup open={true} setOpen={setOpen} setNumber={setNumber} setOtpPopup={setOtpPopup} />
      }
      {
        <OtpPopup open={otpPopup} setOpen={setOtpPopup} number={number} />
      }
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem className="flex items-center gap-2 cursor-pointer">
            <Home className="h-4 w-4" />
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-gray-500">
              Industrial & Construction Materials
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Image */}
        <div className="lg:col-span-4 bg-gray-100 flex justify-center items-center rounded-lg p-4 max-h-68 ">
          <img
            src={productResponse?.image}
            alt="Product"
            className="object-contain h-full w-full"
          />
        </div>

        {/* Product Info */}
        <div className="lg:col-span-8 bg-white rounded-lg p-4 space-y-4">
          <h2 className="text-sm font-medium mb-2">
            Date : 12-2-2025
          </h2>

          <h2 className="text-xl font-bold capitalize">
            {productResponse?.title}
          </h2>
          <p className="text-sm text-gray-600">
            {productResponse?.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 pr-3 border-r-2 py-1 w-32">
              <UserRound className="w-5 h-5 " />
              <span className="capitalize">{mergeName(productResponse?.userId) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2  pr-3 border-r-2 py-1 w-32">
              <MapPin className="w-4 h-4 " />
              <span className="capitalize">{productResponse?.userId?.address || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 py-1 w-32">
              <List className="w-4 h-4 " />
              <span className="capitalize">{productResponse?.quantity || 'N/A'} units</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-5 ">
            <Button variant="outline" className="min-w-32 text-sm border-gray-400 border-[2px] flex items-center gap-2 hover:bg-transparent cursor-pointer">
              <img src="/icons/Layer_1.png" className="w-4 h-4 " />
              Total Bids :<span className="font-semibold">0</span>
            </Button>
            <Button className="min-w-32 border-[2px] border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition-all ease-in-out duration-300 cursor-pointer " variant="outline" >Add to Cart</Button>
          </div>
        </div>
      </div>

      {/* Requirement + Form */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 ">
        {/* Left: Requirement Spec */}
        <div className="lg:col-span-7  rounded-lg p-6 space-y-3 ">
          <h3 className="font-semibold text-orange-600 text-xl">Requirement Specifications</h3>
          <div className="text-sm space-y-2 text-gray-600 ">
            <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Product Type:</span> {productResponse?.subCategoryId?.name || "N/A"}</p>
            <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold">Brand:</span> {productResponse?.brand || "N/A"}</p>
            <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Construction Tool Type:</span> Industrial Tool</p>
            <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Budget:</span> {currencyConvertor(productResponse?.minimumBudget)}</p>
            <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Additional Delivery & Packaging:</span> {productResponse?.additionalDeliveryAndPackage || "N/A"}</p>
            <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Required Delivery Date:</span> {productResponse?.paymentAndDelivery?.ex_deliveryDate && dateFormatter(productResponse?.paymentAndDelivery?.ex_deliveryDate) || 'N/A'}</p>
            <p className="flex items-center justify-between py-2 border-b-2 capitalize"><span className="font-semibold">Payment Mode:</span> {productResponse?.paymentAndDelivery?.paymentMode || 'N/A'}</p>
            <p className="flex items-center justify-between py-2 border-b-2  "><span className="font-semibold">Supporting Documents:</span>{productResponse?.documentName ? <span className="flex gap-1 items-center hover:underline cursor-pointer"><Paperclip className="w-4 h-4 text-orange-600" /> {productResponse?.documentName}</span> : 'N/A'}</p>
          </div>
        </div>

        {/* Right: Form */}
        <form className="lg:col-span-5 bg-gray-50 rounded-lg p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-semibold text-orange-600">Fill the Details to Place Bid</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

           {
            userProfile?.user?._id && (
              <>
               <div>
              <Label htmlFor="firstName" className="mb-2 text-sm">First Name</Label>
              <Input type="text" readOnly placeholder="First Name" id="firstName" {...register("firstName")} className="bg-white" />
            </div>
            <div>
              <Label htmlFor="lastName" className="mb-2 text-sm">Last Name</Label>
              <Input type="text" readOnly placeholder="Last Name" id="lastName" {...register("lastName")} className="bg-white" />
            </div>
              </>
            )
           }
            <div>
              <Label htmlFor="bq" className="mb-2 text-sm">Budget Quotation</Label>
              <Input type="text" placeholder="₹ 00" id="bq" className="bg-white" {...register('budgetQuation')} />
            </div>
            <div>
              <Label htmlFor="ab" className="mb-2 text-sm">Available Brand</Label>
              <Input type="text" placeholder="Brand XYZ" id="ab" className="bg-white" {...register('availableBrand')} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="ab" className="mb-2 text-sm">Earliest Deliver By</Label>
              <Controller
                control={control}
                name="earliestDeliveryDate"
                render={({ field }) => (
                  <DatePicker
                    disabledBeforeDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
                    date={field.value}
                    title="DD-MM-YYYY"
                    className="w-full hover:bg-transparent"
                    setDate={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>

          </div>
          <Button
          disabled={createBidLoading}
          variant={'ghost'} className="w-32 float-end border shadow-orange-500 border-orange-500 bg-orange-600  transition-all ease-in-out duration-300 hover:bg-orange-500 text-white hover:text-white cursor-pointer">
            {
              createBidLoading ? <Spinner className="h-5 w-5 animate-spin" /> : 'Create Bid'
            }
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductOverview;
