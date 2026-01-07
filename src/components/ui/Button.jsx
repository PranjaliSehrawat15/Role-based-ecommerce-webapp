export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition ${className}`}
    >
      {children}
    </button>
  )
}
