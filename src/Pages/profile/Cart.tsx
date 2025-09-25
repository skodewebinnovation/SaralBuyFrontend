import { Button } from '@/Components/ui/button'
import { SliderSkeleton } from '@/const/CustomSkeletons'
import TooltipComp from '@/utils/TooltipComp'
import { ListFilter, SquarePen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RequirementSlider from './components/requirement-slide'
import { useEffect } from 'react'
import cartService from '@/services/cart.service'
import { useFetch } from '@/helper/use-fetch'


export const dummyProducts = [
  {
    _id: "p1",
    title: "Organic Face Cream",
    description: "A hydrating cream with natural extracts.",
    quantity: 10,
    image: "https://picsum.photos/200/200?random=1",
    brand: "GlowCare",
    draft: true,
    createdAt: "2025-09-18T10:30:00.000Z",
    updatedAt: "2025-09-18T10:30:00.000Z",
    totalBidCount: 5,
    categoryId: {
      _id: "c1",
      categoryName: "Beauty",
      image: "https://picsum.photos/100/100?random=2",
      updatedAt: "2025-09-13T12:21:54.261Z",
    },
    subCategoryId: "sc1",
    userId: "u1",
    paymentAndDelivery: {
      ex_deliveryDate: "2025-09-24T18:30:00.000Z",
      paymentMode: "Online",
      gstNumber: "GST123456",
      organizationName: "GlowCare Pvt Ltd",
      organizationAddress: "123 Beauty Lane, Delhi",
    },
    subProducts: [
      {
        _id: "sp1",
        title: "Organic Face Cream - Mini Pack",
        description: "Travel size cream, 30ml.",
        quantity: 50,
        image: "https://picsum.photos/200/200?random=3",
        brand: "GlowCare",
        createdAt: "2025-09-18T11:00:00.000Z",
        updatedAt: "2025-09-18T11:00:00.000Z",
        draft: true,
        categoryId: {
          _id: "c1",
          categoryName: "Beauty",
          image: "https://picsum.photos/100/100?random=4",
          updatedAt: "2025-09-13T12:21:54.261Z",
        },
        subCategoryId: "sc1",
        userId: "u1",
        paymentAndDelivery: {
          ex_deliveryDate: "2025-09-26T18:30:00.000Z",
          paymentMode: "Cash on Delivery",
          gstNumber: "GST654321",
          organizationName: "GlowCare Pvt Ltd",
          organizationAddress: "123 Beauty Lane, Delhi",
        },
        totalBidCount: 2,
      },
    ],
  },
  {
    _id: "p2",
    title: "Herbal Shampoo",
    description: "Shampoo enriched with aloe vera and neem.",
    quantity: 20,
    image: "https://picsum.photos/200/200?random=5",
    brand: "NatureWash",
    draft: false,
    createdAt: "2025-09-15T09:15:00.000Z",
    updatedAt: "2025-09-15T09:15:00.000Z",
    totalBidCount: 3,
    categoryId: {
      _id: "c2",
      categoryName: "Hair Care",
      image: "https://picsum.photos/100/100?random=6",
      updatedAt: "2025-09-13T12:21:54.261Z",
    },
    subCategoryId: "sc2",
    userId: "u2",
    paymentAndDelivery: {
      ex_deliveryDate: "2025-09-28T18:30:00.000Z",
      paymentMode: "Bank Transfer",
      gstNumber: "GST987654",
      organizationName: "NatureWash Ltd",
      organizationAddress: "45 Green Street, Mumbai",
    },
    subProducts: [],
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const {fn:getCartFn,data:getCartRes,loading:getCartLoading} = useFetch(cartService.getCart)
useEffect(()=>{
  getCartFn()
},[])
  return (
     <div className="w-full max-w-7xl mx-auto  space-y-6 ">
      <div className='grid space-y-5 w-full'>
        <div className='flex justify-between items-center font-semibold w-full'>
          <p className="font-bold text-xl whitespace-nowrap   tracking-tight text-gray-600">
           Your Cart
          </p>
          <Button variant={'ghost'} size={'icon'} className=' w-24 flex gap-2 items-center justify-center text-sm font-medium  text-gray-700 bg-transparent border-1 hover:bg-transparent cursor-pointer border-gray-700'>
            Date
            <ListFilter className='w-5 h-5' />
          </Button>
        </div>
        {/*  cart list */}
         {
              getCartLoading ?
                new Array(3).fill(0).map(_ => <SliderSkeleton />) :
            getCartRes &&    getCartRes.length > 0 ? getCartRes.map((item: any, idx: number) => (
                  <div key={idx} className='border-2 border-gray-300 p-4 rounded-md w-full mb-2 relative'>
                    <div className='absolute top-1 left-1 z-10 bg-orange-50 text-orange-400 rounded-sm  p-1 cursor-pointer'
                      // onClick={() => {
                      //   navigate('/update-draft/' + item._id)
                      // }}
                    >
                      <TooltipComp
                        hoverChildren={<SquarePen className='h-4 w-4' />}
                        contentChildren={<p>Edit Cart</p>}
                      ></TooltipComp>
                    </div>

                    <RequirementSlider product={item} target="carts" />
                  </div>
                )) : <div className='w-full h-[300px]  flex flex-col items-center justify-center'>
                    <img src="/observed.svg" width="10%" />
                    <p className="text-gray-500 text-sm">No Cart's Found</p>
                </div>
            }
       
      </div>
    </div>
  )
}

export default Cart