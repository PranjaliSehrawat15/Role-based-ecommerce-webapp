// import { NavLink } from "react-router-dom"

// export default function Sidebar() {
//   return (
//     <aside className="w-64 min-h-screen bg-white border-r border-gray-100 p-4 sticky top-0">
//       <h2 className="text-2xl font-bold mb-8 text-gray-900">Admin</h2>

//       <nav className="space-y-1">
//         <NavLink
//           to="/admin"
//           className={({ isActive }) =>
//             `block px-4 py-3 rounded-xl font-medium transition-all ${
//               isActive
//                 ? "bg-black text-white shadow-sm"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`
//           }
//         >
//           📊 Dashboard
//         </NavLink>

//         <NavLink
//           to="/admin/products"
//           className={({ isActive }) =>
//             `block px-4 py-3 rounded-xl font-medium transition-all ${
//               isActive
//                 ? "bg-black text-white shadow-sm"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`
//           }
//         >
//           📦 Products
//         </NavLink>

//         <NavLink
//           to="/admin/products/new"
//           className={({ isActive }) =>
//             `block px-4 py-3 rounded-xl font-medium transition-all ${
//               isActive
//                 ? "bg-black text-white shadow-sm"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`
//           }
//         >
//           ➕ Add Product
//         </NavLink>

//         <NavLink
//           to="/admin/orders"
//           className={({ isActive }) =>
//             `block px-4 py-3 rounded-xl font-medium transition-all ${
//               isActive
//                 ? "bg-black text-white shadow-sm"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`
//           }
//         >
//           📋 Orders
//         </NavLink>
//       </nav>
//     </aside>
//   )
// }

import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#0f1433] border-r border-[#3f4663] hidden md:block">
      <div className="p-6">
        {/* TITLE */}
        <h2 className="text-xl font-extrabold text-[#e5e7eb] mb-8 tracking-wide">
          Seller Panel
        </h2>

        {/* NAV */}
        <nav className="space-y-2">
          <SideItem to="/seller-dashboard" label="Dashboard" icon="📊" />
          <SideItem to="/admin/products" label="Products" icon="📦" />
          <SideItem to="/admin/orders" label="Orders" icon="🧾" />
          <SideItem to="/profile" label="Profile" icon="👤" />
        </nav>
      </div>
    </aside>
  )
}

/* ===== Sidebar Item ===== */

function SideItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-[#1a1f3a] text-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.25)]"
            : "text-[#9ca3af] hover:bg-[#1a1f3a] hover:text-[#e5e7eb]"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </NavLink>
  )
}
