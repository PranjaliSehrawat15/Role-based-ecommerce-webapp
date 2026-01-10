
import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  // ✅ Load cart from localStorage on first render
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  // ✅ Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // ✅ ADD TO CART
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)

      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // ✅ INCREASE QUANTITY
  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    )
  }

  // ✅ DECREASE QUANTITY
  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(p =>
          p.id === id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter(p => p.quantity > 0)
    )
  }

  // ✅ REMOVE ITEM
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id))
  }

  // ✅ CLEAR CART (order placed)
  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  // ✅ TOTAL PRICE
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
