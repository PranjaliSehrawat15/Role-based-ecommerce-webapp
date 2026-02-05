
// import { Link, useNavigate } from "react-router-dom"
// import { useAuth } from "../../context/AuthContext"
// import { useCart } from "../../context/CartContext"
// import { useState } from "react"
// import { auth } from "../../firebase/firebase"

// export default function Navbar({ onMenuClick }) {

//   const { user, role } = useAuth()
//   const { cart } = useCart()
//   const navigate = useNavigate()

//   const [open, setOpen] = useState(false)

//   return (
//     <header className="sticky top-0 z-50 bg-[#0a0e27]/90 backdrop-blur border-b border-[#3f4663]">

//       <div className="max-w-7xl mx-auto px-4">
//         <div className="h-16 flex items-center justify-between">

//           {/* LEFT */}
//           <div className="flex items-center gap-3">

//             {/* ✅ MOBILE HAMBURGER */}
//             {role === "seller" && (
//               <button
//                 onClick={onMenuClick}
//                 className="md:hidden p-2 rounded-lg border border-[#3f4663] text-white"
//               >
//                 ☰
//               </button>
//             )}

//             <Link to="/" className="flex items-center gap-2">
//               <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center">
//                 ⚡
//               </div>
//               <span className="font-bold text-white">RoleCart</span>
//             </Link>

//           </div>

//           {/* CENTER NAV */}
//           <nav className="hidden md:flex gap-6 text-sm">

//             {role === "seller" && (
//               <>
//                 <NavLink to="/seller-dashboard" label="Dashboard" />
//                 <NavLink to="/admin/products" label="Products" />
//                 <NavLink to="/admin/orders" label="Orders" />
//               </>
//             )}

//             {role === "buyer" && (
//               <>
//                 <NavLink to="/store" label="Store" />
//                 <NavLink to="/orders" label="Orders" />
//               </>
//             )}

//           </nav>

//           {/* RIGHT */}
//           <div className="flex items-center gap-4">

//             {/* CART */}
//             {role === "buyer" && (
//               <button onClick={() => navigate("/checkout")} className="relative">
//                 🛒
//                 {cart.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs px-2 rounded-full">
//                     {cart.length}
//                   </span>
//                 )}
//               </button>
//             )}

//             {/* PROFILE */}
//             {user && (
//               <div className="relative">

//                 <button
//                   onClick={() => setOpen(!open)}
//                   className="w-9 h-9 rounded-full bg-[#1a1f3a] border border-[#3f4663] flex items-center justify-center text-white"
//                 >
//                   {user.email.charAt(0).toUpperCase()}
//                 </button>

//                 {open && (
//                   <div className="absolute right-0 mt-2 bg-[#0f1433] border border-[#3f4663] rounded-lg w-40">

//                     <button
//                       onClick={() => navigate("/profile")}
//                       className="block w-full px-4 py-2 text-left text-gray-400 hover:bg-[#1a1f3a]"
//                     >
//                       👤 Profile
//                     </button>

//                     <button
//                       onClick={() => {
//                         auth.signOut()
//                         navigate("/login")
//                       }}
//                       className="block w-full px-4 py-2 text-left text-red-400 hover:bg-[#1a1f3a]"
//                     >
//                       ⏻ Logout
//                     </button>

//                   </div>
//                 )}
//               </div>
//             )}

//           </div>

//         </div>
//       </div>

//     </header>
//   )
// }

// function NavLink({ to, label }) {
//   return (
//     <Link
//       to={to}
//       className="text-gray-300 hover:text-cyan-400"
//     >
//       {label}
//     </Link>
//   )
// }

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { useState } from "react"
import { auth } from "../../firebase/firebase"

export default function Navbar({ onMenuClick }) {

  const { user, role } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    //<header className="sticky top-0 z-50 bg-[#0b102b]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
<header className="sticky top-0 z-50 bg-[#0b102b]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">

      <div className="max-w-7xl mx-auto px-4">

        <div className="h-16 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {role === "seller" && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-lg border border-white/20 text-white"
              >
                ☰
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                ⚡
              </div>
              <span className="font-bold text-white">RoleCart</span>
            </div>
          </div>

          {/* CENTER */}
          <nav className="hidden md:flex gap-8 text-sm">

            {role === "seller" && (
              <>
                <NavLink to="/seller-dashboard" label="Dashboard" />
                <NavLink to="/admin/products" label="Products" />
                <NavLink to="/admin/orders" label="Orders" />
              </>
            )}

          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {role === "buyer" && (
              <button onClick={() => navigate("/checkout")} className="relative text-white">
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs px-2 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {user && (
              <div className="relative">

                <button
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white"
                >
                  {user.email.charAt(0).toUpperCase()}
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#020617] border border-white/10 rounded-xl overflow-hidden shadow-xl">

                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10"
                    >
                      👤 Profile
                    </button>

                    <button
                      onClick={() => {
                        auth.signOut()
                        navigate("/login")
                      }}
                      className="block w-full px-4 py-2 text-left text-red-400 hover:bg-white/10"
                    >
                      ⏻ Logout
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  )
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="text-gray-300 hover:text-cyan-400 transition"
    >
      {label}
    </Link>
  )
}
