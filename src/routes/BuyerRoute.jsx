import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function BuyerRoute({ children }) {
  const { user, role } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (role !== "buyer") return <Navigate to="/admin" />
  return children
}
