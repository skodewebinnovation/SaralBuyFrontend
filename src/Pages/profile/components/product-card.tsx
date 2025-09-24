import { dateFormatter } from "@/helper/dateFormatter"

const ProductCard = ({ product }: { product: any }) => {
  product = product.product || product || {}
  console.log(product)
  return (
    <div className='w-full  border-r-2 border-gray-200 p-2 b shadow-sm '>
      <div className='flex gap-8 pl-20'>
        <div className='w-24 h-24 flex-shrink-0'>
          <img
            src={product.image  || '/no-image.webp'}
            alt={product.name}
            className='w-full h-full object-contain rounded-md'
          />
        </div>
        <div className='flex flex-col justify-between text-sm'>
          <div>
            <span className="cc">
              {product?.categoryId?.categoryName}
            </span>
          </div>
          <p className=' capitalize line-clamp-1 font-semibold'>{product.title}</p>
          <p>Delivery By: <strong>{dateFormatter(product?.paymentAndDelivery?.ex_deliveryDate) || 'N/A'}</strong></p>
          <p>QTY: <strong>{product.quantity || 'N/A'}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
