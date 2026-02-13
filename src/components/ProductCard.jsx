import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const stock = Number(product.stock ?? 0);
  const price = Number(product.price ?? 0);
  const outOfStock = stock <= 0;
  const compareAt = Number(product.compareAtPrice ?? Math.round(price * 1.15));
  const hasDiscount = compareAt > price;
  const discountPercent = hasDiscount
    ? Math.max(1, Math.round(((compareAt - price) / compareAt) * 100))
    : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2e4379] bg-[#10183a] shadow-[0_10px_28px_rgba(5,15,40,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#12b8ff] hover:shadow-[0_14px_36px_rgba(8,24,63,0.55)]">
      <div className="relative h-56 shrink-0 overflow-hidden bg-[#0d1533]">
        <img
          src={product.image || "https://via.placeholder.com/600x400?text=No+Image"}
          alt={product.name}
          className="h-full w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105"
          onClick={() => navigate(`/product/${product.id}`)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06102a]/70 via-transparent to-transparent" />

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-md bg-[#ff7d44] px-2.5 py-1 text-xs font-bold text-white">
            {discountPercent}% OFF
          </span>
        )}

        {product.category && (
          <span className="absolute right-3 top-3 rounded-md border border-[#3a5697] bg-[#13224d]/90 px-2.5 py-1 text-xs font-semibold capitalize text-[#d9e8ff]">
            {product.category}
          </span>
        )}

        {!outOfStock && stock < 5 && (
          <span className="absolute bottom-3 left-3 rounded-md bg-[#ffd84a] px-2.5 py-1 text-xs font-bold text-[#3d3200]">
            Only {stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="line-clamp-2 cursor-pointer text-base font-bold leading-6 text-[#e8efff] transition group-hover:text-[#90dcff]"
          onClick={() => navigate(`/product/${product.id}`)}
          title={product.name}
        >
          {product.name}
        </h3>

        {product.shortDesc && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#99addc]">
            {product.shortDesc}
          </p>
        )}

        <div className="mt-4">
          <div className="flex items-end gap-2">
            <p className="text-2xl font-black text-[#d9ebff]">
              Rs {price.toLocaleString("en-IN")}
            </p>
            {hasDiscount && (
              <p className="pb-0.5 text-sm text-[#8ca2d7] line-through">
                Rs {compareAt.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <p className="mt-1 text-xs text-[#8ea6d8]">
            {outOfStock ? (
              <span className="font-semibold text-[#f49292]">Currently unavailable</span>
            ) : (
              <span>In stock ({stock} available)</span>
            )}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="rounded-lg border border-[#35508b] bg-[#0f1a3c] px-3 py-2.5 text-sm font-semibold text-[#c2d4ff] transition hover:border-[#4a69b8] hover:text-white"
          >
            Details
          </button>

          <button
            onClick={() => addToCart(product)}
            disabled={outOfStock}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              outOfStock
                ? "cursor-not-allowed bg-[#2b3962] text-[#8398c8]"
                : "bg-[#11b6ff] text-[#04132e] hover:bg-[#3cc5ff]"
            }`}
          >
            {outOfStock ? "Unavailable" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
