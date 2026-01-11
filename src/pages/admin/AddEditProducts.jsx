// import { useEffect, useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import {
//   addDoc,
//   collection,
//   doc,
//   getDoc,
//   serverTimestamp,
//   updateDoc
// } from "firebase/firestore"
// import { db } from "../../firebase/firebase"
// import Navbar from "../../components/layout/Navbar"

// export default function AddEditProducts() {
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const [loading, setLoading] = useState(false)

//   const [form, setForm] = useState({
//     name: "",
//     price: "",
//     category: "",
//     stock: "",          // ✅ STOCK ADDED
//     shortDesc: "",
//     fullDesc: "",
//     specs: "",
//     image: ""
//   })

//   const [file, setFile] = useState(null)

//   /* ================= EDIT MODE ================= */
//   useEffect(() => {
//     if (!id) return

//     const loadProduct = async () => {
//       const ref = doc(db, "products", id)
//       const snap = await getDoc(ref)

//       if (snap.exists()) {
//         const data = snap.data()
//         setForm({
//           name: data.name || "",
//           price: data.price || "",
//           category: data.category || "",
//           stock: data.stock ?? "",        // ✅ LOAD STOCK
//           shortDesc: data.shortDesc || "",
//           fullDesc: data.fullDesc || "",
//           specs: (data.specs || []).join(", "),
//           image: data.image || ""
//         })
//       }
//     }

//     loadProduct()
//   }, [id])

//   /* ================= IMAGE UPLOAD (Cloudinary) ================= */
//   const uploadImage = async () => {
//     if (!file) return form.image

//     if (!file.type.startsWith("image/")) {
//       alert("Please upload a valid IMAGE file")
//       return form.image
//     }

//     const data = new FormData()
//     data.append("file", file)
//     data.append("upload_preset", "rolecart_unsigned")

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/dn0lwg4sb/image/upload",
//       {
//         method: "POST",
//         body: data
//       }
//     )

//     const json = await res.json()

//     if (!json.secure_url) {
//       console.error("Cloudinary error:", json)
//       throw new Error("Image upload failed")
//     }

//     return json.secure_url
//   }

//   /* ================= SAVE PRODUCT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const imageUrl = await uploadImage()

//       const payload = {
//         name: form.name,
//         price: Number(form.price),
//         category: form.category,
//         stock: Number(form.stock),        // ✅ SAVE STOCK
//         shortDesc: form.shortDesc,
//         fullDesc: form.fullDesc,
//         specs: form.specs.split(",").map(s => s.trim()),
//         image: imageUrl || "",
//         updatedAt: serverTimestamp()
//       }

//       if (id) {
//         await updateDoc(doc(db, "products", id), payload)
//       } else {
//         await addDoc(collection(db, "products"), {
//           ...payload,
//           createdAt: serverTimestamp()
//         })
//       }

//       navigate("/admin/products")
//     } catch (err) {
//       console.error(err)
//       alert("Something went wrong")
//     }

//     setLoading(false)
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="max-w-3xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-6">
//           {id ? "Edit Product" : "Add New Product"}
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 rounded-xl shadow space-y-4"
//         >
//           <input
//             className="input"
//             placeholder="Product Name"
//             value={form.name}
//             onChange={e => setForm({ ...form, name: e.target.value })}
//             required
//           />

//           <input
//             className="input"
//             type="number"
//             placeholder="Price"
//             value={form.price}
//             onChange={e => setForm({ ...form, price: e.target.value })}
//             required
//           />

//           {/* ✅ STOCK INPUT */}
//           <input
//             className="input"
//             type="number"
//             min="0"
//             placeholder="Stock Quantity"
//             value={form.stock}
//             onChange={e => setForm({ ...form, stock: e.target.value })}
//             required
//           />

//           <select
//             className="input"
//             value={form.category}
//             onChange={e => setForm({ ...form, category: e.target.value })}
//             required
//           >
//             <option value="">Select Category</option>
//             <option value="Mobile">Mobile</option>
//             <option value="Laptop">Laptop</option>
//             <option value="Accessories">Accessories</option>
//             <option value="Display">Display</option>
//           </select>

//           <input
//             className="input"
//             placeholder="Short Description"
//             value={form.shortDesc}
//             onChange={e => setForm({ ...form, shortDesc: e.target.value })}
//           />

//           <textarea
//             className="input"
//             placeholder="Full Description"
//             rows="4"
//             value={form.fullDesc}
//             onChange={e => setForm({ ...form, fullDesc: e.target.value })}
//           />

//           <textarea
//             className="input"
//             placeholder="Specifications (comma separated)"
//             rows="2"
//             value={form.specs}
//             onChange={e => setForm({ ...form, specs: e.target.value })}
//           />

//           <input
//             type="file"
//             accept="image/*"
//             onChange={e => setFile(e.target.files[0])}
//           />

//           {form.image && (
//             <img
//               src={form.image}
//               alt="preview"
//               className="h-32 rounded border"
//             />
//           )}

//           <button
//             type="submit"
//             className="bg-black text-white px-6 py-2 rounded"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save Product"}
//           </button>
//         </form>
//       </div>
//     </>
//   )
// }

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"

export default function AddEditProducts() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")

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
      const snap = await getDocs(collection(db, "categories"))
      const list = snap.docs.map(d => d.data().name)
      setCategories(list)
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
  const handleAddCategory = () => {
  const value = newCategory.trim()
  if (!value) return

  // normalize
  const normalized = value.toLowerCase()

  const existing = categories.find(
    c => c.toLowerCase() === normalized
  )

  const finalCategory = existing || value

  setCategories(prev =>
    prev.some(c => c.toLowerCase() === normalized)
      ? prev
      : [...prev, value]
  )

  // 🔥 THIS IS THE IMPORTANT LINE
  setForm(prev => ({
    ...prev,
    category: finalCategory
  }))

  setNewCategory("")
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
        updatedAt: serverTimestamp()
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
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Product" : "Add Product"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input className="input" placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required />

          <input className="input" type="number" placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required />

          <input className="input" type="number" placeholder="Stock"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            required />

          {/* CATEGORY SELECT */}
        <select
  className="input"
  value={form.category || ""}
  onChange={e =>
    setForm(prev => ({ ...prev, category: e.target.value }))
  }
>
  <option value="">Select Category</option>
  {categories.map(cat => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>


          {/* ADD CATEGORY */}
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Add new category"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="bg-black text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          <input className="input" placeholder="Short description"
            value={form.shortDesc}
            onChange={e => setForm({ ...form, shortDesc: e.target.value })} />

          <textarea className="input" rows="4" placeholder="Full description"
            value={form.fullDesc}
            onChange={e => setForm({ ...form, fullDesc: e.target.value })} />

          <textarea className="input" rows="2" placeholder="Specs"
            value={form.specs}
            onChange={e => setForm({ ...form, specs: e.target.value })} />

          <input type="file" accept="image/*"
            onChange={e => setFile(e.target.files[0])} />

          {form.image && (
            <img src={form.image} alt="" className="h-32 rounded border" />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </>
  )
}
