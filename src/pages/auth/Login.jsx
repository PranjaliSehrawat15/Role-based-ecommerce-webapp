import { useState } from "react"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth, db } from "../../firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const loginEmail = async () => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/profile")
    } catch {
      alert("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)

    const snap = await getDoc(doc(db, "users", res.user.uid))

    if (!snap.exists()) {
      navigate("/choose-role")
    } else {
      navigate("/profile")
    }
  }

  return (
<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#020617]">
<div className="w-full max-w-md p-8 space-y-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
<h2 className="text-2xl font-bold text-center text-white mb-6 tracking-wide">Login</h2>
        <input
          className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          className="w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={loginEmail}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition shadow-lg"

        >
          {loading ? "Signing in..." : "Login with Email"}
        </button>

        <button
          onClick={loginGoogle}
          disabled={loading}
          className="w-full py-3 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition font-semibold"

        >
          Continue with Google
        </button>

        <p
          className="text-center text-sm text-cyan-400 hover:underline cursor-pointer pt-4"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? Create one
        </p>
      </div>
    </div>
  )
}
