
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/ProductCard";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


const normalize = (v) => v?.trim().toLowerCase();

const capitalize = (v) =>
  v ? v.charAt(0).toUpperCase() + v.slice(1) : "";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("none");
  const [loading, setLoading] = useState(true);

  /* 🔹 FETCH PRODUCTS */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          category: normalize(d.data().category), // 🔥 normalize here
        }));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* 🔹 UNIQUE CATEGORIES (NO DUPLICATES EVER) */
  const categories = useMemo(() => {
    const unique = new Set();
    products.forEach((p) => {
      if (p.category) unique.add(p.category);
    });
    return ["all", ...Array.from(unique)];
  }, [products]);

  /* 🔹 FILTER + SORT */
  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter(
        (p) => normalize(p.category) === normalize(category)
      );
    }

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, category, sort]);

  return (
    <>
      <Navbar />

      {/* 🎨 HERO SECTION */}
      <div className="bg-linear-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] border-b border-[#3f4663]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#e5e7eb] mb-3">
            ⚡ Discover Premium Tech
          </h1>
          <p className="text-lg text-[#9ca3af] max-w-2xl">
            Explore our curated collection of cutting-edge electronics. Shop by category or find your perfect gadget.
          </p>
        </div>
      </div>

      {/* CATEGORY SHOWCASE (Kreo "Go Beyond" Style Carousel) */}
      {!loading && categories.filter(c => c !== "all").length > 0 && (
        <div className="bg-[#0a0e27] border-b border-[#3f4663] py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#e5e7eb] mb-2">Go Beyond Limits</h2>
            <p className="text-[#9ca3af] mb-10">Explore our premium categories</p>
            
            {/* Horizontal Carousel */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 animate-scroll">
                {[...categories.filter(c => c !== "all"), ...categories.filter(c => c !== "all")].map((cat, index) => {
                  const catProducts = products.filter(p => normalize(p.category) === normalize(cat));
                  return (
                    <button
                      key={`${cat}-${index}`}
                      onClick={() => setCategory(cat)}
                      className="group relative overflow-hidden bg-[#1a1f3a] border border-[#3f4663] rounded-lg hover:border-[#00d4ff] transition-all duration-500 p-8 text-left hover:glow-cyan min-w-[280px] flex-shrink-0 hover:scale-105 transform"
                    >
                      {/* Background Gradient */}
                      <div className="absolute inset-0 bg-linear-to-br from-[#7c3aed] to-[#06b6d4] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-500 inline-block animate-pulse">
                          {cat === "Electronics" && "⚡"}
                          {cat === "Keyboards" && "⌨️"}
                          {cat === "Mouse" && "🖱️"}
                          {cat === "Monitors" && "🖥️"}
                          {cat === "Headphones" && "🎧"}
                          {cat === "Accessories" && "🔌"}
                          {!["Electronics", "Keyboards", "Mouse", "Monitors", "Headphones", "Accessories"].includes(cat) && "📦"}
                        </div>
                        <h3 className="text-xl font-bold text-[#e5e7eb] capitalize mb-2">{cat}</h3>
                        <p className="text-[#9ca3af] text-sm">{catProducts.length} product{catProducts.length !== 1 ? "s" : ""}</p>
                        <div className="mt-4 flex items-center text-[#00d4ff] text-sm font-semibold group-hover:translate-x-2 transition-transform duration-500">
                          Browse → 
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Gradient Overlays for Smooth Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-[#0a0e27] to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-[#0a0e27] to-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS SECTION */}
      <div className="px-6 py-6 bg-[#0a0e27] border-b border-[#3f4663] sticky top-16 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Category Filter */}
            <div className="flex-1 min-w-50">
              <label className="block text-xs font-semibold text-[#9ca3af] mb-2 uppercase tracking-wide">📂 Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1a1f3a] border border-[#3f4663] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent transition-all font-medium text-[#e5e7eb]"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((c) => c !== "all")
                  .map((c) => (
                    <option key={c} value={c}>
                      {capitalize(c)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Price Sort */}
            <div className="flex-1 min-w-50">
              <label className="block text-xs font-semibold text-[#9ca3af] mb-2 uppercase tracking-wide">💰 Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#1a1f3a] border border-[#3f4663] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent transition-all font-medium text-[#e5e7eb]"
              >
                <option value="none">All Prices</option>
                <option value="low">💵 Low → High</option>
                <option value="high">💸 High → Low</option>
              </select>
            </div>

            {/* Results Count */}
            {!loading && (
              <div className="flex items-end">
                <p className="text-sm text-[#9ca3af]">
                  Showing <span className="font-bold text-[#00d4ff]">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="bg-[#0a0e27] py-12">
        <div className="max-w-7xl mx-auto px-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <p className="text-[#9ca3af] font-medium">Loading products…</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-7xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-[#e5e7eb] mb-2">No products found</h3>
              <p className="text-[#9ca3af] mb-6">Try adjusting your filters or browse all categories</p>
              <button
                onClick={() => {
                  setCategory("all")
                  setSort("none")
                }}
                className="px-6 py-2.5 bg-linear-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#00d4ff]/50 transition-all"
              >
                View All Products
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER SECTION - KEEP AS IS */}
      <footer className="bg-[#0a0e27] border-t border-[#3f4663] text-[#e5e7eb] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-[#7c3aed] to-[#06b6d4] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-[#00d4ff]">RoleCart</h3>
              </div>
              <p className="text-[#9ca3af] text-sm">Premium electronics shopping for tech enthusiasts.</p>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold mb-4 text-lg text-[#e5e7eb]">Categories</h4>
              <ul className="space-y-2 text-[#9ca3af] text-sm">
                {categories.filter(c => c !== "all").slice(0, 5).map(cat => (
                  <li key={cat}>
                    <button onClick={() => setCategory(cat)} className="hover:text-[#00d4ff] transition-colors capitalize">
                      {cat}
                    </button>
                  </li>
                ))}
                {categories.filter(c => c !== "all").length > 5 && (
                  <li><button onClick={() => setCategory("all")} className="hover:text-[#00d4ff] transition-colors">View All</button></li>
                )}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="font-bold mb-4 text-lg text-[#e5e7eb]">Information</h4>
              <ul className="space-y-2 text-[#9ca3af] text-sm">
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-lg text-[#e5e7eb]">Quick Links</h4>
              <ul className="space-y-2 text-[#9ca3af] text-sm">
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">My Account</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Orders Tracking</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#3f4663] pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-[#9ca3af] text-sm">© 2026 RoleCart. All rights reserved.</p>
              {/* <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-[#9ca3af] hover:text-[#00d4ff] transition-colors">📱 Facebook</a>
                <a href="#" className="text-[#9ca3af] hover:text-[#00d4ff] transition-colors">𝕏 Twitter</a>
                <a href="#" className="text-[#9ca3af] hover:text-[#00d4ff] transition-colors">📷 Instagram</a>
              </div> */}

              <div className="flex items-center gap-6 mt-4 md:mt-0">

  {/* Facebook */}
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-[#9ca3af] hover:text-[#00d4ff] transition-colors group"
  >
    <FaFacebookF className="text-lg group-hover:scale-110 transition" />
    <span className="hidden sm:inline">Facebook</span>
  </a>

  {/* Twitter / X */}
  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-[#9ca3af] hover:text-[#00d4ff] transition-colors group"
  >
    <FaXTwitter className="text-lg group-hover:scale-110 transition" />
    <span className="hidden sm:inline">Twitter</span>
  </a>

  {/* Instagram */}
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-[#9ca3af] hover:text-[#00d4ff] transition-colors group"
  >
    <FaInstagram className="text-lg group-hover:scale-110 transition" />
    <span className="hidden sm:inline">Instagram</span>
  </a>

</div>

            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

