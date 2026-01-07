import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function AdminRoute({ children }) {
  const { user, role } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (role !== "seller") return <Navigate to="/store" />
  return children
}
