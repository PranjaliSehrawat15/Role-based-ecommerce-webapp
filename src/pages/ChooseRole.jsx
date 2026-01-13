import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../firebase/firebase"
import { doc, setDoc } from "firebase/firestore"

export default function ChooseRole() {
  const [role, setRole] = useState("buyer")
  const navigate = useNavigate()

  const saveRole = async () => {
    const user = auth.currentUser
    if (!user) return

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role,
      providers: user.providerData.map(p => p.providerId),
      createdAt: Date.now(),
    })

    navigate("/profile")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Choose Your Role</h2>

        <select
          className="w-full border px-4 py-2 rounded-lg"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button
          onClick={saveRole}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
