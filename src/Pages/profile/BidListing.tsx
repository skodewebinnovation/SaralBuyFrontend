
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
import { SkeletonTable } from '@/const/CustomSkeletons';
import TableListing from '@/Components/TableLisiting';
import { useDebounce } from 'use-debounce';

const BidListing = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const { fn: fetchBidsFn, data: fetchBidsResponse, loading: bidLoading } = useFetch(bidService.getAllBids)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
      const [value,{isPending}] = useDebounce(search, 600);
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "avtar",
            header: "",
            cell: ({ row }) => {
                console.log()
                return <div className=" ">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={row.original.avatar} alt="@shadcn" className='object-contain w-full h-full' />
                        <AvatarFallback>{fallBackName(row.original?.product)}</AvatarFallback>
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
                return <div className="flex items-center gap-2">
                    <Button className="text-sm cursor-pointer text-gray-600 underline" variant={"link"} onClick={() => {
                        navigate('/bid-overview/' + row.original?._id);
                    }}>View</Button>
                    {/* <p onClick={() => {
                        // Store chat IDs in localStorage for persistence across refresh
                        localStorage.setItem('chatIds', JSON.stringify({
                            productId: row.original?.productId,
                            buyerId: row.original?.productBuyerId,
                            sellerId: user._id
                        }));
                        navigate('/chat', {
                            state: {
                                productId: row.original?.productId,
                                buyerId: row.original?.productBuyerId,
                                sellerId: user._id
                            }
                        });
                    }}>Chat now</p> */}
                    <div className="hover:bg-red-100 p-1 rounded-md ease-in-out transition-all duration-300">
                        <Trash2Icon className="h-4 w-4  text-red-500 cursor-pointer" />
                    </div>
                </div>
            }
        },
    ];
    useEffect(() => { fetchBidsFn(limit, page, value) }, [limit, page, value])

    useEffect(() => {
        if (fetchBidsResponse) {
            const { bids, total: totalCount, limit: pageLimit } = fetchBidsResponse;

            const formattedData = bids.map((item: any) => {
                let mainProductId = item.product?.product?._id || item.product?._id;
                let mainProductBuyerId = item.product?.product?.userId || item.product?.userId;
                return {
                    _id: item._id,
                    date: dateFormatter(item.createdAt),
                    avatar:item?.product?.image,
                    product: item.product.title,
                    productId: mainProductId,
                    productBuyerId: mainProductBuyerId,
                    min_budget: item?.product?.minimumBudget,
                    your_budget: item?.budgetQuation,
                    status: item?.status || "active",
                };
            });

            setData(formattedData);
            setTotal(totalCount);
            setLimit(pageLimit);
        }
    }, [fetchBidsResponse]);



    return (
        <>
            {
                (bidLoading && !fetchBidsResponse) ? <SkeletonTable /> : <TableListing
                    data={data}
                    columns={columns}
                    filters={true}
                    title="Your Bids"
                    colorPalette="gray"
                    page={page}
                    setPage={setPage}
                    total={total}
                    limit={limit}
                    setSearch={setSearch}
                    search={search}
                    isPending={isPending}
                />

            }
        </>
    )
}

export default BidListing