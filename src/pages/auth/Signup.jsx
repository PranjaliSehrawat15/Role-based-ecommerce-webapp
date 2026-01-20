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
    <>
      {/* 🔥 Autofill Dark Mode Fix */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        select:-webkit-autofill {
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: 0 0 0px 1000px #0f172a inset !important;
          caret-color: white;
        }
      `}</style>

      {/* 🌌 Background */}
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#020617]">

        {/* 💎 Glass Signup Card */}
        <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-white mb-1">
            Create Account 🚀
          </h2>

          <p className="text-center text-gray-400 mb-6">
            Join RoleCart and start your journey
          </p>

          {/* EMAIL */}
          <input
            className="w-full px-4 py-3 mb-4 rounded-xl bg-[#0f172a] border border-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
          />

          {/* PASSWORD */}
          <input
            className="w-full px-4 py-3 mb-4 rounded-xl bg-[#0f172a] border border-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {/* ROLE SELECT */}
          <select
            className="w-full px-4 py-3 mb-5 rounded-xl bg-[#0f172a] border border-[#1f2937] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer"
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="buyer">🛒 Buyer</option>
            <option value="seller">🏪 Seller</option>
          </select>

          {/* SIGNUP BUTTON */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition shadow-lg mb-4"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* LOGIN LINK */}
          <p
            className="text-center text-sm text-cyan-400 hover:underline cursor-pointer pt-3"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </p>

        </div>
      </div>
    </>
  )
}
