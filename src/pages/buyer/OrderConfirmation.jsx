import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = location.state?.orderId
    
    if (!orderId) {
      navigate("/orders")
      return
    }

    const fetchOrder = async () => {
      try {
        const docSnap = await getDoc(doc(db, "orders", orderId))
        if (docSnap.exists()) {
          setOrder({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt?.toDate?.() || new Date()
          })
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [location.state?.orderId, navigate])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-white text-xl">Loading order details...</p>
          </div>
        </main>
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-white text-xl">Order not found</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0a0e27]">
        {/* Success Header */}
        <div className="bg-linear-to-r from-green-600 to-cyan-500 text-white">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center">
              <div className="text-7xl mb-6">✅</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-green-100 text-lg">Thank you for your purchase</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Order Details Card */}
          <div className="bg-[#1a1f3a] rounded-lg p-8 shadow-xl border border-[#3f4663] mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-[#3f4663]">
              {/* Order Number */}
              <div>
                <p className="text-[#9ca3af] text-sm uppercase tracking-wider mb-2">Order Number</p>
                <p className="text-white text-lg font-bold break-all">{order.id}</p>
              </div>

              {/* Order Date */}
              <div>
                <p className="text-[#9ca3af] text-sm uppercase tracking-wider mb-2">Order Date</p>
                <p className="text-white text-lg font-bold">
                  {order.createdAt.toLocaleDateString("en-IN")}
                </p>
              </div>

              {/* Order Status */}
              <div>
                <p className="text-[#9ca3af] text-sm uppercase tracking-wider mb-2">Status</p>
                <div className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg font-semibold">
                  ⏱️ {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">📦 Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#2d3561] rounded-lg p-4 flex items-center justify-between hover:bg-[#3a4573] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-[#9ca3af] text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ₹{item.price?.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[#9ca3af] text-sm">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")} total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#0f1433] rounded-lg p-6 mb-8 border border-[#3f4663]">
              <div className="space-y-3 mb-4 pb-4 border-b border-[#3f4663]">
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Subtotal:</span>
                  <span>₹{order.total?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Shipping:</span>
                  <span className="text-[#6ee7b7]">FREE 🚚</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Tax:</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] rounded-lg">
                <span className="font-bold text-white">Total Amount</span>
                <span className="text-3xl font-bold text-white">
                  ₹{order.total?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
              <p className="text-blue-300 text-sm">
                ℹ️ A confirmation email has been sent to <strong>{order.buyerEmail}</strong>. You can track your order status in the Orders section.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 py-3 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all"
            >
              📋 View All Orders
            </button>
            <button
              onClick={() => navigate("/store")}
              className="flex-1 py-3 border-2 border-[#00d4ff] text-[#00d4ff] font-bold rounded-lg hover:bg-[#1a1f3a] transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
