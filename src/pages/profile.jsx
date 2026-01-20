
// import { useEffect, useState } from "react"
// import { auth, db } from "../firebase/firebase"
// import {
//   GoogleAuthProvider,
//   EmailAuthProvider,
//   linkWithPopup,
//   linkWithCredential,
//   updateProfile
// } from "firebase/auth"
// import { doc, getDoc } from "firebase/firestore"
// import { useNavigate } from "react-router-dom"
// import Card from "../components/ui/Card"
// import Button from "../components/ui/Button"
// import Input from "../components/ui/Input"

// export default function Profile() {
//   const navigate = useNavigate()

//   // STATES
//   const [user, setUser] = useState(null)
//   const [role, setRole] = useState(null)

//   const [showModal, setShowModal] = useState(false)
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const [showUploadModal, setShowUploadModal] = useState(false)
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [uploading, setUploading] = useState(false)

//   // AUTH LISTENER
//   useEffect(() => {
//     const unsub = auth.onAuthStateChanged(currentUser => {
//       setUser(currentUser)
//     })

//     return () => unsub()
//   }, [])

//   // ROLE FETCH
//   useEffect(() => {
//     if (!user) return

//     const fetchRole = async () => {
//       const snap = await getDoc(doc(db, "users", user.uid))
//       if (snap.exists()) {
//         setRole(snap.data().role)
//       }
//     }

//     fetchRole()
//   }, [user])

//   // ---------- ACTIONS ----------

//   const linkGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider()
//       await linkWithPopup(user, provider)
//       alert("Google account linked successfully")
//       window.location.reload()
//     } catch (err) {
//       alert(err.message)
//     }
//   }

//   const linkEmailPassword = async () => {
//     try {
//       const credential = EmailAuthProvider.credential(email, password)
//       await linkWithCredential(user, credential)
//       alert("Email & Password linked successfully")
//       setShowModal(false)
//       window.location.reload()
//     } catch (err) {
//       alert(err.message)
//     }
//   }

//   // CLOUDINARY UPLOAD
//   const uploadProfilePicture = async () => {
//     if (!selectedFile) return

//     setUploading(true)

//     const formData = new FormData()
//     formData.append("file", selectedFile)
//     formData.append("upload_preset", "rolecart_unsigned")

//     try {
//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dn0lwg4sb/image/upload",
//         {
//           method: "POST",
//           body: formData
//         }
//       )

//       const data = await res.json()

//       if (!data.secure_url) throw new Error("Upload failed")

//       await updateProfile(user, {
//         photoURL: data.secure_url
//       })

//       alert("Profile picture updated!")

//       setShowUploadModal(false)
//       setSelectedFile(null)
//       window.location.reload()

//     } catch (err) {
//       alert("Upload failed")
//       console.error(err)
//     } finally {
//       setUploading(false)
//     }
//   }

//   const goToDashboard = () => {
//     if (role === "seller") navigate("/seller-dashboard")
//     else navigate("/buyer-dashboard")
//   }

//   // ---------- SAFE RENDER ----------

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading Profile...
//       </div>
//     )
//   }

//   const providers = user.providerData.map(p => p.providerId)
//   const hasGoogle = providers.includes("google.com")
//   const hasPassword = providers.includes("password")

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md">

//         <Card>

//           {/* PROFILE */}
//           <div className="text-center mb-6">
//             <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
//               {user.photoURL ? (
//                 <img
//                   src={user.photoURL}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-2xl font-bold text-gray-600">
//                   {user.email.charAt(0).toUpperCase()}
//                 </span>
//               )}
//             </div>

//             <Button
//               onClick={() => setShowUploadModal(true)}
//               className="text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
//             >
//               Change Profile Picture
//             </Button>
//           </div>

//           {/* DETAILS */}
//           <div className="space-y-3 mb-6">
//             <div className="flex justify-between">
//               <span>Email:</span>
//               <span>{user.email}</span>
//             </div>

//             <div className="flex justify-between">
//               <span>Role:</span>
//               <span>{role || "Loading..."}</span>
//             </div>

//             <div className="flex justify-between">
//               <span>Provider:</span>
//               <span>{providers.join(", ")}</span>
//             </div>
//           </div>

//           {role && (
//             <Button onClick={goToDashboard} className="w-full mb-3">
//               Go to {role === "seller" ? "Seller" : "Buyer"} Dashboard
//             </Button>
//           )}

//           {hasGoogle && !hasPassword && (
//             <Button onClick={() => setShowModal(true)} className="w-full mb-2">
//               Link Email & Password
//             </Button>
//           )}

//           {hasPassword && !hasGoogle && (
//             <Button onClick={linkGoogle} className="w-full mb-2">
//               Link Google Account
//             </Button>
//           )}

//           <Button
//             onClick={() => {
//               auth.signOut()
//               navigate("/login")
//             }}
//             className="w-full bg-red-500 hover:bg-red-600"
//           >
//             Logout
//           </Button>

//         </Card>
//       </div>

//       {/* UPLOAD MODAL */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <Card className="max-w-sm w-full">
//             <input
//               type="file"
//               onChange={e => setSelectedFile(e.target.files[0])}
//               className="mb-4"
//             />

//             <div className="flex gap-2">
//               <Button
//                 onClick={uploadProfilePicture}
//                 disabled={!selectedFile || uploading}
//                 className="flex-1"
//               >
//                 {uploading ? "Uploading..." : "Upload"}
//               </Button>

//               <Button
//                 onClick={() => setShowUploadModal(false)}
//                 className="flex-1 bg-gray-200 text-black"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* LINK MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <Card className="max-w-sm w-full">

//             <Input
//               placeholder="Email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               className="mb-3"
//             />

//             <Input
//               placeholder="Password"
//               type="password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               className="mb-3"
//             />

//             <Button onClick={linkEmailPassword} className="w-full mb-2">
//               Link
//             </Button>

//             <Button
//               onClick={() => setShowModal(false)}
//               className="w-full bg-gray-200 text-black"
//             >
//               Cancel
//             </Button>

//           </Card>
//         </div>
//       )}

//     </div>
//   )
// }

import { useEffect, useState } from "react"
import { auth, db } from "../firebase/firebase"
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithPopup,
  linkWithCredential,
  updateProfile
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"

export default function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  // AUTH LISTENER
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser)
    })
    return () => unsub()
  }, [])

  // ROLE FETCH
  useEffect(() => {
    if (!user) return

    const fetchRole = async () => {
      const snap = await getDoc(doc(db, "users", user.uid))
      if (snap.exists()) {
        setRole(snap.data().role)
      }
    }

    fetchRole()
  }, [user])

  // ACTIONS
  const linkGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await linkWithPopup(user, provider)
      alert("Google account linked successfully")
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  const linkEmailPassword = async () => {
    try {
      const credential = EmailAuthProvider.credential(email, password)
      await linkWithCredential(user, credential)
      alert("Email & Password linked successfully")
      setShowModal(false)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  // CLOUDINARY UPLOAD
  const uploadProfilePicture = async () => {
    if (!selectedFile) return

    setUploading(true)

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("upload_preset", "rolecart_unsigned")

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dn0lwg4sb/image/upload",
        {
          method: "POST",
          body: formData
        }
      )

      const data = await res.json()

      if (!data.secure_url) throw new Error("Upload failed")

      await updateProfile(user, {
        photoURL: data.secure_url
      })

      alert("Profile picture updated!")
      setShowUploadModal(false)
      setSelectedFile(null)
      window.location.reload()

    } catch (err) {
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const goToDashboard = () => {
    if (role === "seller") navigate("/seller-dashboard")
    else navigate("/buyer-dashboard")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Profile...
      </div>
    )
  }

  const providers = user.providerData.map(p => p.providerId)
  const hasGoogle = providers.includes("google.com")
  const hasPassword = providers.includes("password")

  return (

    // BACKGROUND
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#020617] px-4">

      {/* CARD */}
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

        {/* PROFILE HEADER */}
        <div className="text-center mb-6">

          <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-cyan-400">

            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-white">
                {user.email.charAt(0).toUpperCase()}
              </div>
            )}

          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="text-sm px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition"
          >
            Change Profile Picture
          </button>

        </div>

        {/* DETAILS */}
        <div className="space-y-3 text-sm text-gray-300 mb-6">

          <div className="flex justify-between">
            <span>Email</span>
            <span className="text-white">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span>Role</span>
            <span className="capitalize text-white">{role || "Loading..."}</span>
          </div>

          <div className="flex justify-between">
            <span>Provider</span>
            <span className="text-white">{providers.join(", ")}</span>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        {role && (
          <button
            onClick={goToDashboard}
            className="w-full mb-3 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 transition shadow-lg"
          >
            Go to {role === "seller" ? "Seller" : "Buyer"} Dashboard
          </button>
        )}

        {hasGoogle && !hasPassword && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full mb-3 py-2.5 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
          >
            Link Email & Password
          </button>
        )}

        {hasPassword && !hasGoogle && (
          <button
            onClick={linkGoogle}
            className="w-full mb-3 py-2.5 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
          >
            Link Google Account
          </button>
        )}

        {/* LOGOUT */}
        <button
          onClick={() => {
            auth.signOut()
            navigate("/login")
          }}
          className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-800 text-white font-semibold transition"
        >
          🚪 Logout
        </button>

      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">

          <div className="bg-[#0f172a] p-6 rounded-xl w-full max-w-sm border border-white/10">

            <input
              type="file"
              onChange={e => setSelectedFile(e.target.files[0])}
              className="mb-4 text-white"
            />

            <div className="flex gap-2">

              <button
                onClick={uploadProfilePicture}
                disabled={!selectedFile || uploading}
                className="flex-1 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>

              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-700 text-white"
              >
                Cancel
              </button>

            </div>
          </div>

        </div>
      )}

      {/* LINK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4">

          <div className="bg-[#0f172a] p-6 rounded-xl w-full max-w-sm border border-white/10">

            <Input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-3"
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mb-3"
            />

            <button
              onClick={linkEmailPassword}
              className="w-full mb-2 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
            >
              Link Account
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded-lg bg-gray-700 text-white"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  )
}
