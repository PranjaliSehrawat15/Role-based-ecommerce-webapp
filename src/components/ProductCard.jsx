import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="h-40 bg-gray-200 rounded mb-3" />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">₹{product.price}</p>

      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  )
}
