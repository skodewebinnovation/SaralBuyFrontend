
import { Card } from "./ui/card";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
type Props = {
  title: string,
  color: string,
  target: string,
  data:any[]
}

const SwiperSlider = ({ title, color, target,data }: Props) => {
  console.log(data,7)
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: "free-snap",
    slides: {
      perView: 1.2,
      spacing: 15,
    },
  })
  const navigate = useNavigate()



  return (
    <Card className={`shadow-none  p-5 ${target === "bids" ?`bg-${color}-100` :`bg-${color}-50`}`}>
      {/* Header */}
      <div className="flex justify-between items-center ">
        <p className={`font-bold text-2xl border-l-4 border-${color}-700 pl-3 tracking-tight text-${color}-700`}>
          {title}
        </p>
        <button 
        disabled={!data.length }
        className={`text-md text-${color}-700 hover:underline  font-semibold  ${!data.length ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={()=>{  
          target === 'bids' ? navigate('/account/bid') : navigate('/account/requirements')
        }}>
          See All
        </button>
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider  ">
        {data.length > 0?
         data.map((item) => (
          <div key={item._id}  className="keen-slider__slide ">
            <Card className="flex flex-row items-center justify-around gap-4 p-4   border border-gray-200">
              {/* Image */}
              <div className="h-24 w-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between">
                <div className="grid space-y-1">
                  <p className="text-sm text-gray-500 mb-1">
                    Dated: {item.date}
                  </p>
                  <p className="cc">
                    {item.category}
                  </p>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    Deliver by:{" "}
                    <span className="font-bold">{item.deliveryDate}</span>
                  </p>
                </div>


              </div>
              {/* Footer */}
              <div className="flex flex-col h-full justify-between " style={{ height: '-webkit-fill-available' }}>
                {
                  target !== 'drafts' ? <p className="text-sm border rounded px-2 py-1 bg-gray-50">
                  Total Bids:{" "}
                  <span className="font-semibold text-orange-600">
                    {item.totalBids}
                  </span>
                </p>: <div>

                </div>
                }
                <div className="flex gap-1 items-center justify-end">
                  <a
                  href="#"
                  className={`text-sm text-gray-600 font-semibold hover:underline  text-right underline`}
                >
                  View {target === 'drafts' && 'Bids'}
                </a>
                <MoveRight className="h-4 w-4"/>
                </div>
              </div>
            </Card>
          </div>
        ))
      :
        <div className="h-full w-full flex-col flex justify-center items-center">
           <img src="/observed.svg" width="20%" />
           <p className="text-gray-500 text-sm">No Bids Registered</p>
        </div>
      }
      </div>
    </Card>
  );
};

export default SwiperSlider;
