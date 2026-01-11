// import { useCart } from "../context/CartContext"
// import { useNavigate } from "react-router-dom";

// export default function ProductCard({ product }) {
//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   return (
//     <div className="bg-white p-4 rounded-2xl shadow">
//      <div
//         onClick={() => navigate(`/product/${product.id}`)}
//         className="cursor-pointer"
//       >
//         <img
//   src={product.image || "https://via.placeholder.com/400x250?text=No+Image"}
//   alt={product.name}
//   className="h-48 w-full object-cover rounded"
// />



//         <h3 className="font-semibold">{product.name}</h3>
//         <p className="text-gray-600">₹{product.price}</p>
//         <p className="text-sm text-gray-500">{product.category}</p>
//       </div>

//       <button
//         onClick={() => addToCart(product)}
//         className="mt-3 w-full bg-black text-white py-2 rounded"
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const outOfStock = product.stock === 0

  return (
    <div className="border rounded-xl p-4 bg-white shadow relative">
      {/* OUT OF STOCK BADGE */}
      {outOfStock && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Out of Stock
        </span>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover rounded mb-3 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      />

      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">₹{product.price}</p>

      {/* STOCK INFO */}
      <p className="text-sm text-gray-500 mt-1">
        {outOfStock
          ? "Currently unavailable"
          : `In stock: ${product.stock}`}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="border px-4 py-1 rounded"
        >
          View
        </button>

        <button
          onClick={() => addToCart(product)}
          disabled={outOfStock}
          className={`px-4 py-1 rounded text-white ${
            outOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
