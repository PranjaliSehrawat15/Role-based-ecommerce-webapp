// import { useEffect, useState } from "react"
// import { collection, getDocs } from "firebase/firestore"
// import { db } from "../../firebase/firebase"
// import Navbar from "../../components/layout/Navbar"

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([])

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const snap = await getDocs(collection(db, "orders"))
//       setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//     }

//     fetchOrders()
//   }, [])

//   return (
//     <>
//       <Navbar />

//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6">All Orders</h1>

//         {orders.map(order => (
//           <div
//             key={order.id}
//             className="border rounded p-4 mb-4"
//           >
//             <p className="font-semibold">
//               Buyer: {order.buyerEmail}
//             </p>

//             <p>Total: ₹{order.total}</p>
//             <p>Status: {order.status}</p>

//             <ul className="mt-2 text-sm text-gray-600">
//               {order.items.map((item, i) => (
//                 <li key={i}>
//                   {item.name} × {item.qty}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </>
//   )
// }

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        )

        const snap = await getDocs(q)
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [])

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">All Orders</h1>

        {loading && <p>Loading orders…</p>}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">No orders found.</p>
        )}

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="border rounded-xl p-4 bg-white shadow"
            >
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold">
                    Buyer: {order.buyerEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                </div>

                <p className="font-bold">
                  Total: ₹{order.total}
                </p>
              </div>

              <div className="mt-3">
                <p className="font-medium mb-1">Items:</p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.qty} (₹{item.price})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

