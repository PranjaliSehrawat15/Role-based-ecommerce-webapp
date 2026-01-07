import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-3">
        <Link to="/admin" className="block font-medium">Dashboard</Link>
        <Link to="/admin/products" className="block font-medium">Products</Link>
        <Link to="/admin/products/new" className="block font-medium">Add Product</Link>
      </nav>
    </aside>
  )
}
