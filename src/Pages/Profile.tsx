import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../Components/ui/breadcrumb";
import { SquarePen, Trash, Trash2, Trash2Icon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";
import { useEffect, useState, type JSX } from 'react';
import { AccountSettings } from "@/Components/Profile/account-setting";
import BidingComponent from "@/Components/Profile/bid-component";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../Components/ui/badge"
import { Button } from "../Components/ui/button";
import { useFetch } from "@/helper/use-fetch";
import bidService from "@/services/bid.service";
import { toast } from "sonner";
import { dateFormatter } from "@/helper/dateFormatter";
import { mergeName } from "@/helper/mergeName";
import { fallBackName } from "@/helper/fallBackName";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "avtar",
    header: "",
    cell:({row})=>{
      return <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shubhamsharma20007.png" alt="@shadcn" />
          <AvatarFallback>{fallBackName(row.original?.bid_to)}</AvatarFallback>
        </Avatar>
        
      </div>
    }
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "bid_to",
    header: "Bid To",
  },
  {
    accessorKey: "min_budget",
    header: "Min. Budget",
  },
  {
    accessorKey: "your_budget",
    header: "Your Budget",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status === 'inactive') {
        return <Badge className="bg-red-100 text-red-500 rounded-full px-2 w-20">Inactive</Badge>
      } else {
        return <Badge className="bg-green-100 text-green-500 rounded-full capitalize px-3 w-20">Active</Badge>
      }
    }
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({row}) => {
      return <div className="flex items-center gap-2">
        <Button className="text-sm cursor-pointer text-gray-600 underline" variant={"link"} onClick={()=>{
          alert(row.original?._id)
        }}>View</Button>
        <div className="hover:bg-red-100 p-1 rounded-md ease-in-out transition-all duration-300">
          <Trash2Icon className="h-4 w-4  text-red-500 cursor-pointer" />
        </div>
      </div>
    }
  },
];






const tags = [
  {
    title: 'Profile',
    value: 'profile'
  },
  {
    title: "Your Biding",
    value: 'your_biding'
  }, {
    title: "Account Setting",
    value: 'account_setting'
  }, {
    title: "Address",
    value: 'address'
  }, {
    title: 'Payment',
    value: 'payment'
  },
  {
    title: 'Notification',
    value: 'notification'
  }
]

const Profile = () => {
  const [currentComp, setCurrentComp] = useState('profile');
  const { fn: fetchBidsFn, data: fetchBidsResponse } = useFetch(bidService.getAllBids)
  const [data, setData] = useState([])

  useEffect(() => {
    if (currentComp === "your_biding") {
      fetchBidsFn()
    }
  }, [currentComp])

  const componentMap: Record<string, JSX.Element> = {
    profile: <AccountSettings />,
    your_biding: <BidingComponent data={data} columns={columns} />,
  };


useEffect(() => {
  if (fetchBidsResponse && fetchBidsResponse.length > 0) {
    const formattedData = fetchBidsResponse.map((item: any) => ({
      _id: item._id,
      date: dateFormatter(item.createdAt),
      bid_to: mergeName(item.buyer),
      min_budget: item?.product?.minimumBudget,
      your_budget: item?.budgetQuation,
      status: item?.status || "active",
    }));
    setData(formattedData);
  }
}, [fetchBidsResponse]);


  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-6 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          <BreadcrumbItem className="flex items-center gap-2 cursor-pointer">
            <BreadcrumbPage className="capitalize font-regular text-gray-500">Home</BreadcrumbPage>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="capitalize font-regular text-orange-600">Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="hidden md:block space-y-2 bg-gray-50 p-4">
            <div className='flex justify-center items-center mt-2 mb-5 relative'>
              <div className='relative'>
                <Avatar className='w-28 h-28 ring-orange-200 ring-2'>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/108955538?v=4" />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 cursor-pointer right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
                  <SquarePen className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="grid gap-1 text-gray-600 ">
              {
                tags.map((tag) => <button key={tag.title} onClick={() => setCurrentComp(tag.value)} className={`text-left px-3 py-2 cursor-pointer text-sm rounded-md hover:bg-muted ${tag.value === currentComp ? 'bg-muted' : ''}`}>
                  {tag.title}
                </button>)
              }

            </nav>
          </div>

          {/* Main Content */}
          <div className="space-y-10">
            <section id="account" className="min-h-screen">
              {componentMap[currentComp] || <p>Component not found.</p>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
