import { Card } from "./ui/card";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const SwiperBidSlider = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: "free-snap",
    slides: {
      perView: 1.2,
      spacing: 15,
    },
  });

  const bids = [
    {
      id: 1,
      date: "10-10-2025",
      category: "Stationary",
      title: "Children Books",
      deliveryDate: "10-10-2025",
      totalBids: 10,
      image:
        "https://media.istockphoto.com/id/1355687160/photo/various-sport-equipment-gear.jpg?s=612x612&w=0&k=20&c=NMA7dXMtGLJAin0z6N2uqrnwLXCRCXSw306SYfS49nI=",
    },
    {
      id: 2,
      date: "15-11-2025",
      category: "Sports",
      title: "Badminton Set",
      deliveryDate: "15-11-2025",
      totalBids: 8,
      image:
        "https://media.istockphoto.com/id/1355687160/photo/various-sport-equipment-gear.jpg?s=612x612&w=0&k=20&c=NMA7dXMtGLJAin0z6N2uqrnwLXCRCXSw306SYfS49nI=",
    },
  ];

  return (
    <Card className="shadow-none p-5 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-2xl border-l-4 border-gray-600 pl-3 tracking-tight text-gray-600">
          Your Bids
        </p>
        <button className="text-md text-orange-600 hover:underline font-semibold">
          See All
        </button>
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider  ">
        {bids.map((bid) => (
          <div key={bid.id} className="keen-slider__slide ">
            <Card className="flex flex-row items-center justify-around gap-4 p-4 rounded-xl   shadow border border-gray-200">
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={bid.image}
                  alt={bid.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between ">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Dated: {bid.date}
                  </p>
                  <p className="text-orange-600 font-semibold">
                    {bid.category}
                  </p>
                  <p className="font-medium">{bid.title}</p>
                  <p className="text-sm text-gray-600">
                    Deliver by:{" "}
                    <span className="font-bold">{bid.deliveryDate}</span>
                  </p>
                </div>

               
              </div>
               {/* Footer */}
                <div className="flex flex-col h-full justify-between items-center space-y-12">
                  <p className="text-sm border rounded px-2 py-1 bg-gray-50">
                    Total Bids:{" "}
                    <span className="font-semibold text-orange-600">
                      {bid.totalBids}
                    </span>
                  </p>
                  <a
                    href="#"
                    className="text-sm text-orange-600 font-medium hover:underline"
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

export default SwiperBidSlider;
