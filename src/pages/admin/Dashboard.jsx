import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"

export default function Dashboard() {
  const { user } = useAuth()
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // 🔥 Get only CURRENT SELLER's products
        const productQuery = query(
          collection(db, "products"),
          where("sellerId", "==", user.uid)
        )
        const productSnap = await getDocs(productQuery)
        setTotalProducts(productSnap.size)

        // 🔥 Get only CURRENT SELLER's orders
        const orderQuery = query(
          collection(db, "orders"),
          where("sellerId", "==", user.uid)
        )
        const orderSnap = await getDocs(orderQuery)
        setTotalOrders(orderSnap.size)

        let revenue = 0
        orderSnap.forEach(doc => {
          revenue += doc.data().total ?? doc.data().totalAmount ?? 0
        })
        setTotalRevenue(revenue)
      } catch (err) {
        console.error(err)
      }

      setLoading(false)
    }

    fetchStats()
  }, [user])

  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="p-8 flex-1">
          <h1 className="text-4xl font-bold mb-12 text-gray-900">Dashboard</h1>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="text-gray-500">Loading dashboard...</div>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Products */}
              <div className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Products</p>
                    <h2 className="text-4xl font-bold text-black mt-3">
                      {totalProducts}
                    </h2>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>

              {/* Total Orders */}
              <div className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                    <h2 className="text-4xl font-bold text-black mt-3">
                      {totalOrders}
                    </h2>
                  </div>
                  <div className="text-4xl">📋</div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                    <h2 className="text-4xl font-bold text-black mt-3">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </h2>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


