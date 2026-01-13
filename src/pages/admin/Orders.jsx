import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query, updateDoc, doc, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Loader from "../../components/ui/Loader"


export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    if (!user) return
    const q = query(
      collection(db, "orders"),
      where("sellerId", "==", user.uid)
    )
    const snap = await getDocs(q)
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    // Sort newest first
    docs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
    setOrders(docs)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [user])

  const updateStatus = async (orderId, status) => {
    await updateDoc(doc(db, "orders", orderId), { status })
    fetchOrders()
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">All Orders</h1>

    {loading && <Loader text="Fetching orders..." />}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">No orders found.</p>
        )}

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="border rounded-xl p-4 bg-white shadow"
            >
              <div className="flex justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold">Buyer: {order.buyerEmail}</p>
                  <p className="text-sm text-gray-500">
                    Current Status: <b>{order.status}</b>
                  </p>
                </div>

                <p className="font-bold">Total: ₹{order.total}</p>
              </div>

              <div className="mt-3">
                <p className="font-medium mb-1">Items:</p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity ?? 1}
                    </li>
                  ))}
                </ul>
              </div>

              {/* STATUS CONTROLS */}
<div className="mt-4 flex gap-2 flex-wrap">
  {order.status !== "cancelled" && (
    <>
      <button
        onClick={() => updateStatus(order.id, "placed")}
        disabled={order.status === "delivered"}
        className={`px-3 py-1 rounded border ${
          order.status === "placed" ? "bg-black text-white" : ""
        }`}
      >
        Placed
      </button>

      <button
        onClick={() => updateStatus(order.id, "shipped")}
        disabled={order.status === "delivered"}
        className={`px-3 py-1 rounded border ${
          order.status === "shipped" ? "bg-black text-white" : ""
        }`}
      >
        Shipped
      </button>

      <button
        onClick={() => updateStatus(order.id, "delivered")}
        className={`px-3 py-1 rounded border ${
          order.status === "delivered" ? "bg-black text-white" : ""
        }`}
      >
        Delivered
      </button>
    </>
  )}

  {order.status === "cancelled" && (
    <span className="text-red-600 font-semibold">
      Order Cancelled by Buyer
    </span>
  )}
</div>

            </div>
          ))}
        </div>
      </div>
    </>
  )
}

