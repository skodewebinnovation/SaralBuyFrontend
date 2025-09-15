import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { CircleChevronLeft, CircleChevronRight, MoveRight } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import ProductCard from './product-card';
import { useNavigate } from 'react-router-dom';

function Arrow({ disabled, left, onClick }: {
  disabled: boolean
  left?: boolean
  onClick: (e: any) => void
}) {
  const disabledClass = disabled
    ? " opacity-50 cursor-not-allowed"
    : " cursor-pointer hover:text-gray-700";

  return (
    <div className={`absolute top-1/2 transform -translate-y-1/2 z-10 ${left ? 'left-2' : 'right-2'}`}>
      {left ? (
        <CircleChevronLeft
          onClick={disabled ? undefined : onClick}
          className={`h-7 w-7 text-gray-600 bg-white rounded-full shadow-md ${disabledClass}`}
        />
      ) : (
        <CircleChevronRight
          onClick={disabled ? undefined : onClick}
          className={`h-7 w-7 text-gray-600 bg-white rounded-full shadow-md ${disabledClass}`}
        />
      )}
    </div>
  );
}

const RequirementSlider = ({ products,tab,target }: { products: any[],tab?:string,target:string}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate()
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 2,
      spacing: 12,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const handleNavigate =(id:string)=>{
    if(target === 'bid'){
      // fallback
    }else{
      navigate('/account/requirements/'+id)
    }
  }

  return (
    <div className='flex justify-between items-center gap-4 w-full'>
      <div ref={sliderRef} className="keen-slider w-full max-w-4xl relative">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide cursor-pointer"
          onClick={()=>{
            handleNavigate(product.id)
          }}
          >
            <ProductCard product={product} />
          </div>
        ))}

        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              disabled={currentSlide === 0}
            />
            <Arrow
              onClick={(e: any) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
            />
          </>
        )}
      </div>

      {/* Right Side Info */}
      <div className='flex-1 flex justify-between items-end flex-col space-y-6'>
        <p className="text-sm text-gray-600 font-medium whitespace-nowrap">Dated: 10-10-2025</p>
        <div>
       {
        tab && ( 
            tab ==="requirements" ?
             <Button size={'default'} className='cursor-pointer text-xs'>
            Total Bids: <span className='font-bold'>10</span>
            <MoveRight className='w-5 h-5' />
          </Button>
          :
           <Button size={'default'} className='cursor-pointer text-xs'>
            Submit Draft
          </Button>

          )
       }
         
        </div>
      </div>
    </div>
  );
};

export default RequirementSlider;
