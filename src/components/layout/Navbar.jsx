// import { signOut } from "firebase/auth"
// import { auth } from "../../firebase/firebase"
// import { useNavigate } from "react-router-dom"
// import { useCart } from "../../context/CartContext"
// import { useAuth } from "../../context/AuthContext"
// import { useState } from "react"

// export default function Navbar() {
//   const navigate = useNavigate()
//   const { cart } = useCart()
//   const { role, user } = useAuth()
//   const [showProfileMenu, setShowProfileMenu] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")

//   const handleLogout = async () => {
//     await signOut(auth)
//     navigate("/login")
//   }

//   return (
//     <header className="sticky top-0 z-50 bg-[#0a0e27] border-b border-[#3f4663] shadow-lg">
//       <div className="max-w-7xl mx-auto px-6 py-3">
//         {/* Top Row */}
//         <div className="flex items-center justify-between gap-6">
//           {/* Logo */}
//           <div
//             onClick={() => navigate(role === "seller" ? "/admin" : "/store")}
//             className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
//           >
//             <div className="w-10 h-10 bg-linear-to-br from-[#7c3aed] to-[#06b6d4] rounded-lg flex items-center justify-center shadow-lg glow-purple">
//               <span className="text-white font-bold text-xl">⚡</span>
//             </div>
//             <div className="flex flex-col">
//               <h1 className="text-xl font-bold text-[#00d4ff]">RoleCart</h1>
//               <p className="text-xs text-[#9ca3af]">Premium Electronics</p>
//             </div>
//           </div>

//           {/* Search Bar - Buyer Only */}
//           {role === "buyer" && (
//             <div className="hidden md:flex flex-1 max-w-md">
//               <div className="relative w-full">
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-4 py-2.5 bg-[#1a1f3a] border border-[#3f4663] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-[#2d3561] text-[#e5e7eb] placeholder-[#9ca3af] transition-all"
//                 />
//                 <svg className="absolute right-3 top-3 w-5 h-5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>
//           )}

//           {/* Right Section */}
//           <div className="flex items-center gap-4">
//             {/* Cart - Buyer Only */}
//             {role === "buyer" && (
//               <button
//                 onClick={() => navigate("/checkout")}
//                 className="relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1f3a] transition-colors text-[#00d4ff]"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1.5}
//                     d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m10 0l2-8m-2 8h2m-10 0H5m10 0h3"
//                   />
//                 </svg>
//                 {cart.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
//                     {cart.length}
//                   </span>
//                 )}
//               </button>
//             )}

//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1a1f3a] transition-colors group text-[#e5e7eb]"
//               >
//                 <div className="w-8 h-8 bg-linear-to-br from-[#7c3aed] to-[#06b6d4] rounded-lg flex items-center justify-center shadow-md">
//                   <span className="text-white font-bold text-sm">
//                     {user?.email?.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <svg
//                   className={`w-4 h-4 text-[#9ca3af] transition-transform ${
//                     showProfileMenu ? "rotate-180" : ""
//                   }`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                   />
//                 </svg>
//               </button>

//               {/* Dropdown Menu */}
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#1a1f3a] rounded-lg shadow-xl border border-[#3f4663] py-2 z-50 animate-in fade-in slide-in-from-top-2">
//                   <div className="px-4 py-3 border-b border-[#3f4663] bg-linear-to-r from-[#7c3aed] to-[#06b6d4]">
//                     <p className="text-sm font-semibold text-white">
//                       {user?.email}
//                     </p>
//                     <p className="text-xs capitalize bg-[#0a0e27] text-[#00d4ff] px-2 py-1 rounded w-fit mt-2 font-bold border border-[#00d4ff]">
//                       {role === "seller" ? "👨‍💼 Seller" : "👤 Buyer"}
//                     </p>
//                   </div>

//                   {role === "seller" && (
//                     <>
//                       <button
//                         onClick={() => {
//                           navigate("/admin")
//                           setShowProfileMenu(false)
//                         }}
//                         className="w-full text-left px-4 py-3 text-sm text-[#e5e7eb] hover:bg-[#2d3561] transition-colors flex items-center gap-2"
//                       >
//                         📊 Dashboard
//                       </button>
//                       <button
//                         onClick={() => {
//                           navigate("/admin/products")
//                           setShowProfileMenu(false)
//                         }}
//                         className="w-full text-left px-4 py-3 text-sm text-[#e5e7eb] hover:bg-[#2d3561] transition-colors flex items-center gap-2"
//                       >
//                         📦 My Products
//                       </button>
//                       <button
//                         onClick={() => {
//                           navigate("/admin/orders")
//                           setShowProfileMenu(false)
//                         }}
//                         className="w-full text-left px-4 py-3 text-sm text-[#e5e7eb] hover:bg-[#2d3561] transition-colors flex items-center gap-2"
//                       >
//                         📋 Orders
//                       </button>
//                     </>
//                   )}

//                   {role === "buyer" && (
//                     <button
//                       onClick={() => {
//                         navigate("/orders")
//                         setShowProfileMenu(false)
//                       }}
//                       className="w-full text-left px-4 py-3 text-sm text-[#e5e7eb] hover:bg-[#2d3561] transition-colors flex items-center gap-2"
//                     >
//                       📋 My Orders
//                     </button>
//                   )}

//                   <div className="border-t border-[#3f4663] mt-2">
//                     <button
//                       onClick={() => {
//                         handleLogout()
//                         setShowProfileMenu(false)
//                       }}
//                       className="w-full text-left px-4 py-3 text-sm text-[#f87171] hover:bg-[#2d3561] transition-colors flex items-center gap-2 font-medium"
//                     >
//                       🚪 Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }


import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { useState } from "react"

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0a0e27]/80 backdrop-blur-xl border-b border-[#3f4663]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-xl font-bold">⚡</span>
            </div>
            <span className="text-xl font-bold tracking-wide text-[#e5e7eb] group-hover:text-[#00d4ff] transition-colors">
              RoleCart
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {role === "buyer" && (
              <>
                <NavLink label="Store" to="/store" />
                <NavLink label="Orders" to="/orders" />
              </>
            )}

            {role === "seller" && (
              <>
                <NavLink label="Dashboard" to="/seller-dashboard" />
                <NavLink label="Products" to="/admin/products" />
                <NavLink label="Orders" to="/admin/orders" />
              </>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* CART */}
            {role === "buyer" && (
              <button
                onClick={() => navigate("/checkout")}
                className="relative group"
              >
                <div className="px-4 py-2 rounded-lg border border-[#3f4663] text-[#e5e7eb] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all">
                  🛒
                </div>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#00d4ff] text-[#0a0e27] text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {/* PROFILE DROPDOWN */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="px-4 py-2 rounded-lg bg-[#1a1f3a] border border-[#3f4663] text-[#e5e7eb] hover:border-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] transition-all"
                >
                  👤
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-48 bg-[#0f1433] border border-[#3f4663] rounded-xl shadow-2xl overflow-hidden animate-fade-up">
                    <button
                      onClick={() => {
                        navigate("/profile")
                        setOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#e5e7eb] hover:bg-[#1a1f3a] transition-colors"
                    >
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        logout()
                        navigate("/login")
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#1a1f3a] transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE MENU */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden px-3 py-2 rounded-lg border border-[#3f4663] text-[#e5e7eb]"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ---------- Helper ---------- */

function NavLink({ label, to }) {
  return (
    <Link
      to={to}
      className="relative text-[#9ca3af] hover:text-[#e5e7eb] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-linear-to-r after:from-[#7c3aed] after:to-[#06b6d4] hover:after:w-full after:transition-all"
    >
      {label}
    </Link>
  )
}
