import React from 'react'
import { Button } from '../ui/button'
import { ListFilter } from 'lucide-react'

const Notification = () => {
  return (
    <div className='grid space-y-5'>
      <div className={`flex justify-between  gap-4 items-center`}>
        <p className="font-bold text-3xl whitespace-nowrap sm:text-2xl text-gray-600 border-l-4 border-gray-600 pl-3 tracking-tight">
          Notifications
        </p>
        <Button variant={'ghost'} size={'icon'} className=' w-24 flex gap-2 items-center justify-center text-sm font-medium rounded-md text-gray-700 bg-transparent border-1 hover:bg-transparent cursor-pointer border-gray-700'>
          Sort By
          <ListFilter className='w-5 h-5' />
        </Button>

      </div>
      {/* notification's */}
      {[1, 2, 3, 4].map((_, idx: number) =>(
         <div>
          <div className={`p-4 grid  ${idx % 2 === 0 ? 'bg-orange-50' : 'bg-white'} rounded-md space-y-2`}>
        <div className='grid grid-cols-3 items-center gap-5'>
          <p className='text-md font-bold text-gray-800 capitalize col-span-2'>
            New Bid Recevied
          </p>
          <p className='text-sm text-orange-500 col-span-1 text-right'>
            01-01-2025
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-5">
          <p className="text-sm font-medium text-gray-600 line-clamp-1 col-span-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem rerum quia, excepturi beatae vero perspiciatis unde doloremque delectus ipsam quibusdam et placeat aliquid vel inventore maxime tempora qui voluptatibus, amet saepe eaque atque quo omnis? Laudantium illum saepe dolores voluptatem quasi nam eos. Distinctio saepe, deserunt officiis ipsa iusto eveniet.
          </p>
          <p className="text-sm text-gray-600 col-span-1 text-right underline cursor-pointer">
            View
          </p>
        </div>
    
      </div>
      <div className='border-b-2 pt-2 mx-[0.5px]'></div>
         </div>
      )
      )
      }
    </div>
  )
}

export default Notification