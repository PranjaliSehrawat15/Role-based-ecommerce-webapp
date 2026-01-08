import { NavLink } from "react-router-dom"

export default function Sidebar() {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-gray-100"

  const activeClass =
    "bg-black text-white"

  return (
    <aside className="w-64 min-h-screen border-r p-4 bg-white">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/products/new"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Add Product
        </NavLink>

        {/* ✅ NEW: ORDERS LINK */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          Orders
        </NavLink>
      </nav>
    </aside>
  )
}
