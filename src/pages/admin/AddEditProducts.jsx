import { useEffect, useState } from "react"
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function AddEditProducts() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const snap = await getDoc(doc(db, "products", id))
        if (snap.exists()) {
          const p = snap.data()
          setName(p.name)
          setPrice(p.price)
          setCategory(p.category)
          setDescription(p.description)
        }
      }
      fetchProduct()
    }
  }, [id])

  const handleSave = async () => {
    if (!name || !price) return alert("Name & price required")

    if (id) {
      await updateDoc(doc(db, "products", id), {
        name,
        price: Number(price),
        category,
        description,
      })
      alert("Product updated")
    } else {
      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        category,
        description,
        createdBy: user.uid,
        createdAt: Date.now(),
      })
      alert("Product added")
    }

    navigate("/admin/products")
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6 max-w-md space-y-3">
          <h2 className="text-xl font-bold">
            {id ? "Edit Product" : "Add Product"}
          </h2>

          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
          <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

          <Button onClick={handleSave}>
            {id ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </div>
    </div>
  )
}
