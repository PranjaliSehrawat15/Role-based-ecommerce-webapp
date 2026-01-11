// import { useEffect, useMemo, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase/firebase";
// import Navbar from "../../components/layout/Navbar";
// import ProductCard from "../../components/ProductCard";

// export default function Store() {
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState("all");
//   const [sort, setSort] = useState("none"); // none | low | high
//   const [loading, setLoading] = useState(true);

//   // 🔹 Fetch products from Firestore
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const snap = await getDocs(collection(db, "products"));
//         const data = snap.docs.map((d) => ({
//           id: d.id,
//           ...d.data(),
//         }));
//         console.log("PRODUCTS FROM FIRESTORE:", data);
//         setProducts(data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // 🔹 Dynamically extract categories (Electronics context)
//   const categories = useMemo(() => {
//     const set = new Set(
//       products.map((p) => p.category).filter(Boolean)
//     );
//     return ["all", ...Array.from(set)];
//   }, [products]);

//   // 🔹 Filter + Sort logic
//   const filtered = useMemo(() => {
//     let list = [...products];

//     // Category filter
//     if (category !== "all") {
//       list = list.filter(
//         (p) =>
//           p.category?.toLowerCase() === category.toLowerCase()
//       );
//     }

//     // Price sorting
//     if (sort === "low") {
//       list.sort((a, b) => a.price - b.price);
//     }
//     if (sort === "high") {
//       list.sort((a, b) => b.price - a.price);
//     }

//     return list;
//   }, [products, category, sort]);

//   return (
//     <>
//       <Navbar />

//       {/* 🔹 Filters Section */}
//       <div className="px-6 py-4 flex flex-wrap gap-4 items-center border-b bg-white">
//         {/* Category Filter */}
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border px-4 py-2 rounded-lg"
//         >
//           <option value="all">All Categories</option>
//           {categories
//             .filter((c) => c !== "all")
//             .map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//         </select>

//         {/* Price Sort */}
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           className="border px-4 py-2 rounded-lg"
//         >
//           <option value="none">Sort by Price</option>
//           <option value="low">Low → High</option>
//           <option value="high">High → Low</option>
//         </select>
//       </div>

//       {/* 🔹 Products Grid */}
//       <div className="p-6">
//         {loading && (
//           <div className="text-center text-gray-500">
//             Loading electronic gadgets…
//           </div>
//         )}

//         {!loading && filtered.length === 0 && (
//           <div className="text-center text-gray-500">
//             No gadgets found in this category.
//           </div>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filtered.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/ProductCard";

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

      {/* FILTERS */}
      <div className="px-6 py-4 flex gap-4 items-center border-b bg-white">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded-lg"
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

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="none">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* PRODUCTS */}
      <div className="p-6">
        {loading && (
          <div className="text-center text-gray-500">
            Loading products…
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-500">
            No products found.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
