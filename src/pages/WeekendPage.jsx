import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import EventCard from '../components/EventCard'

function getWeekendDates() {
  const today = new Date()
  const day = today.getDay()
  const friday = new Date(today)
  friday.setDate(today.getDate() + ((5 - day + 7) % 7 === 0 && day === 5 ? 0 : (5 - day + 7) % 7))
  const saturday = new Date(friday)
  saturday.setDate(friday.getDate() + 1)
  const sunday = new Date(friday)
  sunday.setDate(friday.getDate() + 2)

  function fmt(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  }

  return { dates: [fmt(friday), fmt(saturday), fmt(sunday)], friday, saturday, sunday }
}

function WeekendPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { dates, friday, saturday, sunday } = getWeekendDates()

  const formatShort = function(d) {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  }

  const formatFull = function(d) {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .in('date', dates)
        .order('date', { ascending: true })
        .order('is_featured', { ascending: false })
      if (!error && data) setEvents(data)
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const fridayEvents = events.filter(function(e) { return e.date === dates[0] })
  const saturdayEvents = events.filter(function(e) { return e.date === dates[1] })
  const sundayEvents = events.filter(function(e) { return e.date === dates[2] })
  const weekendLabel = formatShort(friday) + ' – ' + formatShort(sunday)

  function DaySection({ label, date, dayEvents }) {
    if (dayEvents.length === 0) return null
    return (
      <section className="mb-10">
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">{formatFull(date)}</h2>
          <div className="h-px bg-gray-200 mt-3"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dayEvents.map(function(event) {
            return <EventCard key={event.id} event={event} />
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-900 py-12 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">Rockwall County, TX</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">This Weekend</h1>
          <p className="text-gray-300 text-base md:text-lg">{weekendLabel}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading weekend events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg font-medium mb-2">Nothing listed yet for this weekend</p>
            <p className="text-gray-400 text-sm mb-8">Check back soon or browse all upcoming events.</p>
            <Link to="/calendar" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition inline-block">
              View Full Calendar
            </Link>
          </div>
        ) : (
          <div>
            <DaySection label="Friday" date={friday} dayEvents={fridayEvents} />
            <DaySection label="Saturday" date={saturday} dayEvents={saturdayEvents} />
            <DaySection label="Sunday" date={sunday} dayEvents={sundayEvents} />
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/calendar" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-500 transition text-center">
            View Full Calendar
          </Link>
          <Link to="/" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:border-gray-500 transition text-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WeekendPage
