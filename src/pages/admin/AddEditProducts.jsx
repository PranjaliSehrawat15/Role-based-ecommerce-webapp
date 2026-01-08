// import { useEffect, useState } from "react"
// import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"
// import { db } from "../../firebase/firebase"
// import { useAuth } from "../../context/AuthContext"
// import { useNavigate, useParams } from "react-router-dom"
// import Navbar from "../../components/layout/Navbar"
// import Sidebar from "../../components/layout/Sidebar"
// import Input from "../../components/ui/Input"
// import Button from "../../components/ui/Button"

// export default function AddEditProducts() {
//   const { user } = useAuth()
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const [name, setName] = useState("")
//   const [price, setPrice] = useState("")
//   const [category, setCategory] = useState("")
//   const [description, setDescription] = useState("")
//   const [image, setImage] = useState(null)
//   const [imageUrl, setImageUrl] = useState("")
//   const [uploading, setUploading] = useState(false)

//   // 🔹 Cloudinary upload
//   const uploadImage = async () => {
//     if (!image) return imageUrl

//     const formData = new FormData()
//     formData.append("file", image)
//     formData.append("upload_preset", "rolecart_unsigned") 
//     setUploading(true)

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/dn0lwg4sb/image/upload", 
//       {
//         method: "POST",
//         body: formData,
//       }
//     )

//     const data = await res.json()
//     setUploading(false)

//     return data.secure_url
//   }

//   // 🔹 Edit mode
//   useEffect(() => {
//     if (id) {
//       const fetchProduct = async () => {
//         const snap = await getDoc(doc(db, "products", id))
//         if (snap.exists()) {
//           const p = snap.data()
//           setName(p.name)
//           setPrice(p.price)
//           setCategory(p.category)
//           setDescription(p.description)
//           setImageUrl(p.imageUrl || "")
//         }
//       }
//       fetchProduct()
//     }
//   }, [id])

//   const handleSave = async () => {
//     if (!name || !price) return alert("Name & price required")

//     const finalImageUrl = await uploadImage()

//     if (id) {
//       await updateDoc(doc(db, "products", id), {
//         name,
//         price: Number(price),
//         category,
//         description,
//         imageUrl: finalImageUrl,
//       })
//       alert("Product updated")
//     } else {
//       await addDoc(collection(db, "products"), {
//         name,
//         price: Number(price),
//         category,
//         description,
//         imageUrl: finalImageUrl,
//         createdBy: user.uid,
//         createdAt: Date.now(),
//       })
//       alert("Product added")
//     }

//     navigate("/admin/products")
//   }

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1">
//         <Navbar />

//         <div className="p-6 max-w-md space-y-3">
//           <h2 className="text-xl font-bold">
//             {id ? "Edit Product" : "Add Product"}
//           </h2>

//           <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
//           <Input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
//           <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
//           <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

//           {/* Image input */}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={e => setImage(e.target.files[0])}
//           />

//           {/* Preview */}
//           {imageUrl && !image && (
//             <img
//               src={imageUrl}
//               alt="preview"
//               className="h-32 rounded"
//             />
//           )}

//           {uploading && <p className="text-sm text-gray-500">Uploading image…</p>}

//           <Button onClick={handleSave}>
//             {id ? "Update Product" : "Save Product"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"

export default function AddEditProducts() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    shortDesc: "",
    fullDesc: "",
    specs: "",
    image: ""
  })

  const [file, setFile] = useState(null)

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (!id) return

    const loadProduct = async () => {
      const ref = doc(db, "products", id)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        const data = snap.data()
        setForm({
          name: data.name || "",
          price: data.price || "",
          category: data.category || "",
          shortDesc: data.shortDesc || "",
          fullDesc: data.fullDesc || "",
          specs: (data.specs || []).join(", "),
          image: data.image || ""
        })
      }
    }

    loadProduct()
  }, [id])

  /* ================= IMAGE UPLOAD (Cloudinary) ================= */
const uploadImage = async () => {
  if (!file) return form.image

  // ❗ only allow images
  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid IMAGE file (jpg, png, webp)")
    return form.image
  }

  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", "rolecart_unsigned")

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dn0lwg4sb/image/upload",
    {
      method: "POST",
      body: data
    }
  )

  const json = await res.json()

  if (!json.secure_url) {
    console.error("Cloudinary error:", json)
    throw new Error("Image upload failed")
  }

  return json.secure_url
}

  /* ================= SAVE PRODUCT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const imageUrl = await uploadImage()

      const payload = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        shortDesc: form.shortDesc,
        fullDesc: form.fullDesc,
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
          {id ? "Edit Product" : "Add New Product"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            className="input"
            placeholder="Product Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />

          <select
            className="input"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            <option value="Mobile">Mobile</option>
            <option value="Laptop">Laptop</option>
            <option value="Accessories">Accessories</option>
            <option value="Display">Display</option>
          </select>

          <input
            className="input"
            placeholder="Short Description"
            value={form.shortDesc}
            onChange={e => setForm({ ...form, shortDesc: e.target.value })}
          />

          <textarea
            className="input"
            placeholder="Full Description"
            rows="4"
            value={form.fullDesc}
            onChange={e => setForm({ ...form, fullDesc: e.target.value })}
          />

          <textarea
            className="input"
            placeholder="Specifications (comma separated)"
            rows="2"
            value={form.specs}
            onChange={e => setForm({ ...form, specs: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
          />

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="h-32 rounded border"
            />
          )}

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </>
  )
}
