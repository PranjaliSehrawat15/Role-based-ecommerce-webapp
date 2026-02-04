
// import { useEffect, useState } from "react"
// import {
//   collection,
//   getDocs,
//   query,
//   updateDoc,
//   doc,
//   where
// } from "firebase/firestore"
// import { db } from "../../firebase/firebase"
// import { useAuth } from "../../context/AuthContext"
// import Navbar from "../../components/layout/Navbar"
// import Sidebar from "../../components/layout/Sidebar"

// export default function Orders() {

//   const { user } = useAuth()

//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)

//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const fetchOrders = async () => {
//     if (!user) return

//     const q = query(
//       collection(db, "orders"),
//       where("sellerId", "==", user.uid)
//     )

//     const snap = await getDocs(q)

//     const docs = snap.docs.map(d => ({
//       id: d.id,
//       ...d.data()
//     }))

//     // newest first
//     docs.sort(
//       (a, b) =>
//         (b.createdAt?.toMillis?.() || 0) -
//         (a.createdAt?.toMillis?.() || 0)
//     )

//     setOrders(docs)
//     setLoading(false)
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [user])

//   const updateStatus = async (orderId, status) => {
//     await updateDoc(doc(db, "orders", orderId), { status })
//     fetchOrders()
//   }

//   const getStatusColor = status => {
//     if (status === "placed") return "bg-yellow-100 text-yellow-700"
//     if (status === "shipped") return "bg-blue-100 text-blue-700"
//     if (status === "delivered") return "bg-green-100 text-green-700"
//     if (status === "cancelled") return "bg-red-100 text-red-600"
//     return "bg-gray-100 text-gray-600"
//   }

//   return (
//     <>
//       <Navbar onMenuClick={() => setSidebarOpen(true)} />

//       <div className="flex">

//         <Sidebar
//           mobileOpen={sidebarOpen}
//           close={() => setSidebarOpen(false)}
//         />

//         <div className="flex-1 bg-gray-100 min-h-screen p-4 md:p-8">

//           {/* HEADER */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">
//               Orders Management
//             </h1>
//             <p className="text-gray-500 mt-1">
//               Track and manage your customer orders
//             </p>
//           </div>

//           {/* LOADING */}
//           {loading && (
//             <div className="text-center py-20 text-gray-500">
//               Loading orders...
//             </div>
//           )}

//           {/* EMPTY */}
//           {!loading && orders.length === 0 && (
//             <div className="bg-white rounded-xl shadow p-10 text-center">
//               <div className="text-6xl mb-4">📭</div>
//               <h3 className="text-xl font-bold">
//                 No Orders Found
//               </h3>
//               <p className="text-gray-500 mt-2">
//                 Orders will appear here once customers buy products.
//               </p>
//             </div>
//           )}

//           {/* ORDERS LIST */}
//           <div className="space-y-5">

//             {orders.map(order => (

//               <div
//                 key={order.id}
//                 className="bg-white rounded-xl shadow hover:shadow-lg transition p-5"
//               >

//                 {/* TOP ROW */}
//                 <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

//                   <div>
//                     <p className="font-semibold text-gray-800">
//                       {order.buyerEmail}
//                     </p>

//                     <span
//                       className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
//                     >
//                       {order.status}
//                     </span>
//                   </div>

//                   <div className="text-lg font-bold text-gray-900">
//                     ₹{order.total}
//                   </div>

//                 </div>

//                 {/* ITEMS */}
//                 <div className="mt-4">
//                   <p className="font-semibold text-gray-700 mb-1">
//                     Items
//                   </p>

//                   <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
//                     {order.items.map((item, idx) => (
//                       <li key={idx}>
//                         {item.name} × {item.quantity ?? 1}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* ACTION BUTTONS */}
//                 {order.status !== "cancelled" && (

//                   <div className="mt-5 flex flex-wrap gap-3">

//                     <button
//                       onClick={() => updateStatus(order.id, "placed")}
//                       className={`px-4 py-1.5 rounded-lg border font-semibold text-sm transition ${
//                         order.status === "placed"
//                           ? "bg-black text-white"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       Placed
//                     </button>

//                     <button
//                       onClick={() => updateStatus(order.id, "shipped")}
//                       className={`px-4 py-1.5 rounded-lg border font-semibold text-sm transition ${
//                         order.status === "shipped"
//                           ? "bg-black text-white"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       Shipped
//                     </button>

//                     <button
//                       onClick={() => updateStatus(order.id, "delivered")}
//                       className={`px-4 py-1.5 rounded-lg border font-semibold text-sm transition ${
//                         order.status === "delivered"
//                           ? "bg-black text-white"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       Delivered
//                     </button>

//                   </div>

//                 )}

//                 {order.status === "cancelled" && (
//                   <p className="mt-4 font-semibold text-red-500">
//                     Order cancelled by buyer
//                   </p>
//                 )}

//               </div>

//             ))}

//           </div>

//         </div>

//       </div>
//     </>
//   )
// }

import { useEffect, useState } from "react"
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  where
} from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"

export default function Orders() {

  const { user } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchOrders = async () => {
    if (!user) return

    const q = query(
      collection(db, "orders"),
      where("sellerId", "==", user.uid)
    )

    const snap = await getDocs(q)

    const docs = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))

    docs.sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() || 0) -
        (a.createdAt?.toMillis?.() || 0)
    )

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

  const getStatusColor = status => {
    if (status === "placed")
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"

    if (status === "shipped")
      return "bg-blue-500/20 text-blue-300 border border-blue-400/30"

    if (status === "delivered")
      return "bg-green-500/20 text-green-300 border border-green-400/30"

    if (status === "cancelled")
      return "bg-red-500/20 text-red-300 border border-red-400/30"

    return "bg-gray-500/20 text-gray-300"
  }

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">

        <Sidebar
          mobileOpen={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <div className="flex-1 min-h-screen bg-[#0a0e27] p-4 md:p-8">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Orders Management
            </h1>
            <p className="text-gray-400 mt-1">
              Track and manage your customer orders
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-20 text-gray-400">
              Loading orders...
            </div>
          )}

          {/* EMPTY */}
          {!loading && orders.length === 0 && (
            <div className="bg-[#0b102b]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-white">
                No Orders Found
              </h3>
              <p className="text-gray-400 mt-2">
                Orders will appear here once customers buy products.
              </p>
            </div>
          )}

          {/* ORDERS LIST */}
          <div className="space-y-6">

            {orders.map(order => (

              <div
                key={order.id}
                className="bg-[#0b102b]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:border-cyan-400/30 transition-all duration-300 p-6"
              >

                {/* TOP ROW */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>
                    <p className="font-semibold text-white">
                      {order.buyerEmail}
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-lg font-bold text-cyan-400">
                    ₹{order.total}
                  </div>

                </div>

                {/* ITEMS */}
                <div className="mt-4">
                  <p className="font-semibold text-gray-300 mb-1">
                    Items
                  </p>

                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity ?? 1}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ACTION BUTTONS */}
                {order.status !== "cancelled" && (

                  <div className="mt-5 flex flex-wrap gap-3">

                    {/* PLACED */}
                    <button
                      onClick={() => updateStatus(order.id, "placed")}
                      className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                        order.status === "placed"
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg"
                          : "bg-[#1a1f3a] text-gray-300 hover:bg-[#2d3561]"
                      }`}
                    >
                      Placed
                    </button>

                    {/* SHIPPED */}
                    <button
                      onClick={() => updateStatus(order.id, "shipped")}
                      className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                        order.status === "shipped"
                          ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-black shadow-lg"
                          : "bg-[#1a1f3a] text-gray-300 hover:bg-[#2d3561]"
                      }`}
                    >
                      Shipped
                    </button>

                    {/* DELIVERED */}
                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                        order.status === "delivered"
                          ? "bg-gradient-to-r from-green-400 to-emerald-400 text-black shadow-lg"
                          : "bg-[#1a1f3a] text-gray-300 hover:bg-[#2d3561]"
                      }`}
                    >
                      Delivered
                    </button>

                  </div>

                )}

                {order.status === "cancelled" && (
                  <p className="mt-4 font-semibold text-red-400">
                    Order cancelled by buyer
                  </p>
                )}

              </div>

            ))}

          </div>

        </div>

      </div>
    </>
  )
}
