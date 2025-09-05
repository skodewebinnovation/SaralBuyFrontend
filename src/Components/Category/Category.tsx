import React, { useEffect, useRef, useState } from "react";
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../Components/ui/breadcrumb";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Textarea } from "../../Components/ui/textarea";
import { PlusIcon, Upload, FileUp, MoveLeft, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import { DatePicker } from "../../utils/DatePicker";
import { Range } from "react-range";

import { CategoryFormchema } from "@/validations/Schema";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useFetch } from "@/helper/use-fetch";
import productService from "@/services/product.service";
import categoryService from "@/services/category.service";
import { Spinner } from "../ui/shadcn-io/spinner";
import { getUserProfile } from "@/zustand/userProfile";
import LoginPopup from "../Popup/LoginPopup";
import OtpPopup from "../Popup/OTPPopup";
import type { CategoryNames } from "@/interface/Categories";
import { SearchableDropdown } from "@/utils/searchableDropdown";
import { electronicCategories } from "@/const/categoriesData";

const innerFormImages:Record<string,string>={
  automobile:"automobileFormImage.png",
  fashion:"fashionFormImage.png",
  electronics:"electronicsFormImage.png",
  home:"homeapplianceFormImage.png",
  sports:"sportsFormImage.png",
  furniture:"furnitureFormImage.png",
  health:"healthFormImage.png",
  beauty:"beautyFormImage.png",
  service:"servicesFormImage.png",
  industrial:"constructionFormImage.png"
}





const Category = () => {
  const navigate = useNavigate();
  const { categoryId, subCategoryId } = useParams() // getting cID && subCID
  const [subCategroies, setSubCategoies] = useState([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [values, setValues] = useState([2, 10]);
  const { fn, data: productCreateData, loading } = useFetch(productService.addProduct)
  const { fn: getCatByIdFn, data: catByIdData } = useFetch(categoryService.getCategoriesById)
  const [image, setImage] = useState<File | null>(null);
  const [fileDoc, setFileDoc] = useState<File | null>(null);
  const [currentCategoryName, setCurrentCategoryName] = useState<CategoryNames | null>(null)
  const imageRef = useRef(null)
  const fileDocRef = useRef(null)
  let { user } = getUserProfile();
  const [open, setOpen] = useState(false)
  const [otpPopup, setOtpPopup] = useState(false);
  const [brand, setbrand] = useState('')

  const [brandRenderItems, setBrandRenderItems] = useState<{ label: string, value: string }[]>([])

  const [number, setNumber] = useState('')
  useEffect(() => {
    (async () => {
      await getCatByIdFn(categoryId)
    })()
  }, [categoryId])







  useEffect(() => {
    if (catByIdData) {
      try {
        const decodedCategoryName = decodeURIComponent(catByIdData?.categoryName).toLowerCase()
  
        setCurrentCategoryName(decodedCategoryName as CategoryNames || null);
      } catch (e) {
        console.error("Error decoding category name:", e);
        setCurrentCategoryName(null);
      }
      setSubCategoies((catByIdData as any)?.subCategories)
    }
  }, [catByIdData])




  


  const { watch, handleSubmit, setValue, formState: { errors }, register, getValues, reset } = useForm({
    resolver: zodResolver(CategoryFormchema) as any,
    defaultValues: {
      title: '',
      quantity: '',
      subCategoryId: '',
      minimumBudget: '',
      productType: '',  // is new or not
      oldProductValue: { // if old one this
        min: '',
        max: ''
      },
      productCondition: '', // if old one this
      categoryId : '',
      // section 2
      image: '',      // store image URL or path
      document: '',   // store doc/pdf path
      description: '',
      // section 3
      paymentAndDelivery: {
        ex_deliveryDate: undefined as Date | undefined,
        paymentMode: '',  // if yes aalow the below field
        gstNumber: '',
        organizationName: '',
        organizationAddress: ''
      },
      draft: false,
      gst_requirement: '',
      
      // Additional fields for specific categories
      brand: '',
      additionalDeliveryAndPackage: '',
      gender: '',
      typeOfAccessories: '',
      fuelType: '',
      model: '',
      color: '',
      transmission: '',
      conditionOfProduct: '',
      constructionToolType: '',
      toolType: '',
      rateAService: ''
    }
  })

 const gstField = watch("gst_requirement")
  const productField = watch("productType")
  const selectedSubategoryId = watch("subCategoryId")
  const paymentMode = watch("paymentAndDelivery.paymentMode");
  const additionalDeliveryValue = watch("additionalDeliveryAndPackage");
  const genderValue = watch("gender");
  const typeOfAccessoriesValue = watch("typeOfAccessories");
  const fuelTypeValue = watch("fuelType");
  const modelValue = watch("model");
  const colorValue = watch("color");
  const transmissionValue = watch("transmission");
  const conditionOfProductValue = watch("conditionOfProduct");
  const constructionToolTypeValue = watch("constructionToolType");
  const toolTypeValue = watch("toolType");
  const rateAServiceValue = watch("rateAService");


  useEffect(() => {
    setValue("oldProductValue.min", values[0].toString());
    setValue("oldProductValue.max", values[1].toString());
  }, [values, setValue]);
    useEffect(()=>{
    setValue('brand',brand)
  },[brand])

  async function onSubmit(data: any) {
    if (!user) {
      setOpen(true);
      return;
    }
    console.log({data})
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (typeof val === "object") {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, val as any);
      }
    });
    if (image) formData.append("image", image);
    if (fileDoc) formData.append("document", fileDoc);
    await fn(categoryId, selectedSubategoryId, formData)
  }


  useEffect(() => {
    for (let i = 0; i < Object.entries(errors).length; i++) {
      toast.error(Object.entries(errors)[i][1]?.message)
      break;
    }
  }, [errors])

  useEffect(() => {
    if (productCreateData) {
      toast.success("Product Created Successfully")
      setBrandRenderItems([])
      setDate(undefined)
      reset()
      setImage(null)
      setFileDoc(null)
    }
  }, [productCreateData])

  useEffect(()=>window.scrollTo(0,0),[])

  return (
    <>

      {
        open && <LoginPopup open={true} setOpen={setOpen} setNumber={setNumber} setOtpPopup={setOtpPopup} />
      }
      {
        <OtpPopup open={otpPopup} setOpen={setOtpPopup} number={number} />
      }
      <div className="w-full max-w-7xl mx-auto p-4">
        {/* Breadcrumb + Action */}
        <div className="flex flex-row sm:justify-between justify-end items-center gap-3 mb-6">
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList >
              <BreadcrumbItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                navigate(-1)
              }}>
                <MoveLeft className="h-4 w-4" />
                <BreadcrumbPage className="capitalize font-semibold  text-gray-500">
                  Selected Product
                </BreadcrumbPage>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="capitalize font-semibold text-orange-600">
                  {currentCategoryName || ""}
                </BreadcrumbPage>
              </BreadcrumbItem>

            </BreadcrumbList>
          </Breadcrumb>

          <Button variant={'link'} className="bg-orange-600 cursor-pointer w-32 hover:bg-orange-500  text-white  rounded-md flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Responsive Layout */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Panel */}
            <div className=" md:col-span-1 lg:col-span-1 bg-white shadow-sm rounded-2xl p-6 border xs:grid xs:grid-cols-2 gap-6  space-y-4">
              <div className="col-span-1  align-center sm:block flex flex-col justify-center ">
                <h2 className="text-lg font-semibold mb-2">Tailor Your Experience</h2>
                <p className="text-sm text-muted-foreground">
                  Please help us tailor the experience by filling out the form below.
                  If this isn’t the category you meant to choose, you can go back and
                  select another one.
                </p>
              </div>
              <div className="col-span-1 w-full">
                <img src={'/categoryFormImages/'+innerFormImages[currentCategoryName!]} alt="" loading="lazy" className="m-auto w-full" />
              </div>
            </div>


            <div className="col-span-2 md:col-span-2 flex flex-col gap-6">

              <div className=" shadow-sm rounded-2xl p-6 border bg-gray-50 ">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <Input type="text" placeholder="Title*" className=" bg-white col-span-1 md:col-span-3"  {...register('title')} />
                  <Select
                    value={selectedSubategoryId}
                    onValueChange={(value) => {
                      const selectProductName = catByIdData?.subCategories.find((item: any) => item._id === value)?.name || 'N/A'
                      const brandsArray = electronicCategories.find((item) =>
                        item.category.toLowerCase() === selectProductName.toLowerCase()
                      )?.brands
                      console.log(brandsArray)
                      if (brandsArray!?.length > 0) {
                        setBrandRenderItems(brandsArray as any)
                      }

                      setValue('subCategoryId', value);
                    }}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        catByIdData && subCategroies.map((c: any) => <SelectItem value={c?._id}>{c?.name}</SelectItem>)
                      }
                    </SelectContent>
                  </Select>
                  {
                    currentCategoryName !== "service" && (
                      //    <Select>
                      //   <SelectTrigger className="w-full bg-white">
                      //     <SelectValue placeholder="Select Brand" />
                      //   </SelectTrigger>
                      //   <SelectContent>
                      //     <SelectItem value="no_data" >No data</SelectItem>
                      //   </SelectContent>
                      // </Select>

                      <SearchableDropdown disbaled={!selectedSubategoryId} setValue={setbrand} value={brand} className="w-full" dropdownTitle="Brands"
                        renderItems={brandRenderItems}
                      />
                    )
                  }
                  {
                    currentCategoryName === "electronics" && (
                      <Input type="text" placeholder="₹ Enter a Minimum Budget" {...register('minimumBudget')}
                       className="bg-white" />
                    )
                  }
                  {/* Quantity */}
                  {
                    currentCategoryName !== "service" && (
                      <Input type="text" placeholder="Quantity*"  {...register('quantity')} className="bg-white col-span-1" />
                    )
                  }

                  {/* rate a service */}
                  {
                    currentCategoryName === "service" && (
                      <Select
                       value={rateAServiceValue}
                      onValueChange={(value) => setValue("rateAService", value)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Rate a Service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no_data" >No data</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  }
                  {
                    (currentCategoryName === "automobile" || currentCategoryName === "furniture" || currentCategoryName === "sports" || currentCategoryName === "fashion" || currentCategoryName === "home" || currentCategoryName === "beauty" || currentCategoryName === "industrial") && (
                      <>
                        {/* Additional Delivery */}
                        <Select
                         value={additionalDeliveryValue}
                    onValueChange={(value) => setValue("additionalDeliveryAndPackage", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Additional Delivery & Packaging" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes" >Yes</SelectItem>
                            <SelectItem value="no" >No</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )
                  }
                  {/* gender */}
                  {
                    currentCategoryName === "fashion" && (
                      <Select
                       value={genderValue}
                    onValueChange={(value) => setValue("gender", value)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gender" >Gender</SelectItem>
                          <SelectItem value="female" >Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  }
                  {
                    (currentCategoryName === "fashion" || currentCategoryName === "beauty") && (
                      <>

                        <Select
                           value={typeOfAccessoriesValue}
                    onValueChange={(value) => setValue("typeOfAccessories", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Type of Accessories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jewelry" >Jewelry</SelectItem>
                            <SelectItem value="bags" >Bags</SelectItem>
                            <SelectItem value="footwear" >Footwear</SelectItem>
                            <SelectItem value="headware" >Headware</SelectItem>
                            <SelectItem value="eyeware" >Eyeware</SelectItem>
                            <SelectItem value="belts" >Belts</SelectItem>
                            <SelectItem value="scarves_&_wraps" >Belts</SelectItem>
                            <SelectItem value="watches" >Watches</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )
                  }

                  {
                    currentCategoryName === "automobile" && (
                      <>

                        {/*  Fuel Type */}
                        <Select
                            value={fuelTypeValue}
                      onValueChange={(value) => setValue("fuelType", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Fuel Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="petrol" >Petrol</SelectItem>
                            <SelectItem value="cng" >CNG</SelectItem>
                            <SelectItem value="hybrid" >Hybrid</SelectItem>
                            <SelectItem value="electric" >Electric</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Model */}
                        <Select
                         value={modelValue}
                      onValueChange={(value) => setValue("model", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="brand_new" >Brand New (Unused)</SelectItem>
                            <SelectItem value="like_new_used_3_months">Like New (Used &lt; 3 Months)</SelectItem>
                            <SelectItem value="gently_used_3_6_months">Gently Used (3 - 6 Months)</SelectItem>
                            <SelectItem value="used_6_12_months">Used (6 - 12 Months)</SelectItem>
                            <SelectItem value="1_year_old">1 Year Old</SelectItem>
                            <SelectItem value="2_year_old">2 Year Old</SelectItem>
                            <SelectItem value="3_year_old">3 Year Old</SelectItem>
                            <SelectItem value="4_year_old">4 Year Old</SelectItem>
                            <SelectItem value="5_year_old">5 Year Old</SelectItem>
                            <SelectItem value="more_than_5_year_old">More Than 5 Years Old</SelectItem>
                            <SelectItem value="vintage_10_plus_years_old">Vintage (10+ Years Old)</SelectItem>
                            <SelectItem value="unknown">Unknown / Not Sure</SelectItem>

                          </SelectContent>
                        </Select>

                        {/* Color */}
                        <Select
                         value={colorValue}
                      onValueChange={(value) => setValue("color", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_data" >No data</SelectItem>
                          </SelectContent>
                        </Select>


                        {/* Transmission */}
                        <Select
                          value={transmissionValue}
                      onValueChange={(value) => setValue("transmission", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Transmission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="automatic" >Automatic</SelectItem>
                            <SelectItem value="manual" >Manual</SelectItem>
                          </SelectContent>
                        </Select>

                      </>

                    )
                  }
                  {
                    (currentCategoryName === "furniture" || currentCategoryName === "sports" || currentCategoryName == "automobile" || currentCategoryName === "home" || currentCategoryName === "electronics") && (
                      <>
                        {
                          (productField === 'new_product' || productField === '') && (
                            <Select
                              value={productField}
                              onValueChange={(value) => setValue("productType", value)}>
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Product Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new_product">New Product</SelectItem>
                                <SelectItem value="old_product">Old Product</SelectItem>
                              </SelectContent>
                            </Select>
                          )
                        }



                        {/* product */}
                        {
                          productField === 'old_product' && (
                            <>
                              <div className="w-full max-w-md border-[1.5px] border-gray-200 rounded-lg bg-white p-3">
                                <div className="flex justify-between items-center mb-3">
                                  <Label className=" font-medium text-gray-500">Old Product</Label>
                                  <XIcon className="w-4 h-4 text-gray-400 cursor-pointer" onClick={() => {
                                    setValue('productType', 'new_product')
                                  }} />
                                </div>
                                <Range
                                  values={values}
                                  step={0.1}
                                  min={0}
                                  max={20}
                                  onChange={(vals) => setValues(vals)}
                                  renderTrack={({ props, children }) => (
                                    <div
                                      {...props}
                                      className="h-1 w-full bg-gray-300 rounded relative"
                                    >
                                      <div
                                        className="absolute h-1 bg-orange-600 rounded"
                                        style={{
                                          left: `${(values[0] / 20) * 100}%`,
                                          width: `${((values[1] - values[0]) / 20) * 100}%`,
                                        }}
                                      />
                                      {children}
                                    </div>
                                  )}
                                  renderThumb={({ props, index }) => (
                                    <div
                                      {...props}
                                      className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center shadow"
                                    />
                                  )}
                                />

                                {/* Min/Max Labels */}
                                <div className="flex justify-between items-center mt-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Label className="text-gray-600 text-sm">Min.</Label>
                                    <div className="flex items-center gap-1 border rounded px-2 py-1">
                                      {values[0].toString().padStart(2, "0")} yr
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 border rounded px-2 py-1 ">
                                      {values[1]} yr
                                    </div>
                                    <Label className="text-gray-600 text-sm">Max.</Label>
                                  </div>
                                </div>
                              </div>
                              <Select
                                onValueChange={(val) => setValue('productCondition', val)}
                              >
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder="Product Condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="like_new">Like New </SelectItem>
                                  <SelectItem value="good">Good</SelectItem>
                                  <SelectItem value="fair">Fair</SelectItem>
                                </SelectContent>
                              </Select>
                            </>

                          )
                        }


                      </>
                    )
                  }

                  {
                    productField === 'new_product' && currentCategoryName === "furniture" && (
                      <Select
                    value={conditionOfProductValue}
                    onValueChange={(value) => setValue("conditionOfProduct", value)}

                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Condition of Product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like_new">Like New </SelectItem>
                          <SelectItem value="excellent">Excellent </SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="for_parts_or_repair">For Parts Or Repair</SelectItem>
                          <SelectItem value="reburbished">Refurbished</SelectItem>
                          <SelectItem value="vintage">Vintage (Used)</SelectItem>
                          <SelectItem value="antique">Antique</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  }

                  {
                    currentCategoryName === "industrial" && (
                      <>
                        <Select
                         value={constructionToolTypeValue}
                      onValueChange={(value) => setValue("constructionToolType", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Construction Tool Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new_product">New Product</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                         value={toolTypeValue}
                      onValueChange={(value) => setValue("toolType", value)}
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Tool Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="industrial_tool">Industrial Tool</SelectItem>
                            <SelectItem value="machinery_tool">Machinery Type</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )
                  }

                </div>
              </div>


              <div className=" shadow-sm rounded-2xl p-6 border bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Other Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
                  <div
                    onClick={() => (imageRef as any).current?.click()}
                    className="border-2 border-dashed rounded-lg flex bg-white flex-col items-center justify-center p-6 cursor-pointer"
                  >
                    <Upload className="h-6 w-6 mb-2 text-gray-500" />
                    <span className="text-sm text-muted-foreground">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={imageRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setImage(e.target.files[0]);
                        }
                      }}
                    />
                    {image && (
                      <p className="text-xs mt-2 text-green-600">
                        {image.name}
                      </p>
                    )}
                  </div>
                  <div
                    onClick={() => (fileDocRef as any).current?.click()}
                    className="border-2 border-dashed rounded-lg bg-white flex flex-col items-center justify-center p-6 cursor-pointer"
                  >
                    <FileUp className="h-6 w-6 mb-2 text-gray-500" />
                    <span className="text-sm text-muted-foreground">
                      Browse From Device (doc/pdf)
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      ref={fileDocRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFileDoc(e.target.files[0]);
                        }
                      }}
                    />
                    {fileDoc && (
                      <p className="text-xs mt-2 text-green-600">
                        {fileDoc.name}
                      </p>
                    )}
                  </div>
                </div>
                <Textarea placeholder="Description*"  {...register("description")} className="bg-white min-h-24" />
              </div>


              <div className=" shadow-sm rounded-2xl p-6 border bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">
                  Payment & Delivery Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <DatePicker date={date}
                    title="Delivery Date"
                    disabledBeforeDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
                    setDate={(val) => {
                      if (val) {
                        setDate(val);
                        setValue("paymentAndDelivery.ex_deliveryDate", val as any);
                      }
                    }} />
                  <Select
                    value={paymentMode}
                    onValueChange={(value) => {
                      setValue('paymentAndDelivery.paymentMode', value)
                    }}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={gstField}
                    onValueChange={(value) => {
                      setValue('gst_requirement', value)
                    }}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="GST Input Required" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>

                  {
                    gstField === "yes" && (
                      <>
                        <Input type="text" placeholder="GST Number" {...register("paymentAndDelivery.gstNumber")} className="bg-white" />
                        <Input type="text" placeholder="Organization Name"  {...register("paymentAndDelivery.organizationName")} className="bg-white" />
                        <Input type="text" placeholder="Organization Address" {...register("paymentAndDelivery.organizationAddress")} className="bg-white" />
                      </>
                    )
                  }
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end  gap-3">
                <Button type="button" variant="outline" className="w-32 cursor-pointer">Save as Draft</Button>
                <Button type="submit" className=" text-white w-32 cursor-pointer">
                  {
                    loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Submit'
                  }
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Category;
