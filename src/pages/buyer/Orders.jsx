import { useEffect, useState } from "react"
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"

export default function Orders() {
  const { user } = useAuth()
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

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            You haven’t placed any orders yet 🛒
          </div>
        )}

        {orders.map(order => (
          <div
            key={order.id}
            className="border rounded p-4 mb-4 bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    order.status === "placed"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              <p className="font-semibold">₹{order.total}</p>
            </div>

            <ul className="text-sm text-gray-600 mb-3">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity ?? 1}
                </li>
              ))}
            </ul>

            {order.status === "placed" && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="text-red-600 border border-red-500 px-4 py-1 rounded hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}

            {order.status === "cancelled" && (
              <p className="text-sm text-red-500 font-medium">
                This order has been cancelled
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

