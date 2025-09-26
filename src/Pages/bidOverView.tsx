import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Outlet, useParams } from "react-router-dom";
import { Banknote, CalendarDays, Camera, House, List, MapPin, User, UserRound } from 'lucide-react';
import { Avatar, AvatarImage } from "@/Components/ui/avatar";
import { NavLink } from 'react-router-dom';

import { Spinner } from "@/Components/ui/shadcn-io/spinner";
import { Button } from "@/Components/ui/button";
import { SkeletonTable } from "@/const/CustomSkeletons";
import TableListing from "@/Components/TableLisiting";
import type { ColumnDef } from "@tanstack/react-table";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useFetch } from "@/helper/use-fetch";
import bidService from "@/services/bid.service";
import { useEffect, useState } from "react";
import { dateFormatter } from "@/helper/dateFormatter";
import { mergeName } from "@/helper/mergeName";
import { currencyConvertor } from "@/helper/currencyConvertor";
  const bidsData = [
    {
      id: 1,
      date: "2025-09-20",
      bid_by: "John Doe",
      budget: "₹25,000",
      bid_budget: "₹22,000",
    },
    {
      id: 2,
      date: "2025-09-21",
      bid_by: "Jane Smith",
      budget: "₹30,000",
      bid_budget: "₹27,500",
    },
    {
      id: 3,
      date: "2025-09-22",
      bid_by: "Ravi Kumar",
      budget: "₹20,000",
      bid_budget: "₹18,000",
    },
  ];
const BidOverview = () => {
  const {bidId} = useParams();
  const {fn:bidFn,data:bidRes} = useFetch(bidService.getBidById)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total,setTotal] = useState(0)
  const [sellers,setSellers] = useState<any>([])
  useEffect(()=>{
    
    bidFn(bidId,limit,page)
  },[bidId,limit,page])

const bidsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "avtar",
    header: "",
    cell: ({row}) => {
      console.log(row)
      return <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shubhamsharma20007.png" alt="@shadcn" className="h-full w-full rounded-full" />
          <AvatarFallback>{
            'SS'
            // fallBackName(row.original?.bid_to)
          }</AvatarFallback>
        </Avatar>

      </div>
    }
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "bid_by",
    header: "Bid By",
  },
 
  {
    accessorKey: "budget",
    header: "Budget",
  },
{
    accessorKey: "bid_budget",
    header: "Bid Budget",
  },

];

useEffect(()=>{
  if(bidRes){
      const {totalSellers: totalCount, limit: pageLimit,page } = bidRes;
       const budget = bidRes?.product?.budget || 0;
        bidRes?.sellers?.map((item:any)=>(
        setSellers([ {
        id: item?._id,
        date:dateFormatter(item?.createdAt),
        bid_by: mergeName(item?.seller),
        budget: currencyConvertor(budget),
        bid_budget: currencyConvertor(item?.budgetQuation),
      },])
      ))
      setTotal(totalCount)
      setLimit(pageLimit)
      setPage(page)
  } 
},[bidRes])
console.log(bidRes)

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-6 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem className="flex items-center gap-2 cursor-pointer">
            <BreadcrumbPage className="capitalize font-regular text-gray-500"><House className="w-5 h-5" /></BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-gray-500">Bid Overview</BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-orange-600 font-semibold">{bidRes?.product?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8">
        <div className="grid gap-8 md:grid-cols-[270px_1fr]">
          {/* Sidebar */}
          <div className="hidden md:block space-y-2 bg-gray-200/50 p-4 rounded-md sticky max-h-fit">
            <div className='flex justify-center items-center mt-2 mb-12 relative'>
              <div className='relative'>
                <Avatar className='w-28 h-28 border-gray-600 border-4 flex '>
                  {
                    false ?
                      <div className="h-full w-full  flex items-center justify-center object-contain">
                        <Spinner className="w-5 h-5 text-orange-500" />

                      </div> :
                      <AvatarImage src={bidRes?.product?.image|| '/no-image.webp'} className="w-full h-full object-contain rounded-full" />
                  }

                  {/* {
                  !updateProfileLoading && user?.profileImage && <AvatarFallback>{fallBackName(`${user?.firstName} ${user?.lastName}`)}</AvatarFallback>
                } */}
                </Avatar>
                {/* <input type="file" name="image" hidden id="" ref={avatarRef} onChange={handleUpdateProfile} /> */}
                {/* <button
                  // disabled={updateProfileLoading}
                  onClick={(e) => {
                    e.preventDefault()
                    // if(avatarRef){
                    //   avatarRef.current?.click()
                    // }
                  }} className="absolute bottom-4 cursor-pointer right-0 bg-gray-500 p-1 rounded-full shadow-md hover:bg-gray-400">
                  <Camera className='w-4 h-4 text-white' />
                </button> */}
              </div>
            </div>

            <div className="grid gap-1 text-gray-600 px-3 space-y-3 ">
              <p className="text-left   cursor-pointer text-sm rounded-md  text-gray-600 flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                <span>UserName</span>
              </p>
              <p className="text-left   cursor-pointer text-sm rounded-md  text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>City Name</span>
              </p>
              <p className="text-left   cursor-pointer text-sm rounded-md  text-gray-600 flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>5 units</span>
              </p>
              <p className="text-left   cursor-pointer text-sm rounded-md  text-gray-600 flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Delivery By: <span className="font-semibold pl-1">12-12-2025</span></span>
              </p>

              <p className="text-left   cursor-pointer text-sm rounded-md  text-gray-600 flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                <span>Budget: <span className="font-semibold pl-1">Rs 20,000</span></span>
              </p>

            </div>
            <Button variant="ghost" size="lg" className="border w-full mt-5 shadow-orange-500 border-orange-600 text-orange-600 rounded-[5px]  hover:bg-orange-500 hover:text-white cursor-pointer transition-all duration-300 ease-in-out underline-0">
              Add To Cart
            </Button>
          </div>

          {/* Main Content */}
          <div className="space-y-10">
            <section className="min-h-screen">
              <div className="grid space-y-2">
                <h2 className="text-sm font-[500] mb-2">
                  Date: {dateFormatter(bidRes?.createdAt)}
                </h2>
                <div className="flex justify-between items-center gap-10">
                  <h2 className="text-xl font-bold capitalize item-center">
                   {bidRes?.product?.title}
                  </h2>
                  <Button
                    variant={'ghost'} className=" float-end border rounded-full hover:bg-orange-700 hover:text-white text-sm bg-orange-700  text-white cursor-pointer">
                    24.00 Hr.
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2 ">
                 {bidRes?.product?.description}
                </p>
              </div>
              <div className="mt-10 ">
                 <p className="font-bold text-lg whitespace-nowrap   tracking-tight text-orange-700/90">
            Bids Placed
          </p>
          {/* table */}
          {
             false ? <SkeletonTable /> : <TableListing 
             data={sellers} 
             columns={bidsColumns} 
             filters={false} 
             colorPalette={'gray'}
                page={page}
                    setPage={setPage}
                    total={total}
                    limit={limit}
                   />
          }
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidOverview;
