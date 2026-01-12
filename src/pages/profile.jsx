import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { auth } from "../firebase/firebase"
import { signOut } from "firebase/auth"
import Navbar from "../components/layout/Navbar"
import { GoogleAuthProvider, linkWithPopup } from "firebase/auth"

export default function Profile() {
  const { user, role } = useAuth()
  const navigate = useNavigate()

const providers = user.providerData.map(p => p.providerId)

const hasGoogle = providers.includes("google.com")
const hasPassword = providers.includes("password")
const linkGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    await linkWithPopup(user, provider)
    alert("Google account linked successfully 🎉")
    window.location.reload()
  } catch (err) {
    alert(err.message)
  }
}


  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  if (!user) return null

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow p-6 space-y-4">

          <h2 className="text-2xl font-bold text-center">
            My Profile
          </h2>

          {/* USER INFO */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="capitalize font-medium">{role}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">User ID</span>
              <span className="truncate max-w-45 text-right">
                {user.uid}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Auth Provider</span>
              <span className="font-medium">
                {user.providerData.map(p => p.providerId).join(", ")}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 space-y-2">
            {role === "seller" && (
              <button
                onClick={() => navigate("/admin")}
                className="w-full border py-2 rounded hover:bg-gray-100"
              >
                Go to Seller Dashboard
              </button>
            )}

            {role === "buyer" && (
              <button
                onClick={() => navigate("/store")}
                className="w-full border py-2 rounded hover:bg-gray-100"
              >
                Go to Store
              </button>
            )}
{!hasGoogle && (
  <button
    onClick={linkGoogle}
    className="w-full border px-4 py-2 rounded"
  >
    🔗 Link Google Account
  </button>
)}

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
