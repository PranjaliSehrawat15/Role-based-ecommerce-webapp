import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { FaArrowLeft, FaFire } from "react-icons/fa";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/ProductCard";
import { db } from "../../firebase/firebase";

const normalize = (v) => v?.trim().toLowerCase();
const capitalize = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "");

const offerProducts = [
  { id: "offer1", discount: 35, label: "Premium Keyboards" },
  { id: "offer2", discount: 28, label: "Gaming Mouse" },
  { id: "offer3", discount: 32, label: "Mechanical Switches" },
  { id: "offer4", discount: 25, label: "Desk Accessories" },
];

export default function Offers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("discount");
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 24,
    seconds: 56,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          category: normalize(d.data().category),
          discount: offerProducts.find((o) => o.id === d.id)?.discount || Math.floor(Math.random() * 20) + 15,
        }));
        setProducts(data.filter((p) => (p.discount || 0) >= 15).sort((a, b) => b.discount - a.discount));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          hours = 3;
          minutes = 24;
          seconds = 56;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sortedProducts = useMemo(() => {
    let list = [...products];
    if (sort === "discount") list.sort((a, b) => b.discount - a.discount);
    if (sort === "price-low") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price-high") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    return list;
  }, [products, sort]);

  const ProductSkeleton = () => (
    <div className="animate-pulse rounded-2xl border border-[#2e3865] bg-[#111938] p-5">
      <div className="mb-4 h-52 rounded-xl bg-[#1d2850]" />
      <div className="mb-3 h-4 w-3/5 rounded bg-[#1d2850]" />
      <div className="mb-5 h-4 w-2/5 rounded bg-[#1d2850]" />
      <div className="h-10 rounded-lg bg-[#1d2850]" />
    </div>
  );

  return (
    <>
      <Navbar />

      <main className="bg-[#060b1f] text-[#e5e7eb] min-h-screen">
        {/* Header Section */}
        <section className="border-b border-[#24305d] bg-gradient-to-b from-[#0b1434] to-[#060b1f] py-10">
          <div className="mx-auto max-w-7xl px-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#60d8ff] transition hover:text-[#8ce5ff]"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to shop
            </button>

            {/* Hero Section */}
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FaFire className="w-6 h-6 text-[#ff6b35]" />
                  <span className="inline-flex items-center rounded-full border border-[#ff6b35]/50 bg-[#ff6b35]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff6b35]">
                    Mega Flash Sale
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
                  All deals
                  <span className="block bg-gradient-to-r from-[#ff6b35] via-[#60d8ff] to-[#34f1b9] bg-clip-text text-transparent">
                    live now
                  </span>
                </h1>

                <p className="text-lg text-[#9fb2e6] mb-6 max-w-2xl">
                  Grab premium gaming gear and creator essentials before stock runs out. Limited time offers on the best products.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="px-6 py-4 bg-[#0f1838] border border-[#2b3d75] rounded-lg">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#7fa3d1] mb-2">
                      Offer ends in
                    </p>
                    <div className="flex gap-3 text-center">
                      <div>
                        <div className="text-2xl font-black text-[#60d8ff]">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </div>
                        <div className="text-xs text-[#7fa3d1] font-bold">hours</div>
                      </div>
                      <div className="text-2xl font-black text-[#7fa3d1]">:</div>
                      <div>
                        <div className="text-2xl font-black text-[#60d8ff]">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </div>
                        <div className="text-xs text-[#7fa3d1] font-bold">min</div>
                      </div>
                      <div className="text-2xl font-black text-[#7fa3d1]">:</div>
                      <div>
                        <div className="text-2xl font-black text-[#60d8ff]">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </div>
                        <div className="text-xs text-[#7fa3d1] font-bold">sec</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#0f1838]/50 border border-[#34f1b9]/30 rounded-lg flex items-center gap-3">
                    <span className="text-3xl font-black text-[#34f1b9]">
                      Save up to 35%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#ff6b35]/30 bg-gradient-to-br from-[#1f1a2e] via-[#16213e] to-[#0f3460] p-6 shadow-lg shadow-[#ff6b35]/10">
                  <p className="text-sm text-[#9fb2e6] mb-2">Products on sale</p>
                  <p className="text-5xl font-black text-white mb-4">{products.length}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7fa3d1]">Average discount</span>
                      <span className="font-bold text-[#60d8ff]">~24%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7fa3d1]">Top discount</span>
                      <span className="font-bold text-[#ff6b35]">35% OFF</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7fa3d1]">Limited stock status</span>
                      <span className="font-bold text-[#34f1b9]">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="border-b border-[#24305d] bg-[#060b1f]/95 sticky top-14 z-10">
          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#8ba4db] mb-2">
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-[#2e4379] bg-[#0f1837] px-4 py-2.5 text-sm text-[#dce7ff] outline-none transition focus:border-[#11b6ff]"
              >
                <option value="discount">Highest discount first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </div>

            <div className="text-right">
              <p className="rounded-lg border border-[#2f467b] bg-[#101b3f] px-4 py-2.5 text-sm text-[#c7d6ff]">
                Showing <span className="font-bold text-[#7ed8ff]">{sortedProducts.length}</span> offers
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && sortedProducts.length === 0 && (
            <div className="rounded-2xl border border-[#2e4379] bg-[#10183a] px-6 py-20 text-center">
              <h3 className="text-3xl font-black">No offers available</h3>
              <p className="mx-auto mt-3 max-w-xl text-[#9fb2e6]">
                Check back later for more amazing deals!
              </p>
              <button
                onClick={() => navigate(-1)}
                className="mt-7 rounded-lg bg-[#11b6ff] px-6 py-3 font-semibold text-[#04132e] transition hover:bg-[#3ec4ff]"
              >
                Back to shop
              </button>
            </div>
          )}

          {!loading && sortedProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#ff6b35] px-3 py-1.5 text-xs font-black text-white shadow-lg">
                      <FaFire className="w-3 h-3" />
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#24305d] bg-[#060b1f] text-[#e5e7eb]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center">
            <h3 className="text-lg font-black text-[#8bdcff] mb-2">RoleCart</h3>
            <p className="text-sm text-[#9caedc] mb-6">
              Check back regularly for new deals and exclusive offers!
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-block rounded-lg border border-[#35508b] bg-[#111b40] px-6 py-2 font-semibold text-[#b9c8eb] transition hover:border-[#4f6cb2] hover:text-white"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
