import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <span className="text-xl font-bold text-blue-600">Rockwall Events</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
            Home
          </Link>
          <a
            href="/submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Submit Event
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
