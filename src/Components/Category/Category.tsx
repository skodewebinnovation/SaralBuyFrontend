import React, { useEffect, useState } from "react";
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
import { useLocation } from "react-router-dom";
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
import { PlusIcon, Upload, FileUp, MoveLeft, ChevronDown, X, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import { DatePicker } from "../../utils/DatePicker";
import {toast} from "sonner"
import { Range } from "react-range";

import { CategoryFormchema } from "@/validations/Schema";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
const Category = () => {
  const location = useLocation();
  const path = location.pathname;
  const lastPart = path.substring(path.lastIndexOf("/") + 1);
  const [date,setDate] = useState<Date | undefined> (undefined)
  const [values, setValues] = useState([2, 10]);

  const {watch,handleSubmit,setValue,formState:{errors}} = useForm({
    resolver: zodResolver(CategoryFormchema) as any,
    defaultValues:{
      gst_requirement:'',
      product_type:''
    }
  })

  const gstField = watch("gst_requirement")
  const productField = watch("product_type")

  function onSubmit(data:any){
    console.log(data)
  }

  // {errors.bio && (
  //               <p className='text-sm text-red-500'>
  //                 {errors.bio.message?.toString()}
  //               </p>
  //             )}
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Breadcrumb + Action */}
      <div className="flex flex-row sm:justify-between justify-end items-center gap-3 mb-6">
        <Breadcrumb className="sm:block hidden">
          <BreadcrumbList >
            <BreadcrumbItem className="flex items-center gap-2">
              <MoveLeft className="h-4 w-4" />
               <BreadcrumbPage className="capitalize font-semibold  text-gray-500">
                Selected Product
              </BreadcrumbPage>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="capitalize font-semibold text-orange-600">
                {decodeURIComponent(lastPart) || ""}
              </BreadcrumbPage>
            </BreadcrumbItem>

          </BreadcrumbList>
        </Breadcrumb>

        <Button className="bg-orange-600 hover:bg-orange-500  text-white font-semibold rounded-md flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Responsive Layout */}
    <form  onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className=" md:col-span-1 lg:col-span-1 bg-white shadow-sm rounded-2xl p-6 border xs:grid xs:grid-cols-2 gap-6 ">
        <div className="col-span-1  align-center sm:block flex flex-col justify-center ">
              <h2 className="text-lg font-semibold mb-2">Tailor Your Experience</h2>
          <p className="text-sm text-muted-foreground">
            Please help us tailor the experience by filling out the form below.
            If this isn’t the category you meant to choose, you can go back and
            select another one.
          </p>
        </div>
            <div className="col-span-1 w-[80%] sm:w-full mx-auto">
                    <img src="../electronic.png" alt="" loading="lazy" />
            </div>
        </div>

    
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
     
          <div className=" shadow-sm rounded-2xl p-6 border ">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Input type="text" placeholder="Title*" className="col-span-3"  />
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer">Computer & Laptops</SelectItem>
                  <SelectItem value="tv">TVs and Screens</SelectItem>
                  <SelectItem value="mobile">Mobiles</SelectItem>
                </SelectContent>
              </Select>
              <Input type="text" placeholder="Quantity*" />
              <Input type="text" placeholder="Minimum Budget" />
             {
             ( productField === 'new_product' || productField === '')  &&(
                 <Select 
              value={productField}
              onValueChange={(value)=>{
                setValue('product_type',value)
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_product">New Product</SelectItem>
                  <SelectItem value="old_product">Old Product</SelectItem>
                </SelectContent>
              </Select>
              )
             }
     

              {
                productField === 'old_product' &&(
                  <>
                   <div className="w-full max-w-md border-[1.5px] border-gray-200 rounded-lg bg-white p-3">
     <div className="flex justify-between items-center mb-3">
       <Label className=" font-medium text-gray-500">Old Product</Label>
       <XIcon className="w-4 h-4 text-gray-400 cursor-pointer" onClick={()=>{
        setValue('product_type','new_product')
       }}/>
     </div>
      <Range
        values={values}
        step={1}
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
        <div  className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded px-2 py-1 ">
          {values[1]} yr
        </div>
        <Label className="text-gray-600 text-sm">Max.</Label>
        </div>
      </div>
    </div>
      <Select>
                <SelectTrigger className="w-full">
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
            </div>
          </div>

  
          <div className=" shadow-sm rounded-2xl p-6 border">
            <h3 className="text-lg font-semibold mb-4">Other Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:">
                <Upload className="h-6 w-6 mb-2 text-gray-500" />
                <span className="text-sm text-muted-foreground">Upload Image</span>
              </div>
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:">
                <FileUp className="h-6 w-6 mb-2 text-gray-500" />
                <span className="text-sm text-muted-foreground">
                  Browse From Device (doc/pdf)
                </span>
              </div>
            </div>
            <Textarea placeholder="Description*" />
          </div>


          <div className=" shadow-sm rounded-2xl p-6 border">
            <h3 className="text-lg font-semibold mb-4">
              Payment & Delivery Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <DatePicker date={date} setDate={setDate} />
              <Select >
                <SelectTrigger className="w-full">
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
              onValueChange={(value)=>{
                setValue('gst_requirement',value)
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="GST Input Required"   />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>

              {
                gstField === "yes" &&(
                 <>
                      <Input type="text" placeholder="GST Number" />
                     <Input type="text" placeholder="Organization Name" />
                             <Input type="text" placeholder="Organization Address" />
                 </>
                )
              }
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-4 gap-3">
            <Button type="button" variant="outline">Save as Draft</Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>
    </div>
  );
};

export default Category;
