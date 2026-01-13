
import { useEffect, useState } from "react"
import { auth, db } from "../firebase/firebase"
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithPopup,
  linkWithCredential
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const user = auth.currentUser
  const navigate = useNavigate()

  // 🔐 providers
  const providers = user.providerData.map(p => p.providerId)
  const hasGoogle = providers.includes("google.com")
  const hasPassword = providers.includes("password")

  // 🔁 role state
  const [role, setRole] = useState(null)

  // 🔁 modal state
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 🔥 FETCH ROLE FROM FIRESTORE
  useEffect(() => {
    const fetchRole = async () => {
      const snap = await getDoc(doc(db, "users", user.uid))
      if (snap.exists()) {
        setRole(snap.data().role)
      }
    }
    fetchRole()
  }, [user.uid])

  // 🔗 link google
  const linkGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await linkWithPopup(user, provider)
      alert("Google account linked")
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  // 🔗 link email/password
  const linkEmailPassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(email, password)
      await linkWithCredential(user, credential)
      alert("Email & Password linked")
      setShowModal(false)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  // 🚀 dashboard redirect
  const goToDashboard = () => {
    if (role === "seller") navigate("/seller-dashboard")
    else navigate("/buyer-dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-105">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        <div className="space-y-2 text-sm">
          <p><b>Email:</b> {user.email}</p>
          <p><b>User ID:</b> {user.uid}</p>
          <p><b>Role:</b> {role || "loading..."}</p>
          <p><b>Auth Provider:</b> {providers.join(", ")}</p>
        </div>

        {/* 🚀 DASHBOARD BUTTON */}
        {role && (
          <button
            onClick={goToDashboard}
            className="w-full border py-2 rounded mt-4"
          >
            Go to {role === "seller" ? "Seller" : "Buyer"} Dashboard
          </button>
        )}

        {/* 🔗 LINKING BUTTONS */}
        <div className="mt-4 space-y-3">
          {hasGoogle && !hasPassword && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-black text-white py-2 rounded"
            >
              Link Email & Password
            </button>
          )}

          {hasPassword && !hasGoogle && (
            <button
              onClick={linkGoogle}
              className="w-full bg-black text-white py-2 rounded"
            >
              Link Google Account
            </button>
          )}

          <button
            onClick={() => {
              auth.signOut()
              navigate("/login")
            }}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-87.5">
            <h3 className="text-lg font-semibold mb-4">
              Link Email & Password
            </h3>

            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded mb-3"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded mb-4"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={linkEmailPassword}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Link
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

