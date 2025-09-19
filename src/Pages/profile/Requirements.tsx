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
  const { fn: getDrafts, data: getDraftsRes, loading: getDraftLoading } = useFetch(productService.getDrafts)
  const { fn: getMyRequirements, data: getMyRequirementsRes, loading: getMyRequirementsLoading } = useFetch(bidService.getMyRequirements)
  const [drafts, setDrafts] = useState<any>([])
  const [requirements, setRequirements] = useState<any>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (tab === 'requirements') {
    getMyRequirements()
    } else {
      getDrafts()
    }
  }, [tab])


  useEffect(() => {
    if (getDraftsRes && getDraftsRes?.length > 0) {
      setDrafts(getDraftsRes)
    }
  }, [getDraftsRes]);

    useEffect(() => {
    if (getMyRequirementsRes && getMyRequirementsRes?.length > 0) {
      setRequirements(getMyRequirementsRes)
    }
  }, [getMyRequirementsRes]);

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

            {/* {requirements.map((item: any, idx: number) => (
              <div key={idx} className='border border-gray-200 p-4 rounded-md w-full mb-2 relative'>
                <RequirementSlider product={item} tab={tab} target="requirement" />
              </div>
            ))} */}


               {
              getMyRequirementsLoading ?
                new Array(3).fill(0).map(_ => <SliderSkeleton />) :
                requirements.length > 0 ? requirements.map((item: any, idx: number) => (
                  <div key={idx} className='border border-gray-200 p-4 rounded-md w-full mb-2 relative'>

                <RequirementSlider product={item} tab={tab} target="requirement" />
                  </div>
                )) : <div className='w-full h-[300px]  flex flex-col items-center justify-center'>
                    <img src="/observed.svg" width="10%" />
                    <p className="text-gray-500 text-sm">No Requirement's Found</p>
                </div>
            }



          </TabsContent>

          <TabsContent value="drafts" className='w-full overflow-hidden'>

            {
              getDraftLoading ?
                new Array(3).fill(0).map(_ => <SliderSkeleton />) :
                drafts.length > 0 ? drafts.map((item: any, idx: number) => (
                  <div key={idx} className='border border-gray-200 p-4 rounded-md w-full mb-2 relative'>
                    <div className='absolute top-1 left-1 z-10 bg-orange-100 text-orange-400 rounded-xl p-1 cursor-pointer'
                      onClick={() => {
                        navigate('/update-draft/' + item._id)
                      }}
                    >
                      <TooltipComp
                        hoverChildren={<SquarePen className='h-4 w-4' />}
                        contentChildren={<p>Edit Draft</p>}
                      ></TooltipComp>
                    </div>

                    <RequirementSlider product={item} tab={tab} target="bid" />
                  </div>
                )) : <div className='w-full h-[300px]  flex flex-col items-center justify-center'>
                    <img src="/observed.svg" width="10%" />
                    <p className="text-gray-500 text-sm">No Bid's Found</p>
                </div>
            }

          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

export default Requirement