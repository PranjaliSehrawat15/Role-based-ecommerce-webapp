import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Navbar from "../../components/layout/Navbar";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProduct({
            id: snap.id,
            ...snap.data(),
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-gray-500">
          Loading product details…
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-gray-500">
          Product not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: PRODUCT IMAGE */}
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-xl object-cover"
          />
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-sm text-gray-500 mt-1">
            Category: {product.category}
          </p>

          <p className="text-2xl font-semibold mt-4">
            ₹{product.price}
          </p>

          {/* SHORT DESCRIPTION */}
          <p className="mt-4 text-gray-700">
            {product.description || "No description available."}
          </p>

          {/* FULL DESCRIPTION (EXTRA INFO) */}
          {product.fullDescription && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Product Details
              </h3>
              <p className="text-gray-700">
                {product.fullDescription}
              </p>
            </div>
          )}

          {/* SPECIFICATIONS */}
          {product.specs && Array.isArray(product.specs) && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Specifications
              </h3>
              <ul className="list-disc pl-5 text-gray-600">
                {product.specs.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ADD TO CART */}
          <button
            onClick={() => addToCart(product)}
            className="mt-8 bg-black text-white px-6 py-3 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
