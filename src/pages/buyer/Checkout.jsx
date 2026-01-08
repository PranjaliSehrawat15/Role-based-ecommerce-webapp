import Navbar from "../../components/layout/Navbar"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useAuth } from "../../context/AuthContext"

export default function Checkout() {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-gray-500">
          Your cart is empty.
        </div>
      </>
    )
  }

  const placeOrder = async () => {
    await addDoc(collection(db, "orders"), {
      buyerId: user.uid,
      buyerEmail: user.email,
      items: cart.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image || ""
      })),
      total,
      status: "placed",
      createdAt: serverTimestamp()
    })

    alert("Order placed successfully!")
    navigate("/orders")
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="space-y-4">
          {cart.map(item => (
            <div
              key={item.id}
              className="flex gap-4 items-center border p-4 rounded"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 flex justify-between">
          <h2 className="text-xl font-semibold">
            Total: ₹{total}
          </h2>

          <button
            onClick={placeOrder}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  )
}
