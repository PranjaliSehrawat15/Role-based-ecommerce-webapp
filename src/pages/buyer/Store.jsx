import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"
import ProductCard from "../../components/ProductCard"

export default function Store() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"))
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchProducts()
  }, [])

  return (
    <>
      <Navbar />
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  )
}
