
// import { NavLink } from "react-router-dom"

// export default function Sidebar({ mobileOpen, close }) {

//   return (
//     <>
//       {/* MOBILE OVERLAY */}
//       {mobileOpen && (
//         <div
//           onClick={close}
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//         />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`
//           fixed lg:sticky top-0 left-0
//           h-screen w-64
//           bg-[#0b102b] text-white
//           z-50
//           transform transition-transform duration-300
//           ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//         `}
//       >

//         {/* HEADER */}
//         <div className="p-6 font-bold text-lg border-b border-white/10">
//           Seller Panel
//         </div>

//         {/* MENU */}
//         <nav className="p-4 space-y-3">

//           <NavLink
//             to="/seller-dashboard"
//             onClick={close}
//             className="block px-4 py-2 rounded hover:bg-white/10"
//           >
//             📊 Dashboard
//           </NavLink>

//           <NavLink
//             to="/admin/products"
//             onClick={close}
//             className="block px-4 py-2 rounded hover:bg-white/10"
//           >
//             📦 Products
//           </NavLink>

//           <NavLink
//             to="/admin/orders"
//             onClick={close}
//             className="block px-4 py-2 rounded hover:bg-white/10"
//           >
//             📋 Orders
//           </NavLink>

//           <NavLink
//             to="/profile"
//             onClick={close}
//             className="block px-4 py-2 rounded hover:bg-white/10"
//           >
//             👤 Profile
//           </NavLink>

//         </nav>

//       </aside>
//     </>
//   )
// }

import { NavLink } from "react-router-dom"

export default function Sidebar({ mobileOpen, close }) {

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium"

  return (
    <>
      {mobileOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0
          h-screen w-64
          bg-gradient-to-b from-[#020617] to-[#0b102b]
          text-white
          z-50
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* HEADER */}
        <div className="p-6 text-xl font-bold border-b border-white/10">
          Seller Panel
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2">

          <NavLink
            to="/seller-dashboard"
            onClick={close}
            className={({ isActive }) =>
              `${linkClass} ${isActive
                ? "bg-cyan-500/20 text-cyan-300"
                : "hover:bg-white/10"}`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={close}
            className={({ isActive }) =>
              `${linkClass} ${isActive
                ? "bg-cyan-500/20 text-cyan-300"
                : "hover:bg-white/10"}`
            }
          >
            📦 Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={close}
            className={({ isActive }) =>
              `${linkClass} ${isActive
                ? "bg-cyan-500/20 text-cyan-300"
                : "hover:bg-white/10"}`
            }
          >
            📋 Orders
          </NavLink>

          <NavLink
            to="/profile"
            onClick={close}
            className={({ isActive }) =>
              `${linkClass} ${isActive
                ? "bg-cyan-500/20 text-cyan-300"
                : "hover:bg-white/10"}`
            }
          >
            👤 Profile
          </NavLink>

        </nav>

      </aside>
    </>
  )
}
