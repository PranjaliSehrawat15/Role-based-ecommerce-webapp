import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"

export default function Products() {
  const [products, setProducts] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchProducts = async () => {
    if (!user) return
    // 🔥 Get only CURRENT SELLER's products
    const productQuery = query(
      collection(db, "products"),
      where("sellerId", "==", user.uid)
    )
    const snap = await getDocs(productQuery)
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    fetchProducts()
  }, [location.key, user])

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return
    await deleteDoc(doc(db, "products", id))
    fetchProducts()
  }

  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900">My Products</h2>
            <button
              onClick={() => navigate("/admin/products/new")}
              className="btn"
            >
              ➕ Add New Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first product</p>
              <button
                onClick={() => navigate("/admin/products/new")}
                className="btn"
              >
                Add First Product
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={p.name}
                    className="h-40 w-full object-cover bg-gray-100"
                  />

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{p.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{p.category}</p>
                    <p className="text-lg font-bold text-black mb-4">₹{p.price}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        className="flex-1 btn-secondary py-2 text-sm rounded-lg"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                      >
                        🗑️ Delete
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
