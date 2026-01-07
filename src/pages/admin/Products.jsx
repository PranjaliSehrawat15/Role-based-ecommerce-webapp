import { useEffect, useState } from "react"
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import { useNavigate } from "react-router-dom"

export default function Products() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  const fetchProducts = async () => {
    const q = query(
      collection(db, "products"),
      where("createdBy", "==", user.uid)
    )
    const snap = await getDocs(q)
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return
    await deleteDoc(doc(db, "products", id))
    fetchProducts()
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-xl shadow">
                <div className="h-32 bg-gray-200 rounded mb-3" />
                <h3 className="font-semibold">{p.name}</h3>
                <p>₹{p.price}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                    className="flex-1 border py-1 rounded hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
