// import { useEffect, useState } from "react";
// import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../firebase/firebase";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate, useParams } from "react-router-dom";
// import Navbar from "../../components/layout/Navbar";
// import Sidebar from "../../components/layout/Sidebar";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";

// export default function AddEditProducts() {
//   const { user } = useAuth();
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // BASIC FIELDS
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");

//   // EXTRA DETAILS (FOR PRODUCT DETAILS PAGE)
//   const [fullDescription, setFullDescription] = useState("");
//   const [specs, setSpecs] = useState("");

//   // IMAGE
//   const [image, setImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [uploading, setUploading] = useState(false);

//   // 🔹 Cloudinary image upload
//   const uploadImage = async () => {
//     if (!image) return imageUrl;

//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", "rolecart_unsigned"); 

//     setUploading(true);

//     const res = await fetch(
//       "https://api.cloudinary.com/v1_1/dn0lwg4sb/image/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     setUploading(false);

//     return data.secure_url;
//   };

//   // 🔹 EDIT MODE (fetch existing product)
//   useEffect(() => {
//     if (!id) return;

//     const fetchProduct = async () => {
//       const snap = await getDoc(doc(db, "products", id));
//       if (snap.exists()) {
//         const p = snap.data();
//         setName(p.name);
//         setPrice(p.price);
//         setCategory(p.category);
//         setDescription(p.description || "");
//         setFullDescription(p.fullDescription || "");
//         setSpecs(p.specs ? p.specs.join(", ") : "");
//         setImageUrl(p.imageUrl || "");
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   // 🔹 SAVE PRODUCT
//   const handleSave = async () => {
//     if (!name || !price || !category) {
//       alert("Name, Price & Category are required");
//       return;
//     }

//     const finalImageUrl = await uploadImage();

//     const productData = {
//       name,
//       price: Number(price),
//       category,
//       description,
//       fullDescription,
//       specs: specs
//         .split(",")
//         .map(s => s.trim())
//         .filter(Boolean),
//       imageUrl: finalImageUrl,
//       createdBy: user.uid,
//       createdAt: Date.now(),
//     };

//     if (id) {
//       await updateDoc(doc(db, "products", id), productData);
//       alert("Product updated successfully");
//     } else {
//       await addDoc(collection(db, "products"), productData);
//       alert("Product added successfully");
//     }

//     navigate("/admin/products");
//   };

//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="flex-1">
//         <Navbar />

//         <div className="p-6 max-w-xl space-y-4">
//           <h2 className="text-2xl font-bold">
//             {id ? "Edit Product" : "Add New Product"}
//           </h2>

//           {/* BASIC INFO */}
//           <Input
//             placeholder="Product Name"
//             value={name}
//             onChange={e => setName(e.target.value)}
//           />

//           <Input
//             placeholder="Price"
//             type="number"
//             value={price}
//             onChange={e => setPrice(e.target.value)}
//           />

//           <Input
//             placeholder="Category (Laptop, Mobile, Display)"
//             value={category}
//             onChange={e => setCategory(e.target.value)}
//           />

//           <Input
//             placeholder="Short Description (1 line)"
//             value={description}
//             onChange={e => setDescription(e.target.value)}
//           />

//           {/* EXTRA DETAILS */}
//           <textarea
//             className="border w-full p-2 rounded"
//             placeholder="Full Description (detailed explanation)"
//             value={fullDescription}
//             onChange={e => setFullDescription(e.target.value)}
//           />

//           <textarea
//             className="border w-full p-2 rounded"
//             placeholder="Specifications (comma separated)"
//             value={specs}
//             onChange={e => setSpecs(e.target.value)}
//           />

//           {/* IMAGE */}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={e => setImage(e.target.files[0])}
//           />

//           {imageUrl && !image && (
//             <img
//               src={imageUrl}
//               alt="preview"
//               className="h-32 rounded"
//             />
//           )}

//           {uploading && (
//             <p className="text-sm text-gray-500">
//               Uploading image…
//             </p>
//           )}

//           <Button onClick={handleSave}>
//             {id ? "Update Product" : "Save Product"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"

export default function Products() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"))
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return
    await deleteDoc(doc(db, "products", id))
    fetchProducts()
  }

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">My Products</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              className="border rounded-xl p-4 bg-white shadow"
            >
              <img
                src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
                 alt={p.name}
                  className="h-40 w-full object-cover rounded mb-3"
              />


              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-gray-600">₹{p.price}</p>
              <p className="text-sm text-gray-500">{p.category}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                  className="border px-4 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
