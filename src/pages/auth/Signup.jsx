
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../firebase/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("buyer")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <input
          className="input"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <select
          className="input"
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="btn w-full"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p
          className="text-center text-sm text-black hover:underline cursor-pointer pt-4"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  )
}


