
// import { useEffect, useState } from "react"
// import { collection, getDocs, query, where } from "firebase/firestore"
// import { db } from "../../firebase/firebase"
// import { useAuth } from "../../context/AuthContext"
// import Navbar from "../../components/layout/Navbar"
// import Sidebar from "../../components/layout/Sidebar"

// export default function Dashboard() {

//   const { user } = useAuth()

//   // ✅ Sidebar control (mobile)
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const [totalProducts, setTotalProducts] = useState(0)
//   const [totalOrders, setTotalOrders] = useState(0)
//   const [totalRevenue, setTotalRevenue] = useState(0)

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!user) return

//       try {
//         // PRODUCTS
//         const productQuery = query(
//           collection(db, "products"),
//           where("sellerId", "==", user.uid)
//         )

//         const productSnap = await getDocs(productQuery)
//         setTotalProducts(productSnap.size)

//         // ORDERS
//         const orderQuery = query(
//           collection(db, "orders"),
//           where("sellerId", "==", user.uid)
//         )

//         const orderSnap = await getDocs(orderQuery)
//         setTotalOrders(orderSnap.size)

//         let revenue = 0
//         orderSnap.forEach(d => {
//           revenue += d.data().total || 0
//         })

//         setTotalRevenue(revenue)

//       } catch (err) {
//         console.error("Dashboard fetch error:", err)
//       }
//     }

//     fetchStats()
//   }, [user])

//   return (
//     <>
//       {/* ✅ Hamburger connected properly */}
//       <Navbar onMenuClick={() => setSidebarOpen(true)} />

//       <div className="flex relative">

//         {/* ✅ Sidebar controlled */}
//         <Sidebar
//           mobileOpen={sidebarOpen}
//           close={() => setSidebarOpen(false)}
//         />

//         {/* MAIN CONTENT */}
//         <div className="flex-1 p-4 md:p-6 bg-gray-100 min-h-screen">

//           <h1 className="text-2xl md:text-3xl font-bold mb-8">
//             Dashboard
//           </h1>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//             <Card title="Total Products" value={totalProducts} icon="📦" />

//             <Card title="Total Orders" value={totalOrders} icon="📋" />

//             <Card
//               title="Total Revenue"
//               value={`₹${totalRevenue.toLocaleString("en-IN")}`}
//               icon="💰"
//             />

//           </div>

//         </div>

//       </div>
//     </>
//   )
// }

// function Card({ title, value, icon }) {
//   return (
//     <div className="bg-[#0f1433] text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">

//       <p className="text-gray-400 text-sm">
//         {title}
//       </p>

//       <div className="flex justify-between items-center mt-4">
//         <h2 className="text-3xl font-bold">
//           {value}
//         </h2>

//         <span className="text-3xl">
//           {icon}
//         </span>
//       </div>

//     </div>
//   )
// }
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"

export default function Dashboard() {

  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      const productSnap = await getDocs(
        query(collection(db, "products"), where("sellerId", "==", user.uid))
      )
      setTotalProducts(productSnap.size)

      const orderSnap = await getDocs(
        query(collection(db, "orders"), where("sellerId", "==", user.uid))
      )
      setTotalOrders(orderSnap.size)

      let revenue = 0
      orderSnap.forEach(d => revenue += d.data().total || 0)
      setTotalRevenue(revenue)
    }

    fetchStats()
  }, [user])

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#020617] min-h-screen">

        <Sidebar mobileOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

        <div className="flex-1 p-6">

          <h1 className="text-3xl font-bold text-white mb-8">
            Seller Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <StatCard
              title="Total Products"
              value={totalProducts}
              icon="📦"
              color="from-indigo-500 to-purple-600"
            />

            <StatCard
              title="Total Orders"
              value={totalOrders}
              icon="📋"
              color="from-cyan-500 to-blue-600"
            />

            <StatCard
              title="Revenue"
              value={`₹${totalRevenue.toLocaleString("en-IN")}`}
              icon="💰"
              color="from-emerald-500 to-green-600"
            />

          </div>

        </div>
      </div>
    </>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 shadow-xl hover:scale-[1.02] transition">

      <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${color}`} />

      <div className="relative flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <h2 className="text-3xl font-bold text-white mt-2">{value}</h2>
        </div>

        <div className="text-4xl">{icon}</div>
      </div>

    </div>
  )
}
