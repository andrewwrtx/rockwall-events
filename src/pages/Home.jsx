import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import EventCard from '../components/EventCard'
import NewsletterSignup from '../components/NewsletterSignup'

const categories = [
  { id: 'music', label: 'Music & Live Entertainment', emoji: '🎵', color: 'bg-purple-500' },
  { id: 'food', label: 'Food & Drink', emoji: '🍕', color: 'bg-orange-500' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎨', color: 'bg-pink-500' },
  { id: 'sports', label: 'Sports & Recreation', emoji: '⚽', color: 'bg-green-500' },
  { id: 'family', label: 'Family & Kids', emoji: '👨‍👩‍👧', color: 'bg-yellow-500' },
  { id: 'theater', label: 'Theater & Comedy', emoji: '🎭', color: 'bg-red-500' },
  { id: 'business', label: 'Business & Networking', emoji: '💼', color: 'bg-blue-500' },
  { id: 'education', label: 'Education & Workshops', emoji: '📚', color: 'bg-indigo-500' },
  { id: 'community', label: 'Community & Charity', emoji: '🤝', color: 'bg-teal-500' },
  { id: 'festivals', label: 'Festivals & Fairs', emoji: '🎪', color: 'bg-rose-500' },
]

function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState({})

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
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

  const featuredEvents = events.filter(function(e) { return e.is_featured })
  const upcomingEvents = events.filter(function(e) { return !e.is_featured }).slice(0, 6)

  return (
    <div>
      <div className="bg-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            What's happening in Rockwall?
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Your go-to guide for events in Rockwall, TX
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#events"
              className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              Browse Events
            </a>
            <a
              href="/submit"
              className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition"
            >
              Submit Your Event
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map(function(cat) {
              return (
                <Link
                  key={cat.id}
                  to={'/category/' + cat.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100 text-center"
                >
                  <div className={cat.color + ' text-white text-2xl w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2'}>
                    {cat.emoji}
                  </div>
                  <p className="font-medium text-gray-800 text-sm leading-tight">{cat.label}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {categoryCounts[cat.id] || 0} events
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {featuredEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map(function(event) {
                return <EventCard key={event.id} event={event} />
              })}
            </div>
          </section>
        )}

        <section id="events">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <span className="text-gray-500 text-sm">{events.length} total events</span>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No events yet - check back soon!</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map(function(event) {
                return <EventCard key={event.id} event={event} />
              })}
            </div>
          )}
        </section>

      </div>

      <NewsletterSignup />

    </div>
  )
}

export default Home
