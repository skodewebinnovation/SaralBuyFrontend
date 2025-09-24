import { Box, Home, List, MapPin, Paperclip, User, UserCircle } from "lucide-react";
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
import cartService from "@/services/cart.service";
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
import fileDownload from "js-file-download";
import instance from "@/lib/instance";
const ProductOverview = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const bidId = searchParams.get('bidId');
  const userProfile = getUserProfile()
  const { fn: getProductById, data: productResponse, error, setData: setProductResponse } = useFetch(productService.getProductById);
  const { fn: bidOverviewFn, data: bidOverviewRes } = useFetch(bidService.bidOverViewbyId)
  const { fn: updateUserBidDets, data: updateUserBidDetsRes, loading: updateUserBidDetsLoading } = useFetch(bidService.updateUserBidDets)
  const { fn: createBidFn, data: createBidRes, loading: createBidLoading} = useFetch(bidService.createBid);
  const {fn:addToCartFn, data: addToCartRes, loading: addToCartLoading} = useFetch(cartService.addToCart)
  const [open, setOpen] = useState(false)
  const [sellerVerification, setSellerVerification] = useState(false)
  const [businessType, setBusinessType] = useState('')
  const [downloading, setDownloading] = useState(false);
  // const [addToCartLoading, setAddToCartLoading] = useState(false);


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

  // Add to Cart Handler
  const handleAddToCart = async (productId: string) => {
   await addToCartFn(productId)
  };

  useEffect(()=>{
    if(addToCartRes){
      toast.success(addToCartRes.message)
    }
  },[addToCartRes])

  useEffect(() => {
    if (productId) {
      getProductById(productId)
    } else if (bidId) {
      bidOverviewFn(bidId)
    } else {
      toast.error('Invalid request')
    }
  }, [productId, bidId])

  useEffect(() => {
    if (productResponse && Array.isArray(productResponse)) {
      const mainProduct = productResponse[0];
      const products =
        mainProduct?.subProducts?.length > 0
          ? mainProduct.subProducts
          : [mainProduct];

      setProductResponse({
        ...mainProduct,
        products,
      });
      console.log(productResponse)
    }
  }, [productResponse]);


  // useEffect(()=>{
  //   if(bidOverviewRes)    console.log(setBidOverviewRes({...bidOverviewRes,myName:'Shubham'}))
  // },[bidOverviewLoading])


  async function handleCreteBid() {
    if (!productResponse) return;
    if(productResponse?.mainProduct?.userId?._id === userProfile?.user?._id) return;
    const buyerId = productResponse?.mainProduct.userId?._id;
    const productId = productResponse?.mainProduct._id;
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
      await Promise.all([
        createBidFn(buyerId, productId, obj),
        bidService.createRequirement({ productId, sellerId, buyerId, budgetAmount })
      ])
    } catch (err) {
      console.log(err);
      toast.error('Failed to place bid');
    }
  }

  async function onSubmit(data: any) {
    const user = userProfile?.user;
    const currentFormData = getValues();
    if (!user?._id) {
      localStorage.setItem("preLoginBidForm", JSON.stringify(currentFormData));
      return setOpen(true);
    }
    if (!productResponse && !bidOverviewRes) return console.log("product && bid not found in frontend");

    if (productResponse) {
      setSellerVerification(true);
    } else {
      await updateUserBidDets(bidId, data)
    }
  }


  useEffect(() => {
    if (updateUserBidDetsRes) {
      toast.success('Bid updated successfully')
      setBusinessType('')
    }
  }, [updateUserBidDetsRes])


  useEffect(() => {
    if (createBidRes) {
      if(productResponse.mainProduct){
      setProductResponse(()=>{
        return{
          ...productResponse,
          mainProduct:{
            ...productResponse.mainProduct,
            totalBidCount:productResponse.mainProduct.totalBidCount+1
          }
        }
      })
      }else{
        console.log('main product to missing update bid count')
      }
      toast.success('Bid created successfully')
      setSellerVerification(false)
      setBusinessType('')
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
  console.log(bidOverviewRes)

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

const handleDocumentDownload = (url: string) => {
  const fileName = url.split('/').pop() || 'downloaded-file';
  instance
    .get(url, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, fileName);
    })
    .catch((error) => {
      console.error("Download failed:", error);
    });
};

  return (
    <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
      {
        <Authentication setOpen={setOpen} open={open} />
      }
      <SellerVerificationPopup setOpen={setSellerVerification} open={sellerVerification} setValue={setBusinessType} value={businessType} handleCreteBid={handleCreteBid} createBidLoading={createBidLoading} />
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem className="flex items-center gap-2 ">
            <Home className="h-4 w-4" />
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-gray-500">
              Product
            </BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-gray-500">
              {bidOverviewRes ? bidOverviewRes?.product?.title : productResponse?.mainProduct?.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/*  for single product */}
      {
        (productResponse?.subProducts?.length === 0 || bidOverviewRes)
          ?
          // Single Product
          <div className="">
            {/* Content */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Image */}
              <div className="lg:col-span-4 bg-gray-100 flex justify-center items-center rounded-lg p-4 max-h-64 ">
                <img
                  src={bidOverviewRes ? bidOverviewRes?.product?.image : productResponse?.mainProduct?.image}
                  alt="Product"

                  className="object-contain h-full w-full"
                />
              </div>

              {/* Product Info */}
              <div className="lg:col-span-8 bg-transparent rounded-lg p-4 space-y-4">
                <h2 className="text-sm font-medium mb-2">
                  Date : {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.createdAt : productResponse?.mainProduct?.createdAt)}
                </h2>

                <h2 className="text-xl font-bold capitalize">
                  {
                    bidOverviewRes ? bidOverviewRes?.product?.title : productResponse?.mainProduct?.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {productResponse?.mainProduct?.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 pr-3 border-r-2 py-1 min-w-32 max-w-[25%]">
                    <UserCircle className="w-5 h-5 " />
                    <span className="capitalize">{mergeName(bidOverviewRes ? bidOverviewRes?.buyer : productResponse?.mainProduct?.userId) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1  pr-3 border-r-2 py-1 min-w-32   max-w-[50%]">
                    <MapPin className="w-4 h-4 " />
                    <span className=" line-clamp-2">{bidOverviewRes ? bidOverviewRes?.buyer?.address : productResponse?.mainProduct?.userId?.address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 py-1 min-w-32 max-w-[25%]">
                    <List className="w-4 h-4 " />
                    <span className="capitalize">{bidOverviewRes ? bidOverviewRes?.product?.quantity : productResponse?.mainProduct?.quantity || 'N/A'} units</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4 mt-5 ">
                  <Button variant="outline" className="min-w-32 text-sm border-gray-400 bg-transparent border-[2px] flex items-center gap-2 hover:bg-transparent ">
                    <img src="/icons/Layer_1.png" className="w-4 h-4 " />
                    Total Bids :<span className="font-semibold">{bidOverviewRes ? bidOverviewRes.product?.totalBidCount : productResponse?.mainProduct?.totalBidCount || 0}</span>
                  </Button>
                  {
                    !bidOverviewRes && (
                      <Button
                        className="min-w-32 border-[2px] border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
                        variant="outline"
                        onClick={() => handleAddToCart(productResponse?.mainProduct?._id)}
                        disabled={
                          addToCartLoading ||
                          productResponse?.mainProduct?.userId?._id === userProfile?.user?._id
                        }
                      >
                        {addToCartLoading ? <Spinner className="w-5 h-5 animate-spin" /> : "Add to Cart"}
                      </Button>
                    )
                  }
                </div>
              </div>
            </div>

            {/* Requirement + Form */}
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 ">
              {/* Left: Requirement Spec */}
              <div className="lg:col-span-7  rounded-lg p-6 space-y-3 ">
                <h3 className="font-semibold text-orange-600 text-xl">Requirement Specifications</h3>
                <div className="text-sm space-y-2 text-gray-600 ">
                  <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold">Product Type:</span> {(bidOverviewRes ? bidOverviewRes?.product?.subCategory?.name : productResponse?.mainProduct?.categoryId?.categoryName) || "N/A"}</p>
                  <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold">Brand:</span> {(bidOverviewRes ? bidOverviewRes?.product?.brand : productResponse?.mainProduct?.brand) || "N/A"}</p>
                  {productResponse?.mainProduct?.categoryId?.categoryName === "industrial" && (

                    <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Construction Tool Type:</span> Industrial Tool</p>
                  )}
                  {/* {
                    (bidOverviewRes?.product?.minimumBudget || productResponse?.mainProduct?.minimumBudget) && (

                      <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Budget:</span> {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.minimumBudget
                        : productResponse?.mainProduct?.minimumBudget)}</p>
                    )
                  } */}
                   
                     

                      <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Budget:</span> {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.budget
                        : productResponse?.mainProduct?.budget || 0) || 'N/A'}</p>
                   

                  <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold capitalize">Additional Delivery & Packaging:</span> {(bidOverviewRes ? bidOverviewRes?.product?.additionalDeliveryAndPackage : productResponse?.mainProduct?.additionalDeliveryAndPackage) || "N/A"}</p>

                  <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Required Delivery Date:</span> {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.ex_deliveryDate : productResponse?.mainProduct?.paymentAndDelivery?.ex_deliveryDate) || 'N/A'}</p>


                  <p className="flex items-center justify-between py-2 border-b-2 capitalize"><span className="font-semibold">Payment Mode:</span> {(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.paymentMode : productResponse?.mainProduct?.paymentAndDelivery?.paymentMode) || 'N/A'}</p>
                  {/* <p className="flex items-center justify-between py-2 border-b-2  "><span className="font-semibold">Supporting Documents:</span>{(productResponse?.mainProduct?.document || bidOverviewRes?.product?.document) ? <a download target="_blank" href={productResponse?.mainProduct?.document || bidOverviewRes?.product?.document} className="flex gap-1 items-center hover:underline cursor-pointer"><Paperclip className="w-4 h-4 text-orange-600" />Download Document</a> : 'N/A'}</p> */}
                      <p className="flex items-center justify-between py-2 border-b-2  "><span className="font-semibold">Supporting Documents:</span>{(productResponse?.mainProduct?.document || bidOverviewRes?.product?.document) ? <p  
                      onClick={() => handleDocumentDownload(
    productResponse?.mainProduct?.document || bidOverviewRes?.product?.document,
  )}
                      className="flex gap-1 items-center hover:underline cursor-pointer"><Paperclip className="w-4 h-4 text-orange-600" />Download Document</p> : 'N/A'}</p>

                </div>
              </div>

              {/* Right: Form */}
              <form className="lg:col-span-5 bg-gray-200/80 rounded-lg p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <h3 className="font-semibold text-orange-600">Fill the Details to Place Bid</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {
                    userProfile?.user?._id && (
                      <>
                        <div>
                          <Label htmlFor="firstName" className="mb-2 text-sm">First Name</Label>
                          <Input disabled type="text" placeholder="First Name" id="firstName" {...register("firstName")} className="bg-white  select-none" />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="mb-2 text-sm">Last Name</Label>
                          <Input disabled type="text" placeholder="Last Name" id="lastName" {...register("lastName")} className="bg-white  select-none" />
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
                          className="w-full"
                          setDate={(val) => field.onChange(val)}
                        />
                      )}
                    />
                  </div>

                </div>
                {
                  !bidOverviewRes ? (
                    <Button
                    
                    disabled={productResponse?.mainProduct?.userId?._id === userProfile?.user?._id ||createBidLoading}
                      variant={'ghost'} className="w-32 float-end border text-xs bg-orange-700  transition-all ease-in-out duration-300 hover:bg-orange-600 text-white hover:text-white cursor-pointer">
                      Place Bid
                    </Button>
                  ) :
                    (
                      <Button
                        disabled={updateUserBidDetsLoading}
                        variant={'ghost'} className="w-32 float-end border shadow-orange-500 border-orange-500 bg-orange-600  transition-all ease-in-out duration-300 hover:bg-orange-500 text-white hover:text-white cursor-pointer">
                        {
                          updateUserBidDetsLoading ?
                            <Spinner className="w-5 h-5 animate-spin" />
                            :
                            'Update Bid'
                        }
                      </Button>
                    )
                }
                <div>
                  
                </div>
              </form>
            </div>
          </div>
          :
          //  Multiple products
          productResponse?.subProducts && productResponse?.subProducts.map((item: any, idx: any) => {
            console.log(item)
              const isLast = idx === productResponse?.subProducts?.length - 1;
            return (
              <>
                {/* Content */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Image */}
                  <div className="lg:col-span-4 bg-gray-100 flex justify-center items-center rounded-lg p-4 max-h-64 ">
                    <img
                      src={bidOverviewRes ? bidOverviewRes?.product?.image : item?.image}
                      alt="Product"

                      className="object-contain h-full w-full"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="lg:col-span-8 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-medium mb-2">
                        Date : {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.createdAt : item?.createdAt)}
                      </h2>
                      <div className="flex gap-1 items-center">
                        <Box className="w-5 h-5 text-orange-500" />
                        <p className="text-gray-500 text-sm font-semibold">Product ({idx + 1})</p>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold capitalize">
                      {
                        bidOverviewRes ? bidOverviewRes?.product?.title : item?.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {item?.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1 pr-3 border-r-2 py-1 min-w-32 max-w-[25%]">
                        <User className="w-5 h-5 " />
                        <span className="capitalize">{mergeName(bidOverviewRes ? bidOverviewRes?.buyer : item?.userId) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1  pr-3 border-r-2 py-1 min-w-32   max-w-[50%]">
                        <MapPin className="w-4 h-4 " />
                        <span className=" line-clamp-2">{bidOverviewRes ? bidOverviewRes?.buyer?.address : item?.userId?.address || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1 py-1 min-w-32 max-w-[25%]">
                        <List className="w-4 h-4 " />
                        <span className="capitalize">{bidOverviewRes ? bidOverviewRes?.product?.quantity : item?.quantity || 'N/A'} units</span>
                      </div>
                    </div>

                    {/* Buttons */}
                   {
                    idx === 0 && (
                       <div className="flex items-center gap-4 mt-5 ">
                      <Button variant="outline" className="min-w-32 text-sm border-gray-400 bg-transparent border-[2px] flex items-center gap-2 hover:bg-transparent ">
                        <img src="/icons/Layer_1.png" className="w-4 h-4 " />
                        Total Bids :<span className="font-semibold">{bidOverviewRes ? bidOverviewRes.product?.totalBidCount : item?.totalBidCount || 0}</span>

                      </Button>
                      {
                        !bidOverviewRes && (
                          <Button
                            className="min-w-32 border-[2px] border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
                            variant="outline"
                            onClick={() => handleAddToCart(item?._id)}
                            disabled={
                              addToCartLoading ||
                              item?.userId?._id === userProfile?.user?._id
                            }
                          >
                            {addToCartLoading ? <Spinner className="w-5 h-5 animate-spin" /> : "Add to Cart"}
                          </Button>
                        )
                      }
                    </div>
                    )
                   }
                  </div>
                </div>

                {/* Requirement + Form */}
                <div className={`mt-5 grid grid-cols-1 lg:${isLast ? 'grid-cols-12' :'grid-cols-1'} gap-6`}>
                  <div className={`grid lg:${isLast ? 'col-span-7' : 'col-span-1'}  rounded-lg  space-y-3 `}>
                    <h3 className="font-semibold text-orange-600 text-xl">Requirement Specifications</h3>
                    <div className="text-sm space-y-2 text-gray-600 ">
                      <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold">Product Type:</span> {(bidOverviewRes ? bidOverviewRes?.product?.subCategory?.name : item?.categoryId?.categoryName) || "N/A"}</p>
                      <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold">Brand:</span> {(bidOverviewRes ? bidOverviewRes?.product?.brand : item?.brand) || "N/A"}</p>
                      {item?.categoryId?.categoryName === "industrial" && (

                        <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Construction Tool Type:</span> Industrial Tool</p>
                      )}
                      {/* {
                        (bidOverviewRes?.product?.minimumBudget || item?.minimumBudget) && (

                          <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Budget:</span> {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.minimumBudget
                            : item?.minimumBudget)}</p>
                        )
                      } */}
                
                          <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Budget:</span> {currencyConvertor(bidOverviewRes ? bidOverviewRes?.product?.budget
                            : item?.budget || 0) || 'N/A'}</p>
                      

                      <p className="flex items-center justify-between py-2 border-b-2 capitalize "><span className="font-semibold capitalize">Additional Delivery & Packaging:</span> {(bidOverviewRes ? bidOverviewRes?.product?.additionalDeliveryAndPackage : item?.additionalDeliveryAndPackage) || "N/A"}</p>

                      <p className="flex items-center justify-between py-2 border-b-2 "><span className="font-semibold">Required Delivery Date:</span> {dateFormatter(bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.ex_deliveryDate : item?.paymentAndDelivery?.ex_deliveryDate) || 'N/A'}</p>


                      <p className="flex items-center justify-between py-2 border-b-2 capitalize"><span className="font-semibold">Payment Mode:</span> {bidOverviewRes ? bidOverviewRes?.product?.paymentAndDelivery?.paymentMode : item?.paymentAndDelivery?.paymentMode || 'N/A'}</p>

                      <p className="flex items-center justify-between py-2 border-b-2  "><span className="font-semibold">Supporting Documents:</span>{(item?.document || bidOverviewRes?.product?.document) ? <span className="flex gap-1 items-center hover:underline cursor-pointer"><Paperclip className="w-4 h-4 text-orange-600" /> {item?.document || bidOverviewRes?.product?.document}</span> : 'N/A'}</p>

                    </div>
                  </div>
                  {
                    idx === productResponse?.products?.length - 1 && (
                      <form className="lg:col-span-5  bg-gray-200/80 rounded-lg p-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <h3 className="font-semibold text-orange-600">Fill the Details to Place Bid</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                          {
                            userProfile?.user?._id && (
                              <>
                                <div>
                                  <Label htmlFor="firstName" className="mb-2 text-sm">First Name</Label>
                                  <Input disabled type="text" placeholder="First Name" id="firstName" {...register("firstName")} className="bg-white  select-none" />
                                </div>
                                <div>
                                  <Label htmlFor="lastName" className="mb-2 text-sm">Last Name</Label>
                                  <Input disabled type="text" placeholder="Last Name" id="lastName" {...register("lastName")} className="bg-white  select-none" />
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
                                  className="w-full"
                                  setDate={(val) => field.onChange(val)}
                                />
                              )}
                            />
                          </div>

                        </div>
                        {
                          !bidOverviewRes ? (
                            <Button
                            disabled={productResponse?.mainProduct?.userId?._id === userProfile?.user?._id || createBidLoading}
                              variant={'ghost'} className="w-32 float-end border text-xs bg-orange-700  transition-all ease-in-out duration-300 hover:bg-orange-600 text-white hover:text-white cursor-pointer">
                              Place Bid
                            </Button>
                          ) :
                            (
                              <Button
                                disabled={updateUserBidDetsLoading}
                                variant={'ghost'} className="w-32 float-end border shadow-orange-500 border-orange-500 bg-orange-600  transition-all ease-in-out duration-300 hover:bg-orange-500 text-white hover:text-white cursor-pointer">
                                {
                                  updateUserBidDetsLoading ?
                                    <Spinner className="w-5 h-5 animate-spin" />
                                    :
                                    'Update Bid'
                                }
                              </Button>
                            )
                        }
                      </form>
                    )
                  }
                </div>
              </>
            )
          })
      }




    </div>
  );
};

export default ProductOverview;
