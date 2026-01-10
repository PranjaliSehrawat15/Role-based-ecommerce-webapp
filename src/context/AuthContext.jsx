import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../firebase/firebase"
import { doc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser)

      if (!currentUser) {
        setRole(null)
        setLoading(false)
        return
      }

      try {
        const ref = doc(db, "users", currentUser.uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          setRole(snap.data().role)
        } else {
          setRole(null)
        }
      } catch (err) {
        console.error("AuthContext error:", err)
        setRole(null)
      }

      setLoading(false)
    })

    return () => unsub()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
