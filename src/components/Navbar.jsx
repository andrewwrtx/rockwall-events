import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <nav className="bg-gray-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          
          <span className="text-white font-bold text-lg tracking-tight">Rockwall Events</span>
        </Link>
        <div className="flex items-center gap-6">
  <Link
    to="/"
    className={isActive('/') ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-400 hover:text-white transition'}
  >
    Home
  </Link>
  <Link
    to="/calendar"
    className={isActive('/calendar') ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-400 hover:text-white transition'}
  >
    Calendar
  </Link>
  <Link
    to="/submit"
    className={isActive('/submit') ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-400 hover:text-white transition'}
  >
    Submit Event
  </Link>
</div>
      </div>
    </nav>
  )
}

export default Navbar
