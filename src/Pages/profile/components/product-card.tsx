
const ProductCard = ({ product }:{product:any}) => {
  return (
    <div className='w-full border p-2 rounded-md shadow-sm bg-white'>
      <div className='flex gap-4'>
        <div className='w-24 h-24 flex-shrink-0'>
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='flex flex-col justify-between text-sm'>
        <div>
              <span className="text-orange-400 bg-orange-50 rounded-full inline-block px-3 py-1 text-xs">
            {product.category}
          </span>
        </div>
          <p className='font-medium'>{product.name}</p>
          <p>Delivery By: <strong>{product.deliveryDate}</strong></p>
          <p>QTY: <strong>{product.quantity}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
