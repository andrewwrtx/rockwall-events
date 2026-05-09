import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function isActive(path) {
    return location.pathname === path
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="bg-gray-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center">
          <span className="text-white font-bold text-lg tracking-tight">Rockwall County Events</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={isActive('/') ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-400 hover:text-white transition'}>
            Home
          </Link>
          <Link to="/weekend" className={isActive('/weekend') ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-400 hover:text-white transition'}>
            This Weekend
          </Link>
          <Link to="/calendar" className={isActive('/calendar') ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-400 hover:text-white transition'}>
            Calendar
          </Link>
          <Link to="/submit" className={isActive('/submit') ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-400 hover:text-white transition'}>
            Submit Event
          </Link>
        </div>

        <button
          onClick={function() { setMenuOpen(!menuOpen) }}
          className="md:hidden text-gray-400 hover:text-white transition p-1"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={closeMenu}
              className={isActive('/') ? 'block py-2 px-3 rounded-lg text-sm font-medium text-white bg-gray-700' : 'block py-2 px-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition'}
            >
              Home
            </Link>
            <Link
              to="/weekend"
              onClick={closeMenu}
              className={isActive('/weekend') ? 'block py-2 px-3 rounded-lg text-sm font-medium text-white bg-gray-700' : 'block py-2 px-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition'}
            >
              This Weekend
            </Link>
            <Link
              to="/calendar"
              onClick={closeMenu}
              className={isActive('/calendar') ? 'block py-2 px-3 rounded-lg text-sm font-medium text-white bg-gray-700' : 'block py-2 px-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition'}
            >
              Calendar
            </Link>
            <Link
              to="/submit"
              onClick={closeMenu}
              className={isActive('/submit') ? 'block py-2 px-3 rounded-lg text-sm font-medium text-white bg-gray-700' : 'block py-2 px-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition'}
            >
              Submit Event
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
