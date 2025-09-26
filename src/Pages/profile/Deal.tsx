
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"


import "keen-slider/keen-slider.min.css"


import { SkeletonTable } from '@/const/CustomSkeletons';
import TableListing from '@/Components/TableLisiting';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import bidService from "@/services/bid.service";
import requirementService from "@/services/requirement.service";
import { useFetch } from "@/helper/use-fetch";
import { dateFormatter } from "@/helper/dateFormatter";
import { mergeName } from "@/helper/mergeName";



const columnsCompletedReq: ColumnDef<any>[] = [
  {
    accessorKey: "avtar",
    header: "",
    cell: ({row}) => {
      return  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
        <Avatar className="w-10 h-10">
          <AvatarImage src={row.original.avatar} className='object-cover rounded-full w-full h-full' />
          <AvatarFallback>PI</AvatarFallback>
        </Avatar>

      </div>
    }
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "finalized_with",
    header: "Finalized With",
  },
  {
    accessorKey: "product_categories",
    header: "Product Category",
  },
  {
    accessorKey: "your_budget",
    header: "Budget",
  },
  {
    accessorKey: "final_budget",
    header: "Final Budget",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      return <div className="flex items-center gap-2">
        <Button className="text-sm cursor-pointer text-gray-600 underline" variant={"link"} onClick={() => {
          // navigate('/product-overview?bidId=' + row.original?._id);
        }}>View</Button>

      </div>
    }
  },
];

const columnsApproveBids: ColumnDef<any>[] = [
  {
    accessorKey: "avtar",
    header: "",
    cell: ({row}) => {
      console.log(row)
      return <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
        <Avatar className="w-12 h-12">
          <AvatarImage src={row.original.avatar} alt="@shadcn" className="h-full w-full rounded-full object-contain" />
          <AvatarFallback>PI</AvatarFallback>
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
    accessorKey: "product_categories",
    header: "Product Category",
  },
  {
    accessorKey: "min_budget",
    header: "Min Budget",
  },
  {
    accessorKey: "your_budget",
    header: "Budget",
  },

  {
    accessorKey: "action",
    header: "Action",
    cell: () => {
      return <div className="flex items-center gap-2">
        <Button className="text-sm cursor-pointer text-gray-600 underline" variant={"link"} onClick={() => {
          // navigate('/product-overview?bidId=' + row.original?._id);
        }}>View</Button>

      </div>
    }
  },
];

const Deal = () => {
  const [tab, setTab] = useState('approved_bids')
  const { fn: pendingApprovedFn, data: pendingApprovedData } = useFetch(requirementService.getApprovedPendingRequirements)
  const { fn: completedApproveFn, data: completedApproveData } = useFetch(requirementService.getCompletedApprovedRequirements)
  const [completeRequirements, setCompleteRequirements] = useState<any>([])
  const [approvedRequirements,setApprovedRequirements]= useState<any>([])
  useEffect(() => {
    if (tab === 'approved_bids') {
      pendingApprovedFn()
    } else {
      completedApproveFn()
    }
  }, [tab])

  useEffect(() => {
    if (completedApproveData) {
      if (completedApproveData.length > 0) {
        completedApproveData.map((item: any) => (
          setCompleteRequirements([{
            _id: item._id,
            avatar: item?.product?.image,
            date: dateFormatter(item?.createdAt),
            finalized_with: mergeName(item?.seller),       
            product_categories: item?.product?.title,      
            your_budget: item?.product?.budget,
            final_budget: item?.finalBudget,
          },])
        ))

      }
    }
    if(pendingApprovedData){
      if (pendingApprovedData.length > 0) {
      pendingApprovedData.map((item:any)=>(
        setApprovedRequirements([
          {
            _id: item._id,
            avatar: item?.product?.image,
            bid_to:mergeName(item?.sellerDetails?.sellerId),
            date: dateFormatter(item?.date),
            product_categories: item?.product?.categoryId?.categoryName,
            min_budget:item?.minBudget,
            your_budget:item?.sellerDetails?.budgetAmount

          }
        ])
      ))
    }
  }
  }, [pendingApprovedData, completedApproveData])


  return (
    <div className="w-full max-w-7xl mx-auto  space-y-6 ">
      <div className='grid space-y-5 w-full'>
        <div className='flex justify-between items-center font-semibold w-full'>
          <p className="font-bold text-xl whitespace-nowrap   tracking-tight text-gray-600">
            Your Deals
          </p>
        </div>

        {/* tabs */}
        <Tabs defaultValue="approved_bids" className='grid space-y-2 w-full overflow-hidden' onValueChange={(val) => setTab(val)} >
          <TabsList className='bg-orange-50'>
            <TabsTrigger value="approved_bids" className={`cursor-pointer min-w-40 ${tab === 'approved_bids' && 'text-orange-500'}`}>Approved Bids</TabsTrigger>
            <TabsTrigger value="completed_requirements" className={`cursor-pointer ${tab === 'completed_requirements' && 'text-orange-500'} `}>Completed Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="approved_bids" className='w-full overflow-hidden '>

            {
              false ? <SkeletonTable /> : <TableListing data={approvedRequirements} columns={columnsApproveBids} filters={true} colorPalette={'gray'} />
            }
          </TabsContent>

          <TabsContent value="completed_requirements" className='w-full overflow-hidden'>
            {
              false ? <SkeletonTable /> : <TableListing data={completeRequirements} columns={columnsCompletedReq} filters={true} colorPalette={'gray'} />
            }
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

export default Deal