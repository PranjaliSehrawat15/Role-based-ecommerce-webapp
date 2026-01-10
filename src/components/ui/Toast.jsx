export default function Toast({ message, type = "success" }) {
  if (!message) return null

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow text-white
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  )
}
