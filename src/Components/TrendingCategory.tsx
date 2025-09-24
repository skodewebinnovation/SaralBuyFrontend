
const RING_CLASS =['ring-gray-600','ring-gray-500','ring-yellow-500','ring-red-700','ring-green-700']

const TrendingCategory = () => {

  const data=[
    {
      title:'Electronics'
    },
    {
      title:'Fashion'
    },
    {
      title:'Furiture'
    },
    {
      title:'Automobile'
    },
    {
      title:'Sports & fitness'
    }

  ]
  return (
<div className="px-4  bg-no-repeat z-0 bg-cover  py-10  min-h-82  max-w-7xl mx-auto">
     <div className="flex  items-center mb-4 ">
        <p className="font-bold text-3xl border-l-4 whitespace-nowrap border-gray-600 pl-3 tracking-tight text-gray-600">
            Trending Categories
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5 px-5 sm:px-10  mt-10  ">
       {
        data.map((_,idx:number)=>(<div className="flex justify-center items-center flex-col">
        <div className={`ring-4 ${RING_CLASS[idx]} rounded-full  h-32 w-32 overflow-hidden mx-auto `}>
            <img src="https://etimg.etb2bimg.com/thumb/msid-94146979,width-1200,height-900,resizemode-4/.jpg" className="w-full h-full object-cover"/>
        </div>
        <p className="text-gray-600 text-center mt-3">{_.title}</p>
        </div>))
       }
      </div>
     
</div>
  )
}

export default TrendingCategory