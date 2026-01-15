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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <input
          className="input"
          placeholder="Email"
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

        <button
          onClick={loginEmail}
          disabled={loading}
          className="btn w-full"
        >
          {loading ? "Signing in..." : "Login with Email"}
        </button>

        <button
          onClick={loginGoogle}
          disabled={loading}
          className="btn-outline w-full"
        >
          Continue with Google
        </button>

        <p
          className="text-center text-sm text-black hover:underline cursor-pointer pt-4"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? Create one
        </p>
      </div>
    </div>
  )
}
