import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

import Dashboard from "./pages/admin/Dashboard"
import Products from "./pages/admin/Products"
import AddEditProducts from "./pages/admin/AddEditProducts"

import Store from "./pages/buyer/Store"
import ProductDetails from "./pages/buyer/ProductDetails"
import Checkout from "./pages/buyer/Checkout"

import AdminRoute from "./routes/AdminRoute"
import BuyerRoute from "./routes/BuyerRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
      <Route path="/admin/products/new" element={<AdminRoute><AddEditProducts /></AdminRoute>} />
      <Route path="/admin/products/edit/:id" element={<AdminRoute><AddEditProducts /></AdminRoute>} />

      {/* Buyer */}
      <Route path="/store" element={<BuyerRoute><Store /></BuyerRoute>} />
      <Route path="/store/:id" element={<BuyerRoute><ProductDetails /></BuyerRoute>} />
      <Route path="/checkout" element={<BuyerRoute><Checkout /></BuyerRoute>} />
    </Routes>
  )
}

