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

  // ❌ LOGIC SAME (NO CHANGE)
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

  // ✅ ONLY UI UPDATED
  return (

    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[350px] h-[350px] bg-purple-600/30 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

        <h2 className="text-3xl font-bold text-center text-white mb-1">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-400 text-sm mb-6">
          Login to continue to RoleCart
        </p>

        {/* EMAIL */}
       <input
  type="email"
  name="email"
  autoComplete="email"
  className="w-full px-4 py-3 mb-4 rounded-lg 
  bg-[#0f172a] text-white placeholder-gray-400 
  border border-[#1f2937]
  focus:outline-none focus:ring-2 focus:ring-cyan-400"
  placeholder="Email"
  onChange={(e) => setEmail(e.target.value)}
  disabled={loading}
/>



        {/* PASSWORD */}
     <input
  type="password"
  name="password"
  autoComplete="current-password"
  className="w-full px-4 py-3 mb-5 rounded-lg 
  bg-[#0f172a] text-white placeholder-gray-400 
  border border-[#1f2937]
  focus:outline-none focus:ring-2 focus:ring-cyan-400"
  placeholder="Password"
  onChange={(e) => setPassword(e.target.value)}
  disabled={loading}
/>

        {/* LOGIN BTN */}
        <button
          onClick={loginEmail}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:scale-[1.02] transition shadow-lg"
        >
          {loading ? "Signing in..." : "Login with Email"}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-[1px] bg-white/20"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-white/20"></div>
        </div>

        {/* GOOGLE BTN */}
        <button
          onClick={loginGoogle}
          disabled={loading}
          className="w-full py-3 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition font-semibold"
        >
          Continue with Google
        </button>

        {/* SIGNUP */}
        <p
          className="text-center text-sm text-cyan-400 hover:underline cursor-pointer mt-6"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? Create one
        </p>

      </div>

    </div>
  )
}
