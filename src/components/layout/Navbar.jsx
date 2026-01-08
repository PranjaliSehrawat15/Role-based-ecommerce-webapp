// import { signOut } from "firebase/auth"
// import { auth } from "../../firebase/firebase"
// import { useNavigate } from "react-router-dom"
// import { useCart } from "../../context/CartContext"

// export default function Navbar() {
//   const navigate = useNavigate()
//   const { cart } = useCart()

//   const handleLogout = async () => {
//     await signOut(auth)
//     navigate("/login")
//   }

//   return (
//     <header className="h-16 bg-white border-b flex items-center justify-between px-6">
//       <h1
//         className="text-xl font-bold cursor-pointer"
//         onClick={() => navigate("/")}
//       >
//         RoleCart
//       </h1>

//       <div className="flex items-center gap-4">
//         {/* Checkout Button */}
//         <button
//           onClick={() => navigate("/checkout")}
//           className="relative px-4 py-2 border rounded-lg hover:bg-gray-100"
//         >
//           Cart
//           {cart.length > 0 && (
//             <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
//               {cart.length}
//             </span>
//           )}
//         </button>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   )
// }


import { signOut } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

export default function Navbar() {
  const navigate = useNavigate()
  const { cart } = useCart()
  const { role } = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate(role === "seller" ? "/admin" : "/store")}
      >
        RoleCart
      </h1>

      <div className="flex items-center gap-4">
        {/* ✅ CART ONLY FOR BUYER */}
        {role === "buyer" && (
          <button
            onClick={() => navigate("/checkout")}
            className="relative px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
