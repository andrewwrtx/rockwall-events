import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import EventCard from '../components/EventCard'

const categoryInfo = {
  music: { label: 'Music & Live Entertainment', dot: 'bg-purple-500' },
  food: { label: 'Food & Drink', dot: 'bg-orange-500' },
  arts: { label: 'Arts & Culture', dot: 'bg-pink-500' },
  sports: { label: 'Sports & Recreation', dot: 'bg-green-500' },
  family: { label: 'Family & Kids', dot: 'bg-yellow-500' },
  theater: { label: 'Theater & Comedy', dot: 'bg-red-500' },
  business: { label: 'Business & Networking', dot: 'bg-blue-500' },
  education: { label: 'Education & Workshops', dot: 'bg-indigo-500' },
  community: { label: 'Community & Charity', dot: 'bg-teal-500' },
  festivals: { label: 'Festivals & Fairs', dot: 'bg-rose-500' },
}

function CategoryPage() {
  const { categoryId } = useParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const info = categoryInfo[categoryId] || { label: categoryId, dot: 'bg-gray-400' }

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
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link to="/" className="text-gray-400 hover:text-gray-700 text-sm transition inline-flex items-center gap-1 mb-8">
          ← Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-10">
          <div className={info.dot + ' w-3 h-3 rounded-full'}></div>
          <h1 className="text-3xl font-bold text-gray-900">{info.label}</h1>
          <span className="text-gray-400 text-sm">{events.length} events</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No events in this category yet.</p>
            <Link to="/submit" className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition inline-block">
              Submit the first one!
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(function(event) {
              return <EventCard key={event.id} event={event} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
