import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/ProductCard";
import { db } from "../../firebase/firebase";

const normalize = (v) => v?.trim().toLowerCase();
const capitalize = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "");

const categoryMeta = {
  electronics: { icon: "⚡", tag: "High performance picks" },
  keyboards: { icon: "⌨️", tag: "Mechanical and wireless" },
  mouse: { icon: "🖱️", tag: "Precision and comfort" },
  monitors: { icon: "🖥️", tag: "Immersive visuals" },
  headphones: { icon: "🎧", tag: "Gaming and studio audio" },
  accessories: { icon: "🔌", tag: "Desk and setup essentials" },
};

export default function Store() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          category: normalize(d.data().category),
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

  const categories = useMemo(() => {
    const unique = new Set();
    products.forEach((p) => {
      if (p.category) unique.add(p.category);
    });
    return ["all", ...Array.from(unique)];
  }, [products]);

  const categoryList = useMemo(
    () => categories.filter((c) => c !== "all"),
    [categories]
  );

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => normalize(p.category) === normalize(category));
    }

    if (sort === "low") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") list.sort((a, b) => (b.price || 0) - (a.price || 0));

    return list;
  }, [products, category, sort]);

  const featuredProducts = useMemo(
    () => products.filter((p) => (p.stock || 0) > 0).slice(0, 4),
    [products]
  );

  const topCategories = useMemo(
    () =>
      categoryList
        .map((c) => ({
          id: c,
          count: products.filter(
            (p) => normalize(p.category) === normalize(c)
          ).length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    [categoryList, products]
  );

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

      <main className="bg-[#060b1f] text-[#e5e7eb]">
        <div className="border-b border-[#24305d] bg-[#09102a]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9fb2e6]">
            <p>Free shipping above Rs 999</p>
            <p>7-day easy returns</p>
            <p>New launch deals live now</p>
          </div>
        </div>

        <section className="border-b border-[#24305d] bg-gradient-to-b from-[#0b1434] to-[#060b1f]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#1cb6ff]/50 bg-[#1cb6ff]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#86d7ff]">
                Built for gamers and creators
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Performance gear for your
                <span className="block bg-gradient-to-r from-[#60d8ff] via-[#7b8dff] to-[#34f1b9] bg-clip-text text-transparent">
                  next winning setup
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base text-[#9fb2e6] md:text-lg">
                Shop curated electronics with clean pricing, fast delivery, and
                category-first browsing that feels closer to a modern D2C tech
                brand.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .querySelector(".products-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-lg bg-[#11b6ff] px-6 py-3 font-semibold text-[#05122f] transition hover:bg-[#38c4ff]"
                >
                  Shop all products
                </button>
                <button
                  onClick={() => setSort("high")}
                  className="rounded-lg border border-[#35508b] bg-[#111b40] px-6 py-3 font-semibold text-[#b9c8eb] transition hover:border-[#4f6cb2] hover:text-white"
                >
                  Explore premium range
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {topCategories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  className="rounded-2xl border border-[#2b3d75] bg-[#0f1838] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#12b8ff] hover:shadow-[0_14px_30px_rgba(8,21,56,0.6)]"
                >
                  <p className="text-2xl">{categoryMeta[item.id]?.icon || "📦"}</p>
                  <p className="mt-3 text-xl font-bold capitalize">{item.id}</p>
                  <p className="mt-1 text-sm text-[#95a8d8]">
                    {item.count} product{item.count !== 1 ? "s" : ""}
                  </p>
                </button>
              ))}
              <div className="rounded-2xl border border-[#245f75] bg-gradient-to-br from-[#10314e] to-[#111a3e] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8bdcff]">
                  Weekly deal
                </p>
                <p className="mt-2 text-2xl font-black leading-tight">
                  Up to 25% off on selected accessories
                </p>
                <button
                  onClick={() => setCategory("accessories")}
                  className="mt-4 text-sm font-semibold text-[#8bdcff] transition hover:text-white"
                >
                  Browse deals →
                </button>
              </div>
            </div>
          </div>
        </section>

        {!loading && categoryList.length > 0 && (
          <section className="border-b border-[#24305d] bg-[#060b1f] py-10">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black md:text-3xl">
                  Shop by category
                </h2>
                <button
                  onClick={() => setCategory("all")}
                  className="text-sm font-semibold text-[#8bdcff] transition hover:text-white"
                >
                  View all categories
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 pr-6">
                {categoryList.map((cat) => {
                  const catProducts = products.filter(
                    (p) => normalize(p.category) === normalize(cat)
                  );
                  const isActive = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`min-w-[260px] rounded-2xl border p-5 text-left transition ${
                        isActive
                          ? "border-[#11b6ff] bg-[#13234f]"
                          : "border-[#2b3d75] bg-[#10183a] hover:border-[#3d5aa2]"
                      }`}
                    >
                      <p className="text-2xl">{categoryMeta[cat]?.icon || "📦"}</p>
                      <h3 className="mt-3 text-xl font-bold capitalize">{cat}</h3>
                      <p className="mt-1 text-sm text-[#95a8d8]">
                        {catProducts.length} product
                        {catProducts.length !== 1 ? "s" : ""}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#84d9ff]">
                        {categoryMeta[cat]?.tag || "Featured picks"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {featuredProducts.length > 0 && (
          <section className="border-b border-[#24305d] bg-[#071028] py-10">
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="text-2xl font-black md:text-3xl">Featured deals</h2>
              <p className="mt-2 text-sm text-[#9fb2e6]">
                Hand-picked products currently in stock and ready to ship.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {featuredProducts.map((product, index) => (
                  <div
                    key={`featured-${product.id}`}
                    className="rounded-2xl border border-[#2b3d75] bg-[#101a3d] p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7fd7ff]">
                      Deal {index + 1}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-[#95a8d8] capitalize">
                      {product.category || "general"}
                    </p>
                    <button
                      onClick={() => setCategory(normalize(product.category) || "all")}
                      className="mt-4 text-xs font-semibold text-[#7fd7ff] transition hover:text-white"
                    >
                      View in category →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-[#24305d] bg-[#060b1f]/95">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center">
            <div className="w-full lg:max-w-xs">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#8ba4db]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#2e4379] bg-[#0f1837] px-4 py-2.5 text-sm text-[#dce7ff] outline-none transition focus:border-[#11b6ff]"
              >
                <option value="all">All categories</option>
                {categoryList.map((c) => (
                  <option key={c} value={c}>
                    {capitalize(c)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:max-w-xs">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#8ba4db]">
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-lg border border-[#2e4379] bg-[#0f1837] px-4 py-2.5 text-sm text-[#dce7ff] outline-none transition focus:border-[#11b6ff]"
              >
                <option value="none">Featured first</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>

            <div className="lg:ml-auto">
              <p className="rounded-lg border border-[#2f467b] bg-[#101b3f] px-4 py-2.5 text-sm text-[#c7d6ff]">
                Showing <span className="font-bold text-[#7ed8ff]">{filtered.length}</span>{" "}
                result{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </section>

        <section className="products-section mx-auto max-w-7xl px-6 py-12">
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border border-[#2e4379] bg-[#10183a] px-6 py-20 text-center">
              <h3 className="text-3xl font-black">No products found</h3>
              <p className="mx-auto mt-3 max-w-xl text-[#9fb2e6]">
                Try changing the category or sort filters to discover more
                products.
              </p>
              <button
                onClick={() => {
                  setCategory("all");
                  setSort("none");
                }}
                className="mt-7 rounded-lg bg-[#11b6ff] px-6 py-3 font-semibold text-[#04132e] transition hover:bg-[#3ec4ff]"
              >
                Reset filters
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#24305d] bg-[#060b1f] text-[#e5e7eb]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-xl font-black text-[#8bdcff]">RoleCart</h3>
              <p className="mt-2 text-sm text-[#9caedc]">
                Premium electronics shopping designed for clean browsing and
                quick checkout.
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-bold">Categories</h4>
              <ul className="space-y-2 text-sm text-[#9caedc]">
                {categoryList.slice(0, 5).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat)}
                      className="capitalize transition hover:text-[#8bdcff]"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-bold">Information</h4>
              <ul className="space-y-2 text-sm text-[#9caedc]">
                <li>
                  <a href="#" className="transition hover:text-[#8bdcff]">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#8bdcff]">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#8bdcff]">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#8bdcff]">
                    Terms and conditions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-bold">Follow us</h4>
              <div className="space-y-2 text-sm text-[#9caedc]">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-[#8bdcff]"
                >
                  <FaFacebookF />
                  Facebook
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-[#8bdcff]"
                >
                  <FaXTwitter />
                  X
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-[#8bdcff]"
                >
                  <FaInstagram />
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <p className="border-t border-[#24305d] pt-6 text-sm text-[#8196cc]">
            © 2026 RoleCart. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
