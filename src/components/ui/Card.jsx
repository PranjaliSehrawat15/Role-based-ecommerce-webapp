export default function Card({ children }) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl shadow-xl">
      {children}
    </div>
  )
}
