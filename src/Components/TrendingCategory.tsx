
const RING_CLASS =['ring-gray-300','ring-gray-500','ring-yellow-300','ring-red-300','ring-green-300']

const TrendingCategory = () => {

  return (
<div className="px-4 relative bg-no-repeat z-0 bg-cover  py-10  min-h-82 ">
     <div className="flex  items-center mb-4">
        <p className="font-bold text-3xl border-l-4 whitespace-nowrap border-gray-600 pl-3 tracking-tight text-gray-600">
            Trending Categories
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5 px-10  mt-10  ">
       {
        [1,2,3,4,5].map((_,idx:number)=>(<div className={`ring-3 ${RING_CLASS[idx]} rounded-full  h-32 w-32 overflow-hidden mx-auto`}>
            <img src="https://etimg.etb2bimg.com/thumb/msid-94146979,width-1200,height-900,resizemode-4/.jpg" className="w-full h-full object-cover"/>
        </div>))
       }
      </div>
     
</div>
  )
}

export default TrendingCategory