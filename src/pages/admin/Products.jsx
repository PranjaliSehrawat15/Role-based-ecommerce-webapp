// import { useEffect, useState } from "react"
// import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
// import { db } from "../../firebase/firebase"
// import { useNavigate } from "react-router-dom"
// import Navbar from "../../components/layout/Navbar"

// export default function Products() {
//   const [products, setProducts] = useState([])
//   const navigate = useNavigate()

//   const fetchProducts = async () => {
//     const snap = await getDocs(collection(db, "products"))
//     setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//   }

//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   const handleDelete = async id => {
//     if (!window.confirm("Delete this product?")) return
//     await deleteDoc(doc(db, "products", id))
//     fetchProducts()
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="p-6">
//         <h2 className="text-2xl font-semibold mb-6">My Products</h2>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map(p => (
//             <div
//               key={p.id}
//               className="border rounded-xl p-4 bg-white shadow"
//             >
//               <img
//                 src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
//                  alt={p.name}
//                   className="h-40 w-full object-cover rounded mb-3"
//               />


//               <h3 className="font-semibold">{p.name}</h3>
//               <p className="text-gray-600">₹{p.price}</p>
//               <p className="text-sm text-gray-500">{p.category}</p>

//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={() => navigate(`/admin/products/edit/${p.id}`)}
//                   className="border px-4 py-1 rounded"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(p.id)}
//                   className="bg-red-500 text-white px-4 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   )
// }

import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"

export default function Products() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const location = useLocation() // ✅ IMPORTANT

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"))
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  // ✅ REFRESH PRODUCTS WHEN PAGE IS REVISITED
  useEffect(() => {
    fetchProducts()
  }, [location.key]) // 🔥 THIS IS THE FIX

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return
    await deleteDoc(doc(db, "products", id))
    fetchProducts()
  }

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">My Products</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              className="border rounded-xl p-4 bg-white shadow"
            >
              <img
                src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-3"
              />

              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-gray-600">₹{p.price}</p>
              <p className="text-sm text-gray-500">{p.category}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                  className="border px-4 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
