import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"),
        where("buyerId", "==", user.uid)
      )
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }

    fetchOrders()
  }, [user.uid])

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 && (
          <p className="text-gray-500">No orders yet.</p>
        )}

        {orders.map(order => (
          <div
            key={order.id}
            className="border rounded p-4 mb-4"
          >
            <p className="font-semibold">
              Order Status: {order.status}
            </p>

            <p>Total: ₹{order.total}</p>

            <ul className="mt-2 text-sm text-gray-600">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.qty}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}
