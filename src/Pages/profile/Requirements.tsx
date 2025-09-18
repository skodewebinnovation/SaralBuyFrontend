import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"

import { ListFilter, SquarePen, } from 'lucide-react';

import "keen-slider/keen-slider.min.css"

import RequirementSlider from './components/requirement-slide';
import { useEffect, useState } from 'react';
import { useFetch } from '@/helper/use-fetch';
import productService from '@/services/product.service';
import bidService from '@/services/bid.service';
import { useNavigate } from 'react-router-dom';
import TooltipComp from '@/utils/TooltipComp';
import { SliderSkeleton } from '@/const/CustomSkeletons';

const Requirement = () => {
  const [tab, setTab] = useState('requirements')
  const {fn:getDrafts,data:getDraftsRes,loading:getDraftLoading} = useFetch(productService.getDrafts)
const [drafts,setDrafts] = useState<any>([])
const navigate = useNavigate()
const [requirements, setRequirements] = useState<any>([
  {
    _id: '1',
    image: '/no-image.webp',
    category: 'Stationary',
    name: 'Children Books',
    ex_deliveryDate: '2025-10-10',
    quantity: 10,
  },
  {
    _id: '2',
       image: '/no-image.webp',
    category: 'Electronics',
    name: 'Wireless Headphones',
    ex_deliveryDate: '2025-11-15',
    quantity: 25,
  },
  {
    _id: '3',
      image: '/no-image.webp',
    category: 'Furniture',
    name: 'Office Chairs',
    ex_deliveryDate: '2025-09-25',
    quantity: 50,
  },
])

  useEffect(()=>{
    if(tab === 'requirements'){

    }else{
      getDrafts()

    }
  },[tab])


 useEffect(() => {
    if (getDraftsRes && getDraftsRes?.length > 0) {
     setDrafts(getDraftsRes)
    }
  }, [getDraftsRes]);


  console.log(getDraftsRes)



    useEffect(() => {
    bidService.getMyRequirements().then(res => {
      console.log("My Requirements:", res);
    }).catch(err => {
      console.error("Failed to fetch my requirements", err);
    })})


  return (
    <div className="w-full max-w-7xl mx-auto  space-y-6 px-4">
      <div className='grid space-y-5 w-full'>
        <div className='flex justify-between items-center font-semibold w-full'>
          <p className="font-bold text-3xl whitespace-nowrap sm:text-2xl border-l-4  border-gray-600 pl-3 tracking-tight text-gray-600">
            Requirements
          </p>
          <Button variant={'ghost'} size={'icon'} className=' w-24 flex gap-2 items-center justify-center text-sm font-medium rounded-md text-gray-700 bg-transparent border-1 hover:bg-transparent cursor-pointer border-gray-700'>
            Date
            <ListFilter className='w-5 h-5' />
          </Button>
        </div>

        {/* tabs */}
        <Tabs defaultValue="requirements" className='grid space-y-2 w-full overflow-hidden' onValueChange={(val) => setTab(val)} >
          <TabsList className='bg-orange-50 '>
            <TabsTrigger value="requirements" className=' cursor-pointer min-w-32'>Requirements</TabsTrigger>
            <TabsTrigger value="drafts" className='cursor-pointer min-w-32'>Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className='w-full overflow-hidden '>

            {requirements.map((item:any, idx:number) => (
              <div key={idx} className='border border-gray-200 p-4 rounded-md w-full mb-2 relative'>
                <RequirementSlider product={item} tab={tab} target="requirement" />
              </div>
            ))}



          </TabsContent>

        <TabsContent value="drafts" className='w-full overflow-hidden'>
                
                {
                  getDraftLoading ?
                new Array(3).fill(0).map(_=><SliderSkeleton/>) :
                  drafts.length > 0 && drafts.map((item: any, idx: number) => (
    <div key={idx} className='border border-gray-200 p-4 rounded-md w-full mb-2 relative'>
      <div className='absolute top-1 left-1 z-10 bg-orange-100 text-orange-400 rounded-md p-1 cursor-pointer'
      onClick={()=>{
        navigate('/update-draft/'+item._id)
      }}
      >
       <TooltipComp
       hoverChildren={ <SquarePen className='h-5 w-5' />}
       contentChildren={<p>Edit Draft</p>}
       ></TooltipComp>
      </div>

      <RequirementSlider product={item} tab={tab} target="bid" />
    </div>
  ))
                }
  
</TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

export default Requirement