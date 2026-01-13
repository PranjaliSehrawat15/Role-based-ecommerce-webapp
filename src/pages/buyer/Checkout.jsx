import { useNavigate } from "react-router-dom"
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction,
  getDoc
} from "firebase/firestore"
import Navbar from "../../components/layout/Navbar"
import { db } from "../../firebase/firebase"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

export default function Checkout() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart, total } =
    useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login again")
      return
    }

    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    try {
      // 🔥 Get seller ID from first product BEFORE transaction
      let sellerId = ""
      if (cart.length > 0) {
        const productSnap = await getDoc(doc(db, "products", cart[0].id))
        if (productSnap.exists()) {
          sellerId = productSnap.data().sellerId || ""
        }
      }

      await runTransaction(db, async (transaction) => {
        /* ================= CHECK & REDUCE STOCK ================= */
        for (const item of cart) {
          const productRef = doc(db, "products", item.id)
          const productSnap = await transaction.get(productRef)

          if (!productSnap.exists()) {
            throw new Error(`Product not found: ${item.name}`)
          }

          const currentStock = productSnap.data().stock ?? 0

          if (currentStock < item.quantity) {
            throw new Error(
              `Not enough stock for ${item.name}. Available: ${currentStock}`
            )
          }

          // 🔻 Reduce stock
          transaction.update(productRef, {
            stock: currentStock - item.quantity
          })
        }

        /* ================= CREATE ORDER ================= */
        const orderRef = doc(collection(db, "orders"))

        transaction.set(orderRef, {
          buyerId: user.uid,
          buyerEmail: user.email,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || ""
          })),
          total,
          status: "placed",
          sellerId,  // 🔥 Seller ID
          createdAt: serverTimestamp()
        })
      })

      // ✅ After successful transaction
      clearCart()
      navigate("/orders")
    } catch (error) {
      console.error("ORDER ERROR:", error)
      alert(error.message)
    }
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {cart.length === 0 && (
          <p className="text-gray-500">Your cart is empty.</p>
        )}

        <div className="space-y-6">
          {cart.map(item => (
            <div
              key={item.id}
              className="border rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="h-20 w-20 object-cover rounded"
                />

                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="border px-3 py-1 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="border px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Total: ₹{total}</h2>

            <button
              onClick={handlePlaceOrder}
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </>
  )
}
