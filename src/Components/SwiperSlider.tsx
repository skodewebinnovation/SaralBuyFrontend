
import { Card } from "./ui/card";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useNavigate } from "react-router-dom";
type Props = {
  title: string,
  color: string,
  target: string,
  data:any[]
}

const SwiperSlider = ({ title, color, target,data }: Props) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: "free-snap",
    slides: {
      perView: 1.2,
      spacing: 15,
    },
  })
  const navigate = useNavigate()



  return (
    <Card className={`shadow-none p-5 bg-${color}-50`}>
      {/* Header */}
      <div className="flex justify-between items-center ">
        <p className={`font-bold text-2xl border-l-4 border-${color}-600 pl-3 tracking-tight text-${color}-600`}>
          {title}
        </p>
        <button className={`text-md text-${color}-600 hover:underline font-semibold cursor-pointer`}
        onClick={()=>{  
          target === 'bids' ? navigate('/account/bid') : navigate('/account/requirements')
        }}>
          See All
        </button>
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider  ">
        { data.map((item) => (
          <div key={item.id} className="keen-slider__slide ">
            <Card className="flex flex-row items-center justify-around gap-4 p-4 rounded-xl   shadow border border-gray-200">
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
                  <p className="text-orange-600 font-semibold capitalize">
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
                <p className="text-sm border rounded px-2 py-1 bg-gray-50">
                  Total Bids:{" "}
                  <span className="font-semibold text-orange-600">
                    {item.totalBids}
                  </span>
                </p>
                <a
                  href="#"
                  className={`text-sm text-${color}-600 font-medium hover:underline  text-right`}
                >
                  View →
                </a>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SwiperSlider;
