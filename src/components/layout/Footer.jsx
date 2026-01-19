import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-[#0a0e27] border-t border-[#3f4663]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#e5e7eb] mb-3">
            RoleCart
          </h2>
          <p className="text-sm text-[#9ca3af] leading-relaxed">
            A modern role-based e-commerce platform built for buyers and sellers.
            Secure, fast, and beautifully designed.
          </p>
        </div>

        {/* BUYER */}
        <div>
          <h3 className="text-sm font-bold text-[#e5e7eb] uppercase tracking-wider mb-4">
            Buyer
          </h3>
          <ul className="space-y-3 text-sm text-[#9ca3af]">
            <li>
              <Link to="/store" className="hover:text-[#00d4ff] transition-colors">
                Store
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-[#00d4ff] transition-colors">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-[#00d4ff] transition-colors">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        {/* SELLER */}
        <div>
          <h3 className="text-sm font-bold text-[#e5e7eb] uppercase tracking-wider mb-4">
            Seller
          </h3>
          <ul className="space-y-3 text-sm text-[#9ca3af]">
            <li>
              <Link
                to="/seller-dashboard"
                className="hover:text-[#00d4ff] transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="hover:text-[#00d4ff] transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="hover:text-[#00d4ff] transition-colors"
              >
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* ACCOUNT */}
        <div>
          <h3 className="text-sm font-bold text-[#e5e7eb] uppercase tracking-wider mb-4">
            Account
          </h3>
          <ul className="space-y-3 text-sm text-[#9ca3af]">
            <li>
              <Link to="/profile" className="hover:text-[#00d4ff] transition-colors">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-[#00d4ff] transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-[#00d4ff] transition-colors">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[#3f4663]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#9ca3af]">
            © {new Date().getFullYear()} RoleCart. All rights reserved.
          </p>

          <div className="flex gap-6 text-[#9ca3af] text-lg">
            <span className="hover:text-[#00d4ff] transition-colors cursor-pointer">
              🐦
            </span>
            <span className="hover:text-[#00d4ff] transition-colors cursor-pointer">
              💼
            </span>
            <span className="hover:text-[#00d4ff] transition-colors cursor-pointer">
              📸
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
