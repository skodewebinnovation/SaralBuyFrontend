import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"

import { ListFilter, SquarePen, } from 'lucide-react';

import "keen-slider/keen-slider.min.css"

import RequirementSlider from './components/requirement-slide';
import { useState } from 'react';
const products = [
  {
    id: 1,
    image: 'https://media.istockphoto.com/id/1188462138/photo/variety-of-sport-accessories-on-wooden-surface.jpg?s=612x612&w=0&k=20&c=y2l7DYNkxbVteZy-Kx_adCzm-soTRbiEypje4j8ENe0=',
    category: 'Stationary',
    name: 'Children Books',
    deliveryDate: '10-10-2025',
    quantity: 10
  },
  {
    id: 2,
    image: 'https://media.istockphoto.com/id/1188462138/photo/variety-of-sport-accessories-on-wooden-surface.jpg?s=612x612&w=0&k=20&c=y2l7DYNkxbVteZy-Kx_adCzm-soTRbiEypje4j8ENe0=',
    category: 'Stationary',
    name: 'Children Books',
    deliveryDate: '10-10-2025',
    quantity: 10
  },
  {
    id: 3,
    image: 'https://media.istockphoto.com/id/1188462138/photo/variety-of-sport-accessories-on-wooden-surface.jpg?s=612x612&w=0&k=20&c=y2l7DYNkxbVteZy-Kx_adCzm-soTRbiEypje4j8ENe0=',
    category: 'Electronics',
    name: 'Digital Tablet',
    deliveryDate: '15-10-2025',
    quantity: 5
  },
  {
    id: 4,
    image: 'https://media.istockphoto.com/id/1188462138/photo/variety-of-sport-accessories-on-wooden-surface.jpg?s=612x612&w=0&k=20&c=y2l7DYNkxbVteZy-Kx_adCzm-soTRbiEypje4j8ENe0=',
    category: 'Sports',
    name: 'Sports Equipment',
    deliveryDate: '12-10-2025',
    quantity: 15
  }
];
const Requirement = () => {
  const [tab, setTab] = useState('requirements')




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

            {[1, 2, 3, 4].map((item, idx) => (
              <div key={idx} className='border border-gray-300 p-4 rounded-md w-full mb-2 relative'>
                <RequirementSlider products={products} tab={tab} target="requirement" />
              </div>
            ))}



          </TabsContent>

          <TabsContent value="drafts" className='w-full overflow-hidden '>

            {[1, 2, 3, 4].map((item, idx) => (
              <div key={idx} className='border border-gray-300 p-4 rounded-md w-full mb-2 relative'>

                <div className='absolute top-1 left-1 z-10 bg-orange-100 text-orange-400  rounded-md p-1 cursor-pointer'>
                  <SquarePen className='h-4 w-4 ' />
                </div>

{/*  this is for bids */}
                <RequirementSlider products={products} tab={tab}  target="bid"/>
              </div>
            ))}



          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Requirement