import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const outOfStock = product.stock === 0

  return (
    <div className="group flex flex-col h-full bg-[#1a1f3a] rounded-lg overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 border border-[#3f4663] hover:border-[#00d4ff] hover:glow-cyan">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#2d3561] to-[#1a1f3a] shrink-0 aspect-square">
        <img
          src={product.image || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-[#00d4ff] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <p className="text-white font-bold text-lg">Out of Stock</p>
              <p className="text-white/80 text-xs mt-1">Coming soon</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white text-xs font-semibold px-3 py-1.5 rounded-lg capitalize shadow-md">
              {product.category}
            </span>
          </div>
        )}

        {/* Stock Badge */}
        {!outOfStock && product.stock < 5 && (
          <div className="absolute top-4 right-4">
            <span className="bg-[#f59e0b] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md animate-pulse">
              Only {product.stock} left
            </span>
          </div>
        )}

        {/* Sale Badge */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-[#00d4ff] text-[#0a0e27] text-xs font-bold px-3 py-1.5 rounded-lg">
            ⭐ Premium
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3
          className="font-bold text-[#e5e7eb] text-sm group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-[#00d4ff] group-hover:to-[#7c3aed] group-hover:bg-clip-text line-clamp-2 cursor-pointer transition-all duration-300 h-10 leading-5"
          onClick={() => navigate(`/product/${product.id}`)}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Description */}
        {product.shortDesc && (
          <p className="text-xs text-[#9ca3af] mt-1 line-clamp-1">
            {product.shortDesc}
          </p>
        )}

        {/* Price Section */}
        <div className="mt-3 mb-4">
          <p className="text-2xl font-bold bg-linear-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">
            {outOfStock ? (
              <span className="text-[#f87171] font-semibold">Currently unavailable</span>
            ) : (
              <span className="text-[#6ee7b7] font-medium">✓ In stock ({product.stock} available)</span>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-[#3f4663]">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#00d4ff] border-2 border-[#00d4ff] rounded-lg hover:bg-[#1a1f3a] hover:shadow-[0_0_10px_rgba(0,212,255,0.3)] transition-all duration-200"
          >
            View Details
          </button>

          <button
            onClick={() => addToCart(product)}
            disabled={outOfStock}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              outOfStock
                ? "bg-[#3f4663] text-[#9ca3af] cursor-not-allowed"
                : "bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white hover:shadow-lg hover:shadow-[#00d4ff]/50 active:scale-95"
            }`}
          >
            {outOfStock ? "Unavailable" : "🛍️ Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}

