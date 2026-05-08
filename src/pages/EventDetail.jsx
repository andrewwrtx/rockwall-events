import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const categoryColors = {
  music: 'bg-purple-100 text-purple-700',
  food: 'bg-orange-100 text-orange-700',
  arts: 'bg-pink-100 text-pink-700',
  sports: 'bg-green-100 text-green-700',
  family: 'bg-yellow-100 text-yellow-700',
  theater: 'bg-red-100 text-red-700',
  business: 'bg-blue-100 text-blue-700',
  education: 'bg-indigo-100 text-indigo-700',
  community: 'bg-teal-100 text-teal-700',
  festivals: 'bg-rose-100 text-rose-700',
}

const categoryDots = {
  music: 'bg-purple-500',
  food: 'bg-orange-500',
  arts: 'bg-pink-500',
  sports: 'bg-green-500',
  family: 'bg-yellow-500',
  theater: 'bg-red-500',
  business: 'bg-blue-500',
  education: 'bg-indigo-500',
  community: 'bg-teal-500',
  festivals: 'bg-rose-500',
}

const categoryLabels = {
  music: 'Music & Live Entertainment',
  food: 'Food & Drink',
  arts: 'Arts & Culture',
  sports: 'Sports & Recreation',
  family: 'Family & Kids',
  theater: 'Theater & Comedy',
  business: 'Business & Networking',
  education: 'Education & Workshops',
  community: 'Community & Charity',
  festivals: 'Festivals & Fairs',
}

function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
      if (!error && data) setEvent(data)
      setLoading(false)
    }
    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Event not found.</p>
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    )
  }

  const formatDate = function(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  const colorClass = categoryColors[event.category] || 'bg-gray-100 text-gray-600'
  const dotClass = categoryDots[event.category] || 'bg-gray-400'
  const label = categoryLabels[event.category] || event.category

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <Link to="/" className="text-gray-400 hover:text-gray-700 text-sm transition inline-block mb-8">
          Back to Home
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="bg-gray-900 px-8 py-10">
            <div className="flex items-center gap-2 mb-4">
              <div className={dotClass + ' w-2 h-2 rounded-full'}></div>
              <span className={colorClass + ' text-xs font-medium px-2 py-0.5 rounded-full'}>{label}</span>
              {event.is_featured && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">FEATURED</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">{event.title}</h1>
          </div>

          <div className="px-8 py-8">

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                <p className="text-gray-900 font-medium">{formatDate(event.date)}</p>
              </div>
              {event.time && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-gray-900 font-medium">{event.time}</p>
                </div>
              )}
              {event.location_name && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-gray-900 font-medium">{event.location_name}</p>
                  {event.address && <p className="text-gray-500 text-sm mt-0.5">{event.address}</p>}
                </div>
              )}
              {event.price && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-gray-900 font-medium">{event.price}</p>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mb-8 border-t border-gray-100 pt-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">About this Event</p>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {event.ticket_url && (
                <a href={event.ticket_url} target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-700 transition">
                  Get Tickets
                </a>
              )}
              {event.website_url && (
                <a href={event.website_url} target="_blank" rel="noopener noreferrer" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-center hover:border-gray-500 transition">
                  Event Website
                </a>
              )}
            </div>

            {event.address && (
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Location</p>
                <a
                  href={'https://maps.google.com/?q=' + encodeURIComponent(event.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm transition"
                >
                  {event.address} — Open in Google Maps
                </a>
              </div>
            )}

          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-gray-700 text-sm transition">
            See all Rockwall events
          </Link>
        </div>

      </div>
    </div>
  )
}

export default EventDetail
