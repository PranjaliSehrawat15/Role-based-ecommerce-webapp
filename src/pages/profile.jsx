
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

  // STATES
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

  // ---------- ACTIONS ----------

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
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const goToDashboard = () => {
    if (role === "seller") navigate("/seller-dashboard")
    else navigate("/buyer-dashboard")
  }

  // ---------- SAFE RENDER ----------

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Profile...
      </div>
    )
  }

  const providers = user.providerData.map(p => p.providerId)
  const hasGoogle = providers.includes("google.com")
  const hasPassword = providers.includes("password")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        <Card>

          {/* PROFILE */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-600">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <Button
              onClick={() => setShowUploadModal(true)}
              className="text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Change Profile Picture
            </Button>
          </div>

          {/* DETAILS */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{user.email}</span>
            </div>

            <div className="flex justify-between">
              <span>Role:</span>
              <span>{role || "Loading..."}</span>
            </div>

            <div className="flex justify-between">
              <span>Provider:</span>
              <span>{providers.join(", ")}</span>
            </div>
          </div>

          {role && (
            <Button onClick={goToDashboard} className="w-full mb-3">
              Go to {role === "seller" ? "Seller" : "Buyer"} Dashboard
            </Button>
          )}

          {hasGoogle && !hasPassword && (
            <Button onClick={() => setShowModal(true)} className="w-full mb-2">
              Link Email & Password
            </Button>
          )}

          {hasPassword && !hasGoogle && (
            <Button onClick={linkGoogle} className="w-full mb-2">
              Link Google Account
            </Button>
          )}

          <Button
            onClick={() => {
              auth.signOut()
              navigate("/login")
            }}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>

        </Card>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="max-w-sm w-full">
            <input
              type="file"
              onChange={e => setSelectedFile(e.target.files[0])}
              className="mb-4"
            />

            <div className="flex gap-2">
              <Button
                onClick={uploadProfilePicture}
                disabled={!selectedFile || uploading}
                className="flex-1"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>

              <Button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 bg-gray-200 text-black"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* LINK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="max-w-sm w-full">

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

            <Button onClick={linkEmailPassword} className="w-full mb-2">
              Link
            </Button>

            <Button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-200 text-black"
            >
              Cancel
            </Button>

          </Card>
        </div>
      )}

    </div>
  )
}
