export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  )
}
