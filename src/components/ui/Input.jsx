export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    />
  )
}
