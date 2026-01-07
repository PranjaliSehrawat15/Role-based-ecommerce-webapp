import { useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth, db } from "../../firebase/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { role } = useAuth()
  const navigate = useNavigate()

  const loginEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log("Email login success")
    } catch (error) {
      console.error("Email login error:", error.message)
      alert(error.message)
    }
  }

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)

      const ref = doc(db, "users", res.user.uid)
      const snap = await getDoc(ref)

      if (!snap.exists()) {
        await setDoc(ref, {
          email: res.user.email,
          role: "buyer",
          provider: "google",
          createdAt: Date.now(),
        })
      }
    } catch (error) {
      console.error("Google login error:", error.message)
      alert(error.message)
    }
  }

  useEffect(() => {
    if (role === "seller") navigate("/admin")
    if (role === "buyer") navigate("/store")
  }, [role])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={loginEmail}>Login with Email</Button>

        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={loginGoogle}
        >
          Continue with Google
        </Button>
        <p className="text-sm text-center">
  Don’t have an account?{" "}
  <span
    className="text-blue-600 cursor-pointer font-medium"
    onClick={() => navigate("/signup")}
  >
    Create one
  </span>
</p>

      </div>
    </div>
  )
}
