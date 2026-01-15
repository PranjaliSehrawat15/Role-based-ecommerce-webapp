import { useEffect, useState } from "react"
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"

export default function Orders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    const q = query(
      collection(db, "orders"),
      where("buyerId", "==", user.uid)
    )
    const snap = await getDocs(q)
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    fetchOrders()
  }, [user.uid])

  const cancelOrder = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to cancel this order?")
    if (!confirm) return

    await updateDoc(doc(db, "orders", orderId), {
      status: "cancelled"
    })

    fetchOrders()
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0a0e27]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">📦 My Orders</h1>
            <p className="text-blue-100">Track and manage all your purchases</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {orders.length === 0 ? (
            <div className="bg-[#1a1f3a] rounded-lg p-16 text-center shadow-lg border border-[#3f4663]">
              <div className="text-7xl mb-6">🛍️</div>
              <h2 className="text-3xl font-bold text-[#e5e7eb] mb-3">No orders yet</h2>
              <p className="text-[#9ca3af] mb-8 text-lg">Start shopping to see your orders here</p>
              <button
                onClick={() => navigate("/store")}
                className="px-8 py-3 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all"
              >
                👉 Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[#9ca3af] font-medium">
                  Total Orders: <span className="text-2xl font-bold text-[#00d4ff]">{orders.length}</span>
                </p>
              </div>

              {orders.map((order, idx) => (
                <div
                  key={order.id}
                  className="bg-[#1a1f3a] rounded-lg p-8 hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all duration-300 border border-[#3f4663] hover:border-[#00d4ff]"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-[#3f4663]">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📋</span>
                        <p className="text-sm text-[#9ca3af] font-medium">Order #{idx + 1}</p>
                      </div>
                      <p className="font-mono text-xs text-[#9ca3af] bg-[#2d3561] px-3 py-2 rounded-lg inline-block border border-[#3f4663]">
                        ID: {order.id.slice(0, 16)}...
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Status Badge */}
                      <div>
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-bold inline-block ${
                            order.status === "placed"
                              ? "bg-[#78350f] text-[#fbbf24]"
                              : order.status === "cancelled"
                              ? "bg-[#7f1d1d] text-[#fca5a5]"
                              : "bg-[#064e3b] text-[#6ee7b7]"
                          }`}
                        >
                          {order.status === "placed" && "🕐 Processing"}
                          {order.status === "cancelled" && "❌ Cancelled"}
                          {order.status !== "placed" && order.status !== "cancelled" && "✅ Completed"}
                        </span>
                      </div>

                      {/* Total Amount */}
                      <div className="text-right">
                        <p className="text-sm text-[#9ca3af] font-medium mb-1">Total Amount</p>
                        <p className="text-3xl font-bold bg-linear-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">
                          ₹{order.total.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-[#e5e7eb] mb-4 flex items-center gap-2">
                      📦 Items ({order.items.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 bg-[#2d3561] rounded-lg border border-[#3f4663] hover:bg-[#3f4663] hover:border-[#00d4ff] transition-all"
                        >
                          <p className="text-sm font-semibold text-[#e5e7eb] line-clamp-1">
                            {item.name}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-[#9ca3af]">
                              Qty: <span className="font-bold">{item.quantity ?? 1}</span>
                            </p>
                            <p className="text-sm font-bold text-[#00d4ff]">
                              ₹{(item.price * (item.quantity ?? 1)).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex gap-3 pt-4">
                    {order.status === "placed" && (
                      <>
                        <button
                          onClick={() => navigate("/store")}
                          className="flex-1 px-4 py-2.5 text-[#00d4ff] border-2 border-[#00d4ff] rounded-lg font-semibold hover:bg-[#1a1f3a] transition-colors text-sm"
                        >
                          🛍️ Continue Shopping
                        </button>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="flex-1 px-4 py-2.5 text-[#f87171] border-2 border-[#f87171] rounded-lg font-semibold hover:bg-[#7f1d1d] transition-colors text-sm"
                        >
                          ❌ Cancel Order
                        </button>
                      </>
                    )}

                    {order.status === "cancelled" && (
                      <div className="w-full px-4 py-3 bg-[#7f1d1d] border border-[#f87171] rounded-lg text-center">
                        <p className="text-sm text-[#fca5a5] font-semibold">✗ Order has been cancelled</p>
                      </div>
                    )}

                    {order.status !== "placed" && order.status !== "cancelled" && (
                      <div className="w-full px-4 py-3 bg-[#064e3b] border border-[#6ee7b7] rounded-lg text-center">
                        <p className="text-sm text-[#6ee7b7] font-semibold">✓ Order completed successfully</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

