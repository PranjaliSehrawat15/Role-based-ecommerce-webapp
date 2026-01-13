
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../firebase/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("buyer")
  const navigate = useNavigate()

  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, "users", res.user.uid), {
        email,
        role,
        providers: ["password"],
        createdAt: Date.now(),
      })

      navigate("/profile")
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <input
          className="w-full border px-4 py-2 rounded-lg"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border px-4 py-2 rounded-lg"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border px-4 py-2 rounded-lg"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Sign Up
        </button>

        <p
          className="text-center text-sm text-blue-600 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  )
}
