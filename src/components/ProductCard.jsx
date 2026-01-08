import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
     <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer"
      >
        <img
  src={product.image || "https://via.placeholder.com/400x250?text=No+Image"}
  alt={product.name}
  className="h-48 w-full object-cover rounded"
/>



        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600">₹{product.price}</p>
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>

      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-black text-white py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}