import { useCart } from "../../context/CartContext"
import Navbar from "../../components/layout/Navbar"

export default function Checkout() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart()

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-gray-500">
          Cart is empty
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Checkout</h2>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>₹{item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="px-2 border"
              >
                -
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                className="px-2 border"
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="text-right font-bold text-xl">
          Total: ₹{total}
        </div>

        <button
          onClick={() => {
            alert("Order placed successfully!")
            clearCart()
          }}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </>
  )
}
