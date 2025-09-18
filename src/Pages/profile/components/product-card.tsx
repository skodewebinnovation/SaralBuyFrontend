import { dateFormatter } from "@/helper/dateFormatter"

const ProductCard = ({ product }: { product: any }) => {
  product = product.product || product || {}
  console.log(product)
  return (
    <div className='w-full border p-2 border-gray-200 rounded-md shadow-sm bg-white'>
      <div className='flex gap-4'>
        <div className='w-24 h-24 flex-shrink-0'>
          <img
            src={product.image  || '/no-image.webp'}
            alt={product.name}
            className='w-full h-full object-contain rounded-md'
          />
        </div>
        <div className='flex flex-col justify-between text-sm'>
          <div>
            <span className="text-orange-400 bg-orange-50 rounded-full inline-block px-3 py-1 text-xs capitalize">
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
