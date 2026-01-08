import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"))
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }

    fetchOrders()
  }, [])

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">All Orders</h1>

        {orders.map(order => (
          <div
            key={order.id}
            className="border rounded p-4 mb-4"
          >
            <p className="font-semibold">
              Buyer: {order.buyerEmail}
            </p>

            <p>Total: ₹{order.total}</p>
            <p>Status: {order.status}</p>

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
