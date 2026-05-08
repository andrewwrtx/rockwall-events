import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import EventCard from '../components/EventCard'
import NewsletterSignup from '../components/NewsletterSignup'

const categories = [
  { id: 'music', label: 'Music', dot: 'bg-purple-500' },
  { id: 'food', label: 'Food & Drink', dot: 'bg-orange-500' },
  { id: 'arts', label: 'Arts & Culture', dot: 'bg-pink-500' },
  { id: 'sports', label: 'Sports', dot: 'bg-green-500' },
  { id: 'family', label: 'Family & Kids', dot: 'bg-yellow-500' },
  { id: 'theater', label: 'Theater', dot: 'bg-red-500' },
  { id: 'business', label: 'Business', dot: 'bg-blue-500' },
  { id: 'education', label: 'Education', dot: 'bg-indigo-500' },
  { id: 'community', label: 'Community', dot: 'bg-teal-500' },
  { id: 'festivals', label: 'Festivals', dot: 'bg-rose-500' },
]

function getTodayStr() {
  const today = new Date()
  return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
}

function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const todayStr = getTodayStr()

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .gte('date', todayStr)
        .order('date', { ascending: true })

      if (!error && data) {
        setEvents(data)
        const counts = {}
        data.forEach(function(e) {
          counts[e.category] = (counts[e.category] || 0) + 1
        })
        setCategoryCounts(counts)
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }
    setIsSearching(true)
    const q = searchQuery.toLowerCase()
    const results = events.filter(function(e) {
      return (
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.location_name && e.location_name.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q))
      )
    })
    setSearchResults(results)
  }, [searchQuery, events])

  const featuredEvents = events.filter(function(e) { return e.is_featured })
  const upcomingEvents = events.filter(function(e) { return !e.is_featured }).slice(0, 6)

  return (
    <div className="bg-white">

      <div className="bg-gray-900 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            What's happening in Rockwall?
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            The definitive guide to events in Rockwall, TX
          </p>
          <div className="relative max-w-xl mx-auto mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={function(e) { setSearchQuery(e.target.value) }}
              placeholder="Search events, venues, categories..."
              className="w-full bg-white text-gray-900 placeholder-gray-400 px-5 py-4 rounded-xl text-base focus:outline-none shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={function() { setSearchQuery('') }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            )}
          </div>
          {!isSearching && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#events" className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                Browse Events
              </a>
              <Link to="/weekend" className="border border-gray-600 text-gray-300 font-semibold px-6 py-3 rounded-lg hover:border-gray-400 hover:text-white transition">
                This Weekend
              </Link>
              <Link to="/submit" className="border border-gray-600 text-gray-300 font-semibold px-6 py-3 rounded-lg hover:border-gray-400 hover:text-white transition">
                Submit an Event
              </Link>
            </div>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
            <button onClick={function() { setSearchQuery('') }} className="text-gray-400 hover:text-gray-700 text-sm transition">
              Clear search
            </button>
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-2">No events found for "{searchQuery}"</p>
              <p className="text-gray-300 text-sm">Try a venue name, category, or event title</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(function(event) {
                return <EventCard key={event.id} event={event} />
              })}
            </div>
          )}
        </div>
      )}

      {!isSearching && (
        <div className="max-w-6xl mx-auto px-6 py-12">

          <section className="mb-12">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Browse by Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(function(cat) {
                return (
                  <Link
                    key={cat.id}
                    to={'/category/' + cat.id}
                    className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:border-gray-400 hover:shadow-sm transition group"
                  >
                    <span className={cat.dot + ' w-2 h-2 rounded-full'}></span>
                    <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900">{cat.label}</span>
                    <span className="text-gray-400 text-xs">{categoryCounts[cat.id] || 0}</span>
                  </Link>
                )
              })}
            </div>
          </section>

          {featuredEvents.length > 0 && (
            <section className="mb-12">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Featured Events</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredEvents.map(function(event) {
                  return <EventCard key={event.id} event={event} />
                })}
              </div>
            </section>
          )}

          <section id="events">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Upcoming Events</p>
              <Link to="/calendar" className="text-blue-500 text-sm hover:text-blue-700 transition">
                View all {events.length} events →
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No upcoming events — check back soon!</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map(function(event) {
                  return <EventCard key={event.id} event={event} />
                })}
              </div>
            )}
            {events.length > 6 && (
              <div className="text-center mt-8">
                <Link to="/calendar" className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg text-sm hover:border-gray-500 hover:text-gray-900 transition inline-block">
                  View all {events.length} upcoming events →
                </Link>
              </div>
            )}
          </section>

        </div>
      )}

      <NewsletterSignup />
    </div>
  )
}

export default Home
