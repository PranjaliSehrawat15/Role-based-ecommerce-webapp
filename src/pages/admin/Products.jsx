
// import { useEffect, useState } from "react"
// import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
// import { db } from "../../firebase/firebase"
// import { useNavigate, useLocation } from "react-router-dom"
// import { useAuth } from "../../context/AuthContext"
// import Navbar from "../../components/layout/Navbar"
// import Sidebar from "../../components/layout/Sidebar"

// export default function Products() {

//   const [products, setProducts] = useState([])
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()

//   const fetchProducts = async () => {
//     if (!user) return

//     const q = query(
//       collection(db, "products"),
//       where("sellerId", "==", user.uid)
//     )

//     const snap = await getDocs(q)
//     setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//   }

//   useEffect(() => {
//     fetchProducts()
//     setSidebarOpen(false)   // ✅ route change par close
//   }, [location.key, user])

//   const handleDelete = async id => {
//     if (!window.confirm("Delete this product?")) return

//     await deleteDoc(doc(db, "products", id))
//     fetchProducts()
//   }

//   return (
//     <>
//       {/* ✅ SAME STANDARD */}
//       <Navbar onMenuClick={() => setSidebarOpen(true)} />
//       <div className=" bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#020617] min-h-screen">
//       <div className="flex relative">

//         <Sidebar
//           mobileOpen={sidebarOpen}
//           close={() => setSidebarOpen(false)}
//         />

//         <div className="flex-1 p-4 md:p-8">

//           <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
//             <h2 className="text-3xl text-white font-bold">My Products</h2>

//             <button
//               onClick={() => navigate("/admin/products/new")}
//               className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold"
//             >
//               ➕ Add New Product
//             </button>
//           </div>

//           {products.length === 0 ? (
//             <div className=" backdrop-blur-xl border-white/20 rounded-xl p-10 text-center shadow">
//               <h3 className="text-xl text-white/90 font-bold mb-2">No products yet</h3>
//               <button
//                 onClick={() => navigate("/admin/products/new")}
//                 className="btn"
//               >
//                 Add Product
//               </button>
//             </div>
//           ) : (

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//               {products.map(p => (
//                // <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden">
//                 <div key={p.id} className="
// backdrop-blur-xl 
// border border-white/20 
// rounded-2xl 
// shadow-xl 
// p-6
// hover:border-cyan-400/40
// hover:shadow-[0_0_25px_rgba(0,212,255,0.25)]
// transition">

//                   <img
//                     src={p.image || "https://via.placeholder.com/300"}
//                     className="h-40 w-full object-cover"
//                   />

//                   <div className="p-4">
//                     <h3 className="text-white/90 font-bold">{p.name}</h3>
//                     <p className="text-sm text-gray-400">{p.category}</p>
//                     <p className="text-white/90 font-bold mt-2">₹{p.price}</p>

//                     <div className="flex gap-2 mt-4">

//                       <button
//                         onClick={() => navigate(`/admin/products/edit/${p.id}`)}
//                         className="flex-1 bg-indigo-100 py-2 rounded"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(p.id)}
//                         className="flex-1 bg-red-500 text-white py-2 rounded"
//                       >
//                         Delete
//                       </button>

//                     </div>
//                   </div>

//                 </div>
//               ))}

//             </div>

//           )}

//         </div>
//       </div>
//       </div>
//     </>
//   )
// }

import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"

export default function Products() {

  const [products, setProducts] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchProducts = async () => {
    if (!user) return

    const q = query(
      collection(db, "products"),
      where("sellerId", "==", user.uid)
    )

    const snap = await getDocs(q)
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    fetchProducts()
    setSidebarOpen(false)
  }, [location.key, user])

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return

    await deleteDoc(doc(db, "products", id))
    fetchProducts()
  }

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex relative">

        <Sidebar
          mobileOpen={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        {/* MAIN CONTENT */}
        <div className="flex-1 p-4 md:p-8 bg-gray-100 min-h-screen">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                My Products
              </h2>
              <p className="text-sm text-gray-500">
                Manage your listed products
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/products/new")}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
            >
              ➕ Add New Product
            </button>

          </div>

          {/* EMPTY STATE */}
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow">

              <h3 className="text-xl font-bold mb-2">
                No products yet 🚀
              </h3>

              <p className="text-gray-500 mb-4">
                Start selling by adding your first product
              </p>

              <button
                onClick={() => navigate("/admin/products/new")}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold"
              >
                Add Product
              </button>

            </div>
          ) : (

        
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {products.map(p => (

                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group"
                >

                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={p.image || "https://via.placeholder.com/300"}
                      className="h-44 w-full object-cover group-hover:scale-105 transition duration-300"
                      alt={p.name}
                    />

                    {/* PRICE BADGE */}
                    <span className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      ₹{p.price}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="font-bold text-lg truncate">
                      {p.name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                      {p.category}
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3">

                      <button
                        onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        className="flex-1 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition"
                      >
                        ✏ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </>
  )
}
