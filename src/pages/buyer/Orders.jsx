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
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, "orders"),
        where("buyerId", "==", user.uid)
      )
      const snap = await getDocs(q)
      const ordersData = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date()
      }))
      // Sort by date - newest first
      ordersData.sort((a, b) => b.createdAt - a.createdAt)
      setOrders(ordersData)
    } finally {
      setLoading(false)
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case "placed":
        return { bg: "bg-amber-900/30", border: "border-amber-600", badge: "bg-amber-900 text-amber-300", icon: "🕐", text: "Processing" }
      case "cancelled":
        return { bg: "bg-red-900/30", border: "border-red-600", badge: "bg-red-900 text-red-300", icon: "❌", text: "Cancelled" }
      case "completed":
        return { bg: "bg-emerald-900/30", border: "border-emerald-600", badge: "bg-emerald-900 text-emerald-300", icon: "✅", text: "Completed" }
      case "shipped":
        return { bg: "bg-blue-900/30", border: "border-blue-600", badge: "bg-blue-900 text-blue-300", icon: "🚚", text: "Shipped" }
      default:
        return { bg: "bg-gray-900/30", border: "border-gray-600", badge: "bg-gray-900 text-gray-300", icon: "📦", text: status }
    }
  }

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  const statusSequence = ["placed", "shipped", "completed"]
  const getStatusProgress = (status) => {
    if (status === "cancelled") return 0
    const index = statusSequence.indexOf(status)
    return index === -1 ? 100 : ((index + 1) / statusSequence.length) * 100
  }

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#1a1f3a] rounded-lg p-8 border border-[#3f4663] animate-pulse"
        >
          <div className="h-6 bg-[#2d3561] rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-[#2d3561] rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div className="h-20 bg-[#2d3561] rounded"></div>
            <div className="h-20 bg-[#2d3561] rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <Navbar />

      <main className="bg-[#0a0e27]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#0891b2] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#06b6d4] rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7c3aed] rounded-full blur-3xl -ml-32 -mb-32"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 flex items-center gap-3">
              <span>📦</span>
              <span>My Orders</span>
            </h1>
            <p className="text-blue-100 text-lg">Track, manage, and monitor your purchases</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-12 pb-0">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredOrders.length === 0 ? (
            <div className="bg-gradient-to-br from-[#1a1f3a] to-[#2d3561] rounded-2xl p-16 text-center shadow-xl border border-[#3f4663] hover:border-[#06b6d4] transition-all duration-300">
              <div className="text-8xl mb-6 animate-bounce">🛍️</div>
              <h2 className="text-4xl font-bold text-[#e5e7eb] mb-3">
                {filterStatus === "all" ? "No orders yet" : `No ${filterStatus} orders`}
              </h2>
              <p className="text-[#9ca3af] mb-10 text-lg max-w-md mx-auto">
                {filterStatus === "all"
                  ? "You haven't placed any orders yet. Start exploring our store and discover amazing products!"
                  : `You don't have any ${filterStatus} orders at the moment.`}
              </p>
              <button
                onClick={() => navigate("/store")}
                className="px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-[#06b6d4]/50 transition-all duration-300 transform hover:scale-105"
              >
                👉 Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1f3a] border border-[#3f4663] rounded-lg p-4 text-center hover:border-[#06b6d4] transition-all">
                  <p className="text-2xl font-bold text-[#00d4ff]">{orders.length}</p>
                  <p className="text-xs text-[#9ca3af] mt-1">Total Orders</p>
                </div>
                <div className="bg-[#1a1f3a] border border-[#3f4663] rounded-lg p-4 text-center hover:border-[#06b6d4] transition-all">
                  <p className="text-2xl font-bold text-amber-400">{orders.filter(o => o.status === "placed").length}</p>
                  <p className="text-xs text-[#9ca3af] mt-1">Processing</p>
                </div>
                <div className="bg-[#1a1f3a] border border-[#3f4663] rounded-lg p-4 text-center hover:border-[#06b6d4] transition-all">
                  <p className="text-2xl font-bold text-blue-400">{orders.filter(o => o.status === "shipped").length}</p>
                  <p className="text-xs text-[#9ca3af] mt-1">Shipped</p>
                </div>
                <div className="bg-[#1a1f3a] border border-[#3f4663] rounded-lg p-4 text-center hover:border-[#06b6d4] transition-all">
                  <p className="text-2xl font-bold text-emerald-400">{orders.filter(o => o.status === "completed").length}</p>
                  <p className="text-xs text-[#9ca3af] mt-1">Completed</p>
                </div>
              </div>

              {/* Filter Section */}
              <div className="flex flex-wrap gap-3">
                {["all", "placed", "shipped", "completed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                      filterStatus === status
                        ? "bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-lg shadow-[#06b6d4]/50"
                        : "bg-[#1a1f3a] text-[#9ca3af] border border-[#3f4663] hover:border-[#06b6d4] hover:text-[#e5e7eb]"
                    }`}
                  >
                    {status === "all" ? "All Orders" : status}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                {filteredOrders.map((order, idx) => {
                  const statusConfig = getStatusColor(order.status)
                  const progress = getStatusProgress(order.status)
                  const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date()
                  const estimatedDelivery = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000)

                  return (
                    <div
                      key={order.id}
                      className={`${statusConfig.bg} rounded-2xl p-8 border-2 ${statusConfig.border} hover:shadow-xl hover:shadow-[#06b6d4]/20 transition-all duration-300`}
                    >
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 pb-8 border-b border-[#3f4663]">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">📋</span>
                            <div>
                              <p className="text-xs text-[#9ca3af] font-medium">Order #{idx + 1}</p>
                              <p className="text-xl font-bold text-[#e5e7eb]">Order Placed</p>
                            </div>
                          </div>
                          <p className="font-mono text-xs text-[#9ca3af] bg-[#2d3561] px-4 py-2 rounded-lg inline-block border border-[#3f4663] mt-2">
                            {order.id.slice(0, 20)}...
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                          {/* Status Badge */}
                          <div className="text-center sm:text-right">
                            <span className={`px-6 py-3 rounded-full text-sm font-bold inline-flex items-center gap-2 ${statusConfig.badge}`}>
                              <span>{statusConfig.icon}</span>
                              <span>{statusConfig.text}</span>
                            </span>
                          </div>

                          {/* Total Amount */}
                          <div className="text-right">
                            <p className="text-sm text-[#9ca3af] font-medium mb-2">Total Amount</p>
                            <p className="text-4xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">
                              ₹{order.total.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Progress Bar */}
                      {order.status !== "cancelled" && (
                        <div className="mb-8 pb-8 border-b border-[#3f4663]">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-semibold text-[#e5e7eb]">Order Status</p>
                            <p className="text-xs text-[#9ca3af]">{Math.round(progress)}% Complete</p>
                          </div>
                          <div className="w-full bg-[#2d3561] rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-4 text-xs text-[#9ca3af]">
                            <span className={progress >= 0 ? "text-[#06b6d4] font-semibold" : ""}>📦 Placed</span>
                            <span className={progress >= 50 ? "text-[#06b6d4] font-semibold" : "opacity-50"}>🚚 Shipped</span>
                            <span className={progress >= 100 ? "text-[#06b6d4] font-semibold" : "opacity-50"}>✅ Delivered</span>
                          </div>
                        </div>
                      )}

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-[#3f4663]">
                        <div>
                          <p className="text-sm text-[#9ca3af] font-medium mb-2">Order Date</p>
                          <p className="text-lg font-semibold text-[#e5e7eb]">{orderDate.toLocaleDateString()}</p>
                          <p className="text-xs text-[#9ca3af] mt-1">{orderDate.toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#9ca3af] font-medium mb-2">Estimated Delivery</p>
                          <p className="text-lg font-semibold text-[#e5e7eb]">{estimatedDelivery.toLocaleDateString()}</p>
                          <p className="text-xs text-[#9ca3af] mt-1">~7 business days</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-8">
                        <p className="text-base font-bold text-[#e5e7eb] mb-4 flex items-center gap-2">
                          <span>📦</span>
                          Items ({order.items.length})
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="p-4 bg-[#2d3561] rounded-xl border border-[#3f4663] hover:bg-[#3f4663] hover:border-[#06b6d4] transition-all hover:shadow-lg hover:shadow-[#06b6d4]/20"
                            >
                              <p className="text-sm font-semibold text-[#e5e7eb] line-clamp-2 mb-3">
                                {item.name}
                              </p>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="text-xs text-[#9ca3af] mb-1">Quantity</p>
                                  <p className="font-bold text-[#00d4ff] text-lg">{item.quantity ?? 1}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-[#9ca3af] mb-1">Unit Price</p>
                                  <p className="font-bold text-[#06b6d4] text-sm">₹{item.price.toLocaleString("en-IN")}</p>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-[#3f4663]">
                                <p className="text-xs text-[#9ca3af] mb-1">Subtotal</p>
                                <p className="text-lg font-bold bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">
                                  ₹{(item.price * (item.quantity ?? 1)).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        {order.status === "placed" && (
                          <>
                            <button
                              onClick={() => navigate("/store")}
                              className="flex-1 px-6 py-3 text-[#06b6d4] border-2 border-[#06b6d4] rounded-lg font-bold hover:bg-[#06b6d4]/10 transition-all text-sm hover:shadow-lg hover:shadow-[#06b6d4]/30"
                            >
                              🛍️ Continue Shopping
                            </button>
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="flex-1 px-6 py-3 text-[#f87171] border-2 border-[#f87171] rounded-lg font-bold hover:bg-red-900/30 transition-all text-sm hover:shadow-lg hover:shadow-red-500/30"
                            >
                              ❌ Cancel Order
                            </button>
                          </>
                        )}

                        {order.status === "cancelled" && (
                          <div className="w-full px-6 py-4 bg-red-900/30 border-2 border-[#f87171] rounded-lg text-center">
                            <p className="text-sm text-[#fca5a5] font-bold flex items-center justify-center gap-2">
                              <span>✗</span>
                              Order has been cancelled
                            </p>
                          </div>
                        )}

                        {order.status === "completed" && (
                          <div className="w-full px-6 py-4 bg-emerald-900/30 border-2 border-[#6ee7b7] rounded-lg text-center">
                            <p className="text-sm text-[#6ee7b7] font-bold flex items-center justify-center gap-2">
                              <span>✓</span>
                              Order completed successfully
                            </p>
                          </div>
                        )}

                        {order.status === "shipped" && (
                          <div className="w-full px-6 py-4 bg-blue-900/30 border-2 border-blue-500 rounded-lg text-center">
                            <p className="text-sm text-blue-300 font-bold flex items-center justify-center gap-2">
                              <span>🚚</span>
                              Your order is on the way
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

