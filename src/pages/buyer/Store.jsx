
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

  /* Loading Skeleton */
  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-[#1a1f3a] rounded-lg h-48 mb-4"></div>
      <div className="bg-[#1a1f3a] rounded h-4 mb-3"></div>
      <div className="bg-[#1a1f3a] rounded h-4 mb-4 w-2/3"></div>
      <div className="flex gap-2">
        <div className="bg-[#1a1f3a] rounded h-10 flex-1"></div>
        <div className="bg-[#1a1f3a] rounded h-10 flex-1"></div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      {/* 🎨 ENHANCED HERO SECTION */}
      <div className="bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] border-b-2 border-[#3f4663] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 right-0 w-80 h-80 bg-[#7c3aed] rounded-full blur-3xl -mr-40 opacity-60"></div>
          <div className="absolute -bottom-20 left-0 w-80 h-80 bg-[#06b6d4] rounded-full blur-3xl -ml-40 opacity-60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="mb-8 inline-block">
            <span className="px-5 py-2.5 bg-gradient-to-r from-[#7c3aed]/30 to-[#06b6d4]/30 border-2 border-[#7c3aed] rounded-full text-[#00d4ff] text-sm font-bold tracking-wide uppercase">
              ⚡ Premium Collection
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-[#e5e7eb] mb-6 leading-tight">
            Discover <span className="bg-gradient-to-r from-[#06b6d4] via-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">Premium Tech</span>
          </h1>
          <p className="text-lg text-[#9ca3af] max-w-3xl mb-10 leading-relaxed">
            Explore our meticulously curated collection of cutting-edge electronics and gadgets. Find the perfect device that matches your lifestyle and tech aspirations.
          </p>
          <button
            onClick={() => {
              setCategory("all");
              document.querySelector(".products-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-[#06b6d4]/60 transition-all hover:scale-105 text-lg inline-flex items-center gap-2"
          >
            <span>🛍️</span>
            Shop Now
          </button>
        </div>
      </div>

      {/* CATEGORY SHOWCASE (Enhanced) */}
      {!loading && categories.filter(c => c !== "all").length > 0 && (
        <div className="bg-[#0a0e27] border-b-2 border-[#3f4663] py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-5xl font-black text-[#e5e7eb] mb-4">🎯 Shop By Category</h2>
              <p className="text-[#9ca3af] text-xl max-w-2xl">Explore our premium categories and find exactly what you're looking for</p>
            </div>
            
            {/* Horizontal Carousel */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                {[...categories.filter(c => c !== "all"), ...categories.filter(c => c !== "all")].map((cat, index) => {
                  const catProducts = products.filter(p => normalize(p.category) === normalize(cat));
                  return (
                    <button
                      key={`${cat}-${index}`}
                      onClick={() => setCategory(cat)}
                      className="group relative overflow-hidden bg-gradient-to-br from-[#1a1f3a] to-[#2d3561] border-2 border-[#3f4663] rounded-2xl hover:border-[#06b6d4] transition-all duration-500 px-8 py-10 text-left hover:shadow-2xl hover:shadow-[#06b6d4]/40 min-w-72 shrink-0 hover:scale-110 transform\"
                    >
                      {/* Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-500 inline-block">
                          {cat === "electronics" && "⚡"}
                          {cat === "keyboards" && "⌨️"}
                          {cat === "mouse" && "🖱️"}
                          {cat === "monitors" && "🖥️"}
                          {cat === "headphones" && "🎧"}
                          {cat === "accessories" && "🔌"}
                          {!["electronics", "keyboards", "mouse", "monitors", "headphones", "accessories"].includes(cat) && "📦"}
                        </div>
                        <h3 className="text-2xl font-bold text-[#e5e7eb] capitalize mb-2">{cat}</h3>
                        <p className="text-[#9ca3af] text-sm mb-4">{catProducts.length} product{catProducts.length !== 1 ? "s" : ""}</p>
                        <div className="flex items-center text-[#00d4ff] text-sm font-bold group-hover:translate-x-3 transition-transform duration-500">
                          View All →
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Gradient Overlays for Smooth Edges */}
              <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-[#0a0e27] to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-[#0a0e27] to-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS SECTION - Enhanced */}
      <div className="px-6 py-10 bg-gradient-to-b from-[#0a0e27] to-[#0a0e27]/90 border-b-2 border-[#3f4663] sticky top-[73px] z-40 shadow-2xl backdrop-blur-xl bg-opacity-98">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Category Filter */}
            <div className="flex-1 min-w-56">
              <label className="block text-xs font-bold text-[#9ca3af] mb-3 uppercase tracking-widest\">📂 Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#1a1f3a] border-2 border-[#3f4663] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all font-medium text-[#e5e7eb] hover:border-[#06b6d4] cursor-pointer text-base\"
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
            <div className="flex-1 min-w-56">
              <label className="block text-xs font-bold text-[#9ca3af] mb-3 uppercase tracking-widest\">💰 Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#1a1f3a] border-2 border-[#3f4663] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all font-medium text-[#e5e7eb] hover:border-[#06b6d4] cursor-pointer text-base\"
              >
                <option value="none">All Prices</option>
                <option value="low">💵 Low → High</option>
                <option value="high">💸 High → Low</option>
              </select>
            </div>

            {/* Results Count */}
            {!loading && (
              <div className="lg:flex items-end justify-end flex-1 hidden">
                <div className="bg-gradient-to-r from-[#7c3aed]/25 to-[#06b6d4]/25 border-2 border-[#6ee7b7] rounded-xl px-6 py-4">
                  <p className="text-sm text-[#e5e7eb] font-medium">
                    Showing <span className="font-bold text-[#00d4ff] text-lg">{filtered.length}</span> <span className="text-[#9ca3af]">result{filtered.length !== 1 ? "s" : ""}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Results Count */}
            {!loading && (
              <div className="lg:hidden w-full">
                <div className="bg-gradient-to-r from-[#7c3aed]/25 to-[#06b6d4]/25 border-2 border-[#6ee7b7] rounded-xl px-6 py-4">
                  <p className="text-sm text-[#e5e7eb] font-medium">
                    Showing <span className="font-bold text-[#00d4ff] text-lg">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="bg-[#0a0e27] pt-16 pb-12 products-section">
        <div className="max-w-7xl mx-auto px-6">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="text-9xl mb-8 opacity-40 animate-pulse\">🔍</div>
              <h3 className="text-4xl font-black text-[#e5e7eb] mb-4\">No Products Found</h3>
              <p className="text-[#9ca3af] mb-12 text-lg max-w-2xl text-center leading-relaxed\">Try adjusting your filters or browse all categories to discover amazing products and gadgets.</p>
              <button
                onClick={() => {
                  setCategory("all")
                  setSort("none")
                }}
                className="px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-[#06b6d4]/60 transition-all hover:scale-105 text-lg inline-flex items-center gap-2\"
              >
                <span>🏪</span>
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
      <footer className="bg-[#0a0e27] border-t border-[#3f4663] text-[#e5e7eb]">
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

