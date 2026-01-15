import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"
import { useCart } from "../../context/CartContext"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, "products", id)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          setProduct({
            id: snap.id,
            ...snap.data(),
          })
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
          <div className="text-center">
            <div className="skeleton w-16 h-16 rounded-lg mx-auto mb-4"></div>
            <p className="text-[#9ca3af]">Loading product details…</p>
          </div>
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0e27] flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-[#e5e7eb]">Product Not Found</h2>
          <p className="text-[#9ca3af]">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/store")}
            className="btn"
          >
            Back to Store
          </button>
        </div>
      </>
    )
  }

  const outOfStock = product.stock === 0

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0a0e27]">
        {/* Hero Background */}
        <div className="bg-linear-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[#3f4663]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center gap-3 text-sm">
              <button
                onClick={() => navigate("/store")}
                className="text-[#00d4ff] hover:text-[#06b6d4] font-medium flex items-center gap-1 transition-colors"
              >
                <span>📦</span> Shop
              </button>
              <span className="text-[#3f4663]">/</span>
              <button
                onClick={() => navigate("/store")}
                className="text-[#9ca3af] hover:text-[#e5e7eb] font-medium transition-colors capitalize"
              >
                {product.category || "Products"}
              </button>
              <span className="text-[#3f4663]">/</span>
              <span className="text-[#e5e7eb] font-semibold">{product.name}</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* LEFT: Product Image */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-[#1a1f3a] to-[#2d3561] aspect-square shadow-2xl group glow-cyan">
                    <img
                      src={product.image || "https://via.placeholder.com/500x500?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {outOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <p className="text-white font-bold text-2xl">Out of Stock</p>
                          <p className="text-white/80 text-sm mt-2">Coming soon</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {product.category && (
                      <div className="absolute top-6 left-6">
                        <span className="bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg capitalize">
                          {product.category}
                        </span>
                      </div>
                    )}

                    {/* Stock Badge */}
                    {!outOfStock && product.stock < 5 && (
                      <div className="absolute top-6 right-6">
                        <span className="bg-[#f59e0b] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg animate-pulse">
                          ⚡ Only {product.stock} left
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Product Info */}
              <div className="flex flex-col justify-center">
                {/* Title */}
                <h1 className="text-5xl font-bold text-[#e5e7eb] mb-6 leading-tight">
                  {product.name}
                </h1>

                {/* Price Section */}
                <div className="mb-8 pb-8 border-b border-[#3f4663]">
                  <p className="text-[#9ca3af] text-sm font-medium mb-2 uppercase tracking-wide">💰 Price</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-5xl font-bold bg-linear-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-8">
                  {outOfStock ? (
                    <div className="p-4 bg-[#7f1d1d] border-2 border-[#f87171] rounded-lg">
                      <p className="text-[#fca5a5] font-semibold flex items-center gap-2 text-lg">
                        <span className="text-2xl">❌</span>
                        Currently Out of Stock
                      </p>
                      <p className="text-[#fca5a5] text-sm mt-2">Subscribe to get notified when back in stock</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#064e3b] border-2 border-[#6ee7b7] rounded-lg">
                      <p className="text-[#6ee7b7] font-semibold flex items-center gap-2 text-lg">
                        <span className="text-2xl">✅</span>
                        {product.stock < 5 ? `Only ${product.stock} left in stock` : `In Stock (${product.stock} available)`}
                      </p>
                      <p className="text-[#6ee7b7] text-sm mt-1">Free shipping on orders over ₹500</p>
                    </div>
                  )}
                </div>

                {/* Short Description */}
                {product.shortDesc && (
                  <div className="mb-8">
                    <p className="text-[#e5e7eb] text-lg leading-relaxed">
                      {product.shortDesc}
                    </p>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={`py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 mb-6 shadow-lg hover:shadow-2xl active:scale-95 ${
                    outOfStock
                      ? "bg-[#3f4663] text-[#9ca3af] cursor-not-allowed"
                      : addedToCart
                      ? "bg-[#6ee7b7] text-[#0a0e27]"
                      : "bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white hover:shadow-lg hover:shadow-[#00d4ff]/50"
                  }`}
                >
                  {addedToCart ? "✅ Added to Cart" : outOfStock ? "Out of Stock" : "🛍️ Add to Cart"}
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate("/store")}
                  className="py-3 px-8 rounded-lg font-semibold text-[#00d4ff] border-2 border-[#00d4ff] hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-[#0a0e27] py-20 border-t border-[#3f4663]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Full Description */}
              {product.fullDesc && (
                <div>
                  <h2 className="text-3xl font-bold text-[#e5e7eb] mb-6">📖 About This Product</h2>
                  <div className="bg-linear-to-br from-[#1a1f3a] to-[#2d3561] p-8 rounded-lg border border-[#3f4663]">
                    <p className="text-[#e5e7eb] leading-relaxed text-lg">
                      {product.fullDesc}
                    </p>
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specs && Array.isArray(product.specs) && product.specs.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-[#e5e7eb] mb-6">⚙️ Specifications</h2>
                  <div className="bg-linear-to-br from-[#1a1f3a] to-[#2d3561] p-8 rounded-lg border border-[#3f4663]">
                    <ul className="space-y-4">
                      {product.specs.map((spec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-4 text-[#e5e7eb]"
                        >
                          <span className="w-2 h-2 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] rounded-full mt-2.5 shrink-0"></span>
                          <span className="text-lg">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="bg-linear-to-b from-[#1a1f3a] to-[#0a0e27] py-16 border-t border-[#3f4663]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#e5e7eb] mb-4">🎁 You Might Also Like</h2>
            <p className="text-[#9ca3af] mb-12 text-lg">Check out our other premium products</p>
            <button
              onClick={() => navigate("/store")}
              className="inline-block px-8 py-3 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all"
            >
              Explore All Products
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

