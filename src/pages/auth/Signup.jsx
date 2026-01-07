import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../firebase/firebase"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("buyer")
  const navigate = useNavigate()

  const handleSignup = async () => {
    const res = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(doc(db, "users", res.user.uid), {
      email,
      role,
      provider: "email",
      createdAt: Date.now(),
    })

    navigate(role === "seller" ? "/admin" : "/store")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        <select
          className="w-full px-4 py-2 border rounded-xl"
          onChange={e => setRole(e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <Button onClick={handleSignup}>Sign Up</Button>
      </div>
    </div>
  )
}
