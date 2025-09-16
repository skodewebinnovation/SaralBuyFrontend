import { Home, List, MapPin, Paperclip, UserRound } from "lucide-react";
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
import { useSearchParams } from 'react-router-dom';
import SellerVerificationPopup from "@/Components/Popup/SellerVerificationPopup";
import { Spinner } from "@/Components/ui/shadcn-io/spinner";
import Authentication from "@/Components/auth/Authentication";
const ProductOverview = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const bidId = searchParams.get('bidId');
  const userProfile = getUserProfile()
  const { fn: getProductById, data: productResponse, error } = useFetch(productService.getProductById);
  const { fn: bidOverviewFn, data: bidOverviewRes } = useFetch(bidService.bidOverViewbyId)
  const { fn: updateUserBidDets, data: updateUserBidDetsRes, loading: updateUserBidDetsLoading} = useFetch(bidService.updateUserBidDets)
  const { fn: createBidFn, data: createBidRes, loading: createBidLoading } = useFetch(bidService.createBid);
  const [open, setOpen] = useState(false)
  const [sellerVerification, setSellerVerification] = useState(false)
  const [businessType, setBusinessType] = useState('')
  const { handleSubmit, formState: { errors }, register, reset, control, getValues } = useForm({
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
    if (productId) {
      getProductById(productId)
    } else if (bidId) {
      bidOverviewFn(bidId)
    } else {
      toast.error('Invalid request')
    }
  }, [productId, bidId])

  // useEffect(()=>{
  //   if(bidOverviewRes)    console.log(setBidOverviewRes({...bidOverviewRes,myName:'Shubham'}))
  // },[bidOverviewLoading])


  async function handleCreteBid() {
    if (!productResponse) return;
    const buyerId = productResponse.userId?._id;
    const productId = productResponse._id;
    const sellerId = userProfile?.user._id;
    const budgetAmount = Number(getValues().budgetQuation) || 0;
    let obj = {
      ...getValues(),
      status: "active",
      businessType
    }
    if (!businessType) {
      toast.error('business is required !');
      setSellerVerification(true)
    }
    try {
      await createBidFn(buyerId, productId, obj);
      toast.success('Bid placed successfully');
  
      try {
        await bidService.createRequirement({ productId, sellerId, buyerId, budgetAmount });
        setTimeout(() => {
          toast.success('Requirement created successfully');
        }, 800); // 800ms delay
      } catch (err) {
        toast.error('Failed to create requirement');
      }
    } catch (err) {
      toast.error('Failed to place bid');
    }
  }

  async function onSubmit(data:any) {
    const user = userProfile?.user;
    const currentFormData = getValues();
    if (!user?._id) {
      localStorage.setItem("preLoginBidForm", JSON.stringify(currentFormData));
      return setOpen(true);
    }
    if (!productResponse && !bidOverviewRes) return console.log("product && bid not found in frontend");

    if(productResponse){
      setSellerVerification(true);
    }else{
      await updateUserBidDets(bidId,data)
    }
  }


  useEffect(()=>{
    if(updateUserBidDetsRes){
      toast.success('Bid updated successfully')
    }
  },[updateUserBidDetsRes])



  useEffect(() => {
    if (createBidRes) {
      toast.success('Bid created successfully')
      setSellerVerification(false)
      reset({
        firstName: userProfile.user.firstName,
        lastName: userProfile.user.lastName,
        budgetQuation: '',
        availableBrand: '',
        earliestDeliveryDate: undefined
      });
    }
  }, [createBidRes])


  useEffect(() => {
    if (userProfile?.user) {
      const savedData = localStorage.getItem("preLoginBidForm");

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        reset({
          ...parsedData,
          firstName: bidOverviewRes ? bidOverviewRes?.seller?.firstName : userProfile.user.firstName,
          lastName: bidOverviewRes ? bidOverviewRes?.seller?.lastName : userProfile.user.lastName,
        });

        localStorage.removeItem("preLoginBidForm");
      } else {
        reset({
          firstName: bidOverviewRes ? bidOverviewRes?.seller?.firstName : userProfile.user.firstName,
          lastName: bidOverviewRes ? bidOverviewRes?.seller?.lastName : userProfile.user.lastName,
          budgetQuation: bidOverviewRes ? bidOverviewRes?.budgetQuation : '',
          availableBrand: bidOverviewRes ? bidOverviewRes?.availableBrand : '',
          earliestDeliveryDate: bidOverviewRes ? bidOverviewRes?.earliestDeliveryDate : undefined
        });
      }
    }
  }, [userProfile, reset, bidOverviewRes]);


  useEffect(() => {
    if (error === 'invalid product ID') {
      //  send to 404 page (API error)
    }
  }, [])

  console.log(productResponse)

  useEffect(() => {
    for (let i = 0; i < Object.entries(errors).length; i++) {
      toast.error(Object.entries(errors)[i][1]?.message)
      break;
    }
  }, [errors])

  useEffect(() => window.scrollTo(0, 0), [])
  return (
    <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
     {
     <Authentication setOpen={setOpen} open={open} />
     }
      <SellerVerificationPopup setOpen={setSellerVerification} open={sellerVerification} setValue={setBusinessType} value={businessType} handleCreteBid={handleCreteBid} createBidLoading={createBidLoading} />
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
            src={bidOverviewRes ? bidOverviewRes?.product?.image : productResponse?.image || 'https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg'}      
            alt="Product"
            
            className="object-contain h-full w-full"
          />
        </div>

        {/* Product Info */}
        <div className="lg:col-span-8 bg-white rounded-lg p-4 space-y-4">
          <h2 className="text-sm font-medium mb-2">
            Date : {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.createdAt : productResponse?.createdAt)}
          </h2>

          <h2 className="text-xl font-bold capitalize">
            {
              bidOverviewRes ? bidOverviewRes?.product?.title : productResponse?.title}
          </h2>
          <p className="text-sm text-gray-600">
            {productResponse?.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 pr-3 border-r-2 py-1 min-w-32 max-w-[25%]">
              <UserRound className="w-5 h-5 " />
              <span className="capitalize">{mergeName(bidOverviewRes ? bidOverviewRes?.buyer : productResponse?.userId) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2  pr-3 border-r-2 py-1 min-w-32   max-w-[50%]">
              <MapPin className="w-4 h-4 " />
              <span className=" line-clamp-2">{bidOverviewRes ? bidOverviewRes?.buyer?.address : productResponse?.userId?.address || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 py-1 min-w-32 max-w-[25%]">
              <List className="w-4 h-4 " />
              <span className="capitalize">{bidOverviewRes ? bidOverviewRes?.product?.quantity : productResponse?.quantity || 'N/A'} units</span>
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
            <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Product Type:</span> {(bidOverviewRes ? bidOverviewRes?.product?.subCategory?.name : productResponse?.subCategoryId?.name )|| "N/A"}</p>
            <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold">Brand:</span> {(bidOverviewRes ? bidOverviewRes?.product?.brand : productResponse?.brand) || "N/A"}</p>
            {productResponse?.categoryId?.categoryName === "industrial" && (

              <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Construction Tool Type:</span> Industrial Tool</p>
            )}
            {
              (bidOverviewRes?.product?.minimumBudget || productResponse?.minimumBudget) && (

  <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Budget:</span> {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.minimumBudget
              : productResponse?.minimumBudget)}</p>
              )
            }
          
            <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold capitalize">Additional Delivery & Packaging:</span> {(bidOverviewRes ? bidOverviewRes?.product?.additionalDeliveryAndPackage : productResponse?.additionalDeliveryAndPackage )|| "N/A"}</p>

            <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Required Delivery Date:</span> {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.ex_deliveryDate :productResponse?.paymentAndDelivery?.ex_deliveryDate) || 'N/A'}</p>


            <p className="flex items-center justify-between py-2 border-b-2 capitalize"><span className="font-semibold">Payment Mode:</span> {bidOverviewRes? bidOverviewRes?.product?.paymentAndDelivery?.paymentMode : productResponse?.paymentAndDelivery?.paymentMode || 'N/A'}</p>
            <p className="flex items-center justify-between py-2 border-b-2  "><span className="font-semibold">Supporting Documents:</span>{(productResponse?.documentName || bidOverviewRes?.product?.documentName) ? <span className="flex gap-1 items-center hover:underline cursor-pointer"><Paperclip className="w-4 h-4 text-orange-600" /> {productResponse?.documentName || bidOverviewRes?.product?.documentName}</span> : 'N/A'}</p>
            
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
              <Input type="number" placeholder="₹ 00" id="bq" className="bg-white" {...register('budgetQuation')} />
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
          {
            !bidOverviewRes ? (
              <Button
                variant={'ghost'} className="w-32 float-end border shadow-orange-500 border-orange-500 bg-orange-600  transition-all ease-in-out duration-300 hover:bg-orange-500 text-white hover:text-white cursor-pointer">
                Place Bid
              </Button>
            ) :
              (
                <Button
                disabled={updateUserBidDetsLoading}
                  variant={'ghost'} className="w-32 float-end border shadow-orange-500 border-orange-500 bg-orange-600  transition-all ease-in-out duration-300 hover:bg-orange-500 text-white hover:text-white cursor-pointer">
                  {
                    updateUserBidDetsLoading ?
                    <Spinner className="w-5 h-5 animate-spin"/>
                    :
                    'Update Bid'
                  }
                </Button>
              )
          }
        </form>
      </div>
    </div>
  );
};

export default ProductOverview;
