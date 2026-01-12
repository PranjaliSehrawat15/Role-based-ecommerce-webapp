// import { useEffect, useState } from "react"
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   EmailAuthProvider,
//   linkWithCredential,
// } from "firebase/auth"
// import { auth, db } from "../../firebase/firebase"
// import { doc, getDoc, setDoc } from "firebase/firestore"
// import { useNavigate } from "react-router-dom"
// import { useAuth } from "../../context/AuthContext"
// import Input from "../../components/ui/Input"
// import Button from "../../components/ui/Button"

// export default function Login() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [linkMode, setLinkMode] = useState(false)

//   const { role } = useAuth()
//   const navigate = useNavigate()

//   /* ---------------- EMAIL LOGIN ---------------- */
//   const loginEmail = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password)
//       console.log("Email login success")
//     } catch (error) {
//       alert("Invalid email or password")
//     }
//   }

//   /* ---------------- GOOGLE LOGIN ---------------- */
//   const loginGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider()
//       const res = await signInWithPopup(auth, provider)

//       const ref = doc(db, "users", res.user.uid)
//       const snap = await getDoc(ref)

//       if (!snap.exists()) {
//         await setDoc(ref, {
//           email: res.user.email,
//           role: "buyer",
//           provider: "google",
//           createdAt: Date.now(),
//         })
//       }

//       // 👉 enable linking after google login
//       setLinkMode(true)
//     } catch (error) {
//       alert(error.message)
//     }
//   }

//   /* ---------------- LINK EMAIL + PASSWORD ---------------- */
//   const linkEmailPassword = async () => {
//     try {
//       const user = auth.currentUser
//       if (!user) return alert("Login with Google first")

//       const credential = EmailAuthProvider.credential(email, password)
//       await linkWithCredential(user, credential)

//       alert("Email + password linked successfully 🎉")
//       setLinkMode(false)
//     } catch (err) {
//       alert(err.message)
//     }
//   }

//   /* ---------------- REDIRECT ---------------- */
//   useEffect(() => {
//     if (role === "seller") navigate("/admin")
//     if (role === "buyer") navigate("/store")
//   }, [role])

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
//         <h2 className="text-2xl font-bold text-center">Login</h2>

//         <Input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <Input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {!linkMode && (
//           <>
//             <Button onClick={loginEmail}>Login with Email</Button>

//             <Button
//               className="bg-red-500 hover:bg-red-600"
//               onClick={loginGoogle}
//             >
//               Continue with Google
//             </Button>
//           </>
//         )}

//         {linkMode && (
//           <Button
//             className="bg-green-600 hover:bg-green-700"
//             onClick={linkEmailPassword}
//           >
//             Link Email & Password
//           </Button>
//         )}

//         <p className="text-sm text-center">
//           Don’t have an account?{" "}
//           <span
//             className="text-blue-600 cursor-pointer font-medium"
//             onClick={() => navigate("/signup")}
//           >
//             Create one
//           </span>
//         </p>
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect } from "react"
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth"
// import { auth } from "../../firebase/firebase"
// import { useNavigate } from "react-router-dom"
// import { useAuth } from "../../context/AuthContext"

// export default function Login() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const { role } = useAuth()
//   const navigate = useNavigate()

//   const loginEmail = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password)
//     } catch (err) {
//       alert(err.message)
//     }
//   }

//   const loginGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider()
//       await signInWithPopup(auth, provider)
//     } catch (err) {
//       alert(err.message)
//     }
//   }

//   useEffect(() => {
//     if (role === "seller") navigate("/admin")
//     if (role === "buyer") navigate("/store")
//   }, [role])

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white w-full max-w-md p-8 rounded-xl shadow space-y-4">

//         <h2 className="text-2xl font-bold text-center">Login</h2>

//         <input
//           className="w-full border px-4 py-2 rounded"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="w-full border px-4 py-2 rounded"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           onClick={loginEmail}
//           className="w-full bg-black text-white py-2 rounded"
//         >
//           Login with Email
//         </button>

//         <button
//           onClick={loginGoogle}
//           className="w-full bg-red-500 text-white py-2 rounded"
//         >
//           Continue with Google
//         </button>

//         <p className="text-center text-sm">
//           Don’t have an account?{" "}
//           <span
//             className="text-blue-600 cursor-pointer"
//             onClick={() => navigate("/signup")}
//           >
//             Create one
//           </span>
//         </p>

//       </div>
//     </div>
//   )
// }

import { useState } from "react"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider
} from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  /* ================= EMAIL LOGIN ================= */
  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/profile")
    } catch (err) {
      alert(err.message)
    }
  }

  /* ================= GOOGLE LOGIN + LINK ================= */
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()

    try {
      await signInWithPopup(auth, provider)
      navigate("/profile")
    } catch (err) {
      // 🔥 THIS IS THE MAIN FIX
      if (err.code === "auth/account-exists-with-different-credential") {
        const pendingCred = err.credential
        const email = err.customData.email

        // check how user signed up earlier
        const methods = await fetchSignInMethodsForEmail(auth, email)

        if (methods.includes("password")) {
          const pwd = prompt(
            "This email is already registered.\nEnter password to link Google:"
          )

          if (!pwd) return

          const userCred = await signInWithEmailAndPassword(
            auth,
            email,
            pwd
          )

          // 🔗 LINK GOOGLE WITH EMAIL ACCOUNT
          await linkWithCredential(userCred.user, pendingCred)

          alert("Google account linked successfully ✅")
          navigate("/profile")
        }
      } else {
        alert(err.message)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="w-full border px-4 py-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={loginWithEmail}
          className="w-full bg-black text-white py-2 rounded"
        >
          Login with Email
        </button>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Continue with Google
        </button>
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
