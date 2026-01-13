
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
  const navigate = useNavigate()

  const loginEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/profile")
    } catch {
      alert("Invalid email or password")
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

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

        <button
          onClick={loginEmail}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Login with Email
        </button>

        <button
          onClick={loginGoogle}
          className="w-full bg-red-500 text-white py-2 rounded-lg"
        >
          Continue with Google
        </button>

        <p
          className="text-center text-sm text-blue-600 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account? Create one
        </p>
      </div>
    </div>
  )
}
