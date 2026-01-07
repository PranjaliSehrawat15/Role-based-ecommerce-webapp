import { useEffect, useMemo, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Navbar from "../../components/layout/Navbar"
import ProductCard from "../../components/ProductCard"

export default function Store() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("none") // none | low | high
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
       console.log("PRODUCTS FROM FIRESTORE:", data) 
        setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean))
    return ["all", ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== "all") {
      list = list.filter(p => p.category === category)
    }
    if (sort === "low") list.sort((a, b) => a.price - b.price)
    if (sort === "high") list.sort((a, b) => b.price - a.price)
    return list
  }, [products, category, sort])

  return (
    <>
      <Navbar />

      {/* Filters */}
<div className="px-6 py-4 flex flex-wrap gap-4 items-center border-b bg-white">
  <select
    value={category}
    onChange={e => setCategory(e.target.value)}
    className="border px-3 py-2 rounded-lg"
  >
    <option value="all">All Categories</option>
    {categories
      .filter(c => c !== "all")
      .map(c => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
  </select>

  <select
    value={sort}
    onChange={e => setSort(e.target.value)}
    className="border px-3 py-2 rounded-lg"
  >
    <option value="none">Sort by Price</option>
    <option value="low">Low → High</option>
    <option value="high">High → Low</option>
  </select>
</div>


      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="text-center text-gray-500">Loading products…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-500">
            No products found.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  )
}
