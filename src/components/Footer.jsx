function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="font-bold text-white text-base">Rockwall Events</p>
        <p className="text-gray-400 text-sm mt-1">Your community events hub for Rockwall, TX</p>
        <div className="flex justify-center gap-8 mt-5 text-gray-500 text-sm">
          <a href="/submit" className="hover:text-white transition">Submit an Event</a>
          <a href="/calendar" className="hover:text-white transition">Calendar</a>
        </div>
        <p className="text-gray-600 text-xs mt-8">© 2026 Rockwall Events.</p>
      </div>
    </footer>
  )
}

export default Footer
