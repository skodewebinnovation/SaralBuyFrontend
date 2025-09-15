import TableListing from '@/Components/TableLisiting'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/Components/ui/breadcrumb'
import { Button } from '@/Components/ui/button'
import SkeletonTable from '@/const/tableSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import type { ColumnDef } from '@tanstack/react-table'
import { Banknote, CalendarDays, MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const dummyData = [
  {
    avtar: "https://github.com/shubhamsharma20007.png",
    date: "2025-09-15",
    bid_buy: "Shubham Sharma",
    // product: "Web App Development",
    bid_amount: "₹25,000",
    chat_message: "Interested in more details?",
    action: "chat"
  },
  {
    avtar: "https://github.com/shubhamsharma20007.png",
    date: "2025-09-12",
    bid_buy: "Ravi Kumar",
    // product: "Mobile App",
    bid_amount: "₹30,000",
    chat_message: "Please contact ASAP.",
    action: "chat"
  },
  {
    avtar: "https://github.com/shubhamsharma20007.png",
    date: "2025-09-10",
    bid_buy: "Neha Verma",
    // product: "Landing Page Design",
    bid_amount: "₹12,000",
    chat_message: "Can deliver in 3 days.",
    action: "chat"
  },
]

const RequirementOverview = () => {
  const navigate = useNavigate()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "avtar",
      header: "",
      size: 60,
      cell: ({ row }) => {
        const image = row.original.avtar
        const name = row.original.bid_buy || "NA"
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()

        return (
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
            <Avatar className="w-10 h-10 ">
              <AvatarImage src={image} alt={name}  className='rounded-full'/>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        )
      }
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "bid_buy",
      header: "Bid By",
    },
    // {
    //   accessorKey: "product",
    //   header: "Product",
    // },
    {
      accessorKey: "bid_amount",
      header: "Bid Amount",
    },
    {
      accessorKey: "chat_message",
      header: "Chat Message",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: () => (
        <Button
          className="text-sm cursor-pointer text-orange-600 underline"
          variant="link"
        >
          Chat Now
        </Button>
      )
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto  space-y-6 ">
      <Breadcrumb className="sm:block hidden">
        <BreadcrumbList>
          <BreadcrumbItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
            <MoveLeft className="h-4 w-4" />
            <BreadcrumbPage className="capitalize font-semibold text-gray-500 text-[15px]">
              Requirement Detail's
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* image and details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Image */}
        <div className="lg:col-span-4 bg-gray-100 flex justify-center items-center rounded-lg p-4 max-h-44 ">
          <img
            src={'https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg'}
            alt="Product"
            className="object-contain h-full w-full"
          />
        </div>

        {/* Product Info */}
        <div className="lg:col-span-8 bg-white rounded-lg p-4 space-y-4">
          <h2 className="text-sm font-medium mb-2">
            Date : 12-2-2023
          </h2>

          <h2 className="text-xl font-bold capitalize">
            Looking for developer
          </h2>
          <p className="text-sm text-gray-600 line-clamp-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eum voluptatum a qui quisquam, non eaque deleniti doloremque beatae impedit.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4 pr-3 border-r-2 py-1 ">
              <div className='flex gap-1 items-center'>
                <Banknote className="w-5 h-5 " />
                <span className="capitalize">Your Budget:</span>
              </div>
              <span className='font-semibold'>Rs: 30,000</span>
            </div>
            <div className="flex items-center gap-2 ">
              <div className='flex gap-1 items-center'>
                <CalendarDays className="w-4 h-4 " />
                <span className="capitalize">Delivery By:</span>
              </div>
              <span className='font-semibold'>12-12-2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Listing */}
      <TableListing
        data={dummyData}
        columns={columns}
        filters={false}
        title="Available Bids"
        target="requirementOverview"
        colorPalette="orange"
      />
    </div>
  )
}

export default RequirementOverview
