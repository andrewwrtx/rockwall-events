import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import EventCard from '../components/EventCard'

const categoryInfo = {
  music: { label: 'Music & Live Entertainment', emoji: '🎵', color: 'bg-purple-500' },
  food: { label: 'Food & Drink', emoji: '🍕', color: 'bg-orange-500' },
  arts: { label: 'Arts & Culture', emoji: '🎨', color: 'bg-pink-500' },
  sports: { label: 'Sports & Recreation', emoji: '⚽', color: 'bg-green-500' },
  family: { label: 'Family & Kids', emoji: '👨‍👩‍👧', color: 'bg-yellow-500' },
  theater: { label: 'Theater & Comedy', emoji: '🎭', color: 'bg-red-500' },
  business: { label: 'Business & Networking', emoji: '💼', color: 'bg-blue-500' },
  education: { label: 'Education & Workshops', emoji: '📚', color: 'bg-indigo-500' },
  community: { label: 'Community & Charity', emoji: '🤝', color: 'bg-teal-500' },
  festivals: { label: 'Festivals & Fairs', emoji: '🎪', color: 'bg-rose-500' },
}

function CategoryPage() {
  const { categoryId } = useParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const info = categoryInfo[categoryId] || { label: categoryId, emoji: '📅', color: 'bg-gray-500' }

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .eq('category', categoryId)
        .order('is_featured', { ascending: false })
        .order('date', { ascending: true })

      if (!error && data) setEvents(data)
      setLoading(false)
    }
    fetchEvents()
  }, [categoryId])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className={info.color + ' text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center'}>
          {info.emoji}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{info.label}</h1>
          <p className="text-gray-500">{events.length} upcoming events</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No events in this category yet.</p>
          <a href="/submit" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Submit the first one!
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(function(event) {
            return <EventCard key={event.id} event={event} />
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
