import BidingComponent from '@/Components/TableLisiting'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { dateFormatter } from '@/helper/dateFormatter';
import { fallBackName } from '@/helper/fallBackName';
import { useFetch } from '@/helper/use-fetch';
import bidService from '@/services/bid.service';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {SkeletonTable} from '@/const/CustomSkeletons';
import TableListing from '@/Components/TableLisiting';
import { getUserProfile } from '@/zustand/userProfile';

const BidListing = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    let { user } = getUserProfile();
    const { fn: fetchBidsFn, data: fetchBidsResponse,loading:bidLoading } = useFetch(bidService.getAllBids)
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "avtar",
            header: "",
            cell: ({ row }) => {
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
            accessorKey: "product",
            header: "Product",
        },
        {
            accessorKey: "min_budget",
            header: "Min. Budget",
        },
        {
            accessorKey: "your_budget",
            header: "Budget",
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
            cell: ({ row }) => {
                console.log(row,21)
                return <div className="flex items-center gap-2">
                    <Button className="text-sm cursor-pointer text-gray-600 underline" variant={"link"} onClick={() => {
                        navigate('/product-overview?bidId=' + row.original?._id);
                    }}>View</Button>
                    <p onClick={()=>navigate('/chat', { 
                        state: { 
                            productId: row.original?.productId,
                            productBuyerId:row.original?.productBuyerId,
        sellerId: user._id
      } 
    })}>Chat now</p>
                    <div className="hover:bg-red-100 p-1 rounded-md ease-in-out transition-all duration-300">
                        <Trash2Icon className="h-4 w-4  text-red-500 cursor-pointer" />
                    </div>
                </div>
            }
        },
    ];
    useEffect(() => {
        fetchBidsFn()
    }, [])

    useEffect(() => {
        if (fetchBidsResponse && fetchBidsResponse.length > 0) {
            const formattedData = fetchBidsResponse.map((item: any) => ({
                _id: item._id,
                date: dateFormatter(item.createdAt),
                // bid_to: mergeName(item.buyer),
                product: item.product.title,
                productId: item.product._id,
                productBuyerId:item.product.userId,
                min_budget: item?.product?.minimumBudget,
                your_budget: item?.budgetQuation,
                status: item?.status || "active",
            }));
            setData(formattedData);
        }
    }, [fetchBidsResponse]);

    return (
       <>
       {
        bidLoading ? <SkeletonTable/> : <TableListing data={data} columns={columns} filters={true}  title='Your Bids' colorPalette={'gray'} />
       }
       </>
    )
}

export default BidListing