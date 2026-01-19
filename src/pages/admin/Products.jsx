
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
    setSidebarOpen(false)   // ✅ route change par close
  }, [location.key, user])

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return

    await deleteDoc(doc(db, "products", id))
    fetchProducts()
  }

  return (
    <>
      {/* ✅ SAME STANDARD */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex relative">

        <Sidebar
          mobileOpen={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        <div className="flex-1 p-4 md:p-8">

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold">My Products</h2>

            <button
              onClick={() => navigate("/admin/products/new")}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold"
            >
              ➕ Add New Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow">
              <h3 className="text-xl font-bold mb-2">No products yet</h3>
              <button
                onClick={() => navigate("/admin/products/new")}
                className="btn"
              >
                Add Product
              </button>
            </div>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {products.map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden">

                  <img
                    src={p.image || "https://via.placeholder.com/300"}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.category}</p>
                    <p className="font-bold mt-2">₹{p.price}</p>

                    <div className="flex gap-2 mt-4">

                      <button
                        onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        className="flex-1 bg-indigo-100 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded"
                      >
                        Delete
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

