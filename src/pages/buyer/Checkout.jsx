import { useNavigate } from "react-router-dom"
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction
} from "firebase/firestore"
import Navbar from "../../components/layout/Navbar"
import { db } from "../../firebase/firebase"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"

export default function Checkout() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart, total } =
    useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login again")
      return
    }

    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    setLoading(true)

    try {
      await runTransaction(db, async (transaction) => {
        // STEP 1: READ all product data first
        let sellerId = ""
        const productRefs = []
        const productSnaps = []

        for (const item of cart) {
          const productRef = doc(db, "products", item.id)
          const productSnap = await transaction.get(productRef)

          if (!productSnap.exists()) {
            throw new Error(`Product not found: ${item.name}`)
          }

          const currentStock = productSnap.data().stock ?? 0
          if (currentStock < item.quantity) {
            throw new Error(
              `Not enough stock for ${item.name}. Available: ${currentStock}`
            )
          }

          if (sellerId === "" && productSnap.data().sellerId) {
            sellerId = productSnap.data().sellerId
          }

          productRefs.push(productRef)
          productSnaps.push({ ref: productRef, snap: productSnap })
        }

        // STEP 2: WRITE all updates after reading is complete
        for (const { ref, snap } of productSnaps) {
          const currentStock = snap.data().stock ?? 0
          const item = cart.find(i => i.id === ref.id)
          transaction.update(ref, {
            stock: currentStock - item.quantity
          })
        }

        const orderRef = doc(collection(db, "orders"))
        transaction.set(orderRef, {
          buyerId: user.uid,
          buyerEmail: user.email,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || ""
          })),
          total,
          status: "placed",
          sellerId,
          createdAt: serverTimestamp()
        })
      })

      clearCart()
      navigate("/orders")
    } catch (error) {
      console.error("ORDER ERROR:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0a0e27]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">🛍️ Your Shopping Cart</h1>
            <p className="text-blue-100">Complete your purchase with our secure checkout</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {cart.length === 0 ? (
            <div className="bg-[#1a1f3a] rounded-lg p-16 text-center shadow-lg border border-[#3f4663]">
              <div className="text-7xl mb-6">🛒</div>
              <h2 className="text-3xl font-bold text-[#e5e7eb] mb-3">Your cart is empty</h2>
              <p className="text-[#9ca3af] mb-8 text-lg">Discover our amazing collection of premium electronics</p>
              <button
                onClick={() => navigate("/store")}
                className="px-8 py-3 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all"
              >
                👉 Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-[#e5e7eb] mb-6">📦 Your Items ({cart.length})</h2>
                
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1f3a] rounded-lg p-6 flex gap-6 hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all duration-300 border border-[#3f4663] hover:border-[#00d4ff]"
                  >
                    {/* Image */}
                    <div className="shrink-0">
                      <div className="relative overflow-hidden rounded-lg bg-[#2d3561]">
                        <img
                          src={item.image || "https://via.placeholder.com/100"}
                          alt={item.name}
                          className="h-28 w-28 object-cover hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-[#7c3aed] text-white text-xs font-bold px-2 py-1 rounded-lg">
                          #{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-[#e5e7eb] text-lg line-clamp-2 mb-2">{item.name}</h3>
                        <p className="text-2xl font-bold bg-linear-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="w-10 h-10 rounded-lg bg-[#2d3561] hover:bg-[#3f4663] transition-colors font-bold text-lg flex items-center justify-center text-[#00d4ff]"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-[#e5e7eb] text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="w-10 h-10 rounded-lg bg-[#2d3561] hover:bg-[#3f4663] transition-colors font-bold text-lg flex items-center justify-center text-[#00d4ff]"
                        >
                          +
                        </button>
                        <div className="flex-1"></div>
                        <p className="text-lg font-bold text-[#e5e7eb] bg-[#2d3561] px-4 py-2 rounded-lg">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-[#f87171] hover:text-white hover:bg-[#7f1d1d] px-3 py-2 rounded-lg transition-all font-bold"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#1a1f3a] rounded-lg p-8 sticky top-24 shadow-2xl border border-[#3f4663]">
                  {/* Header */}
                  <h3 className="font-bold text-[#e5e7eb] mb-8 text-2xl flex items-center gap-2">
                    💳 Order Summary
                  </h3>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 mb-6 pb-6 border-b-2 border-[#3f4663]">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-[#9ca3af] font-medium">Subtotal</span>
                      <span className="text-[#e5e7eb] font-bold">₹{total.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <span className="text-[#9ca3af] font-medium">Shipping</span>
                      <span className="text-[#6ee7b7] font-bold bg-[#064e3b] px-3 py-1 rounded-lg">
                        FREE 🚚
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between">
                      <span className="text-[#9ca3af] font-medium">Tax</span>
                      <span className="text-[#e5e7eb] font-bold">₹0</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8 p-4 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] rounded-lg border border-[#00d4ff]">
                    <span className="font-bold text-white text-lg">Total</span>
                    <span className="text-3xl font-bold text-[#e5e7eb]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Items Count */}
                  <div className="p-4 bg-[#2d3561] border-2 border-[#00d4ff] rounded-lg mb-6 text-center">
                    <p className="text-[#00d4ff] font-semibold text-lg">
                      📦 <span className="font-bold">{cart.length}</span> item{cart.length !== 1 ? "s" : ""} in cart
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] mb-3 ${
                      loading
                        ? "bg-[#3f4663] text-[#9ca3af] cursor-not-allowed"
                        : "bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white hover:from-[#9d4edd] hover:to-[#00d4ff] active:scale-95"
                    }`}
                  >
                    {loading ? "⏳ Processing..." : "✅ Place Order"}
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate("/store")}
                    className="w-full py-3 rounded-lg font-semibold text-[#00d4ff] border-2 border-[#00d4ff] hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#1a1f3a] transition-all"
                  >
                    ← Continue Shopping
                  </button>

                  {/* Security Badge */}
                  <div className="mt-6 p-3 bg-[#064e3b] rounded-lg border border-[#6ee7b7] text-center">
                    <p className="text-xs text-[#6ee7b7] font-semibold">
                      🔒 Secure Checkout | SSL Encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

