
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  setDoc,
  query,
  where
} from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"

export default function AddEditProducts() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    shortDesc: "",
    fullDesc: "",
    specs: "",
    image: ""
  })

  const [file, setFile] = useState(null)

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"))
        const list = snap.docs.map(d => d.data().category || d.id)
        setCategories(list)
      } catch (err) {
        console.log("Categories collection doesn't exist yet")
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (!id) return

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", id))
      if (!snap.exists()) return

      const data = snap.data()

      setForm({
        name: data.name || "",
        price: data.price || "",
        stock: data.stock ?? "",
        category: data.category || "",
        shortDesc: data.shortDesc || "",
        fullDesc: data.fullDesc || "",
        specs: (data.specs || []).join(", "),
        image: data.image || ""
      })
    }

    loadProduct()
  }, [id])

  /* ================= ADD CATEGORY (FIRESTORE) ================= */
  const handleAddCategory = async () => {
    const value = newCategory.trim()
    if (!value) return

    // Check if category already exists
    const normalized = value.toLowerCase()
    const existing = categories.find(
      c => c.toLowerCase() === normalized
    )

    if (existing) {
      alert("This category already exists!")
      return
    }

    try {
      // Save to Firestore
      await setDoc(
        doc(db, "categories", value.toLowerCase()),
        { category: value, createdAt: new Date() }
      )

      // Update local state
      setCategories(prev => [...prev, value])
      setForm(prev => ({ ...prev, category: value }))
      setNewCategory("")
      alert("Category added successfully!")
    } catch (err) {
      console.error("Error adding category:", err.message, err.code)
      alert(`Failed to add category: ${err.message}`)
    }
  }

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async () => {
    if (!file) return form.image

    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "rolecart_unsigned")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dn0lwg4sb/image/upload",
      { method: "POST", body: data }
    )

    const json = await res.json()
    if (!json.secure_url) throw new Error("Upload failed")
    return json.secure_url
  }

  /* ================= SAVE PRODUCT ================= */
  const handleSubmit = async e => {
    e.preventDefault()

    if (!form.category) {
      alert("Please select or add a category")
      return
    }

    setLoading(true)

    try {
      const imageUrl = await uploadImage()

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        specs: form.specs.split(",").map(s => s.trim()),
        image: imageUrl || "",
        updatedAt: serverTimestamp(),
        sellerId: user.uid  //  ADD SELLER ID
      }

      // Save category to categories collection if it doesn't exist
      const catKey = form.category.toLowerCase()
      const existingCat = categories.find(c => c.toLowerCase() === catKey)
      if (!existingCat) {
        await setDoc(
          doc(db, "categories", catKey),
          { category: form.category, createdAt: new Date() }
        )
      }

      if (id) {
        await updateDoc(doc(db, "products", id), payload)
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp()
        })
      }

      navigate("/admin/products")
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

<div className="flex relative">

  <Sidebar
    mobileOpen={sidebarOpen}
    close={() => setSidebarOpen(false)}
  />

  <div className="flex-1 min-h-screen bg-[#0a0e27] flex justify-center items-start pt-10 px-4">

      <div className="w-full max-w-3xl">

        <h1 className="text-4xl font-bold mb-8 text-white">

          {id ? "✏️ Edit Product" : "➕ Add Product"}
        </h1>

        <div className="bg-[#0b102b]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
              <input className="input" placeholder="e.g., iPhone 15 Pro"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required />
            </div>

            {/* Price & Stock Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                <input className="input" type="number" placeholder="999"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                <input className="input" type="number" placeholder="10"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  required />
              </div>
            </div>

            {/* Category Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              
              {/* Category Select */}
              <select
                className="input mb-3"
                value={form.category || ""}
                onChange={e =>
                  setForm(prev => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">-- Select Existing Category --</option>
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>

              {/* Add New Category */}
            <div className="p-4 bg-[#0f172a]/70 backdrop-blur border border-white/10 rounded-xl">
                <p className="text-xs font-medium text-gray-300 mb-2">Add New Category</p>
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Type new category..."
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="btn-secondary px-6 rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
              <input className="input" placeholder="Brief product summary"
                value={form.shortDesc}
                onChange={e => setForm({ ...form, shortDesc: e.target.value })} />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Description</label>
              <textarea className="input" rows="4" placeholder="Detailed product information"
                value={form.fullDesc}
                onChange={e => setForm({ ...form, fullDesc: e.target.value })} />
            </div>

            {/* Specs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Specifications (comma-separated)</label>
              <textarea className="input" rows="2" placeholder="e.g., 128GB Storage, 6.1 inch Display, 48MP Camera"
                value={form.specs}
                onChange={e => setForm({ ...form, specs: e.target.value })} />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
              <input type="file" accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
              />

              {form.image && (
                <div className="mt-4">
                  <p className="text-xs text-gray-300 mb-2">Current Image:</p>
                  <img src={form.image} alt="" className="h-32 w-32 object-cover rounded-lg border border-white/10" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`btn w-full py-3 text-lg font-bold rounded-xl ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "⏳ Saving..." : id ? "💾 Update Product" : "✅ Create Product"}
            </button>
          </form>
        </div>
      </div>
      </div>
      </div>
    </>
  )
}
