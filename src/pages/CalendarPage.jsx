import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

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

const categoryLabels = {
  music: 'Music',
  food: 'Food & Drink',
  arts: 'Arts',
  sports: 'Sports',
  family: 'Family',
  theater: 'Theater',
  business: 'Business',
  education: 'Education',
  community: 'Community',
  festivals: 'Festivals',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function CalendarPage() {
  const today = new Date()
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)
  const [activeFilters, setActiveFilters] = useState([])

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: true })

      if (!error && data) setEvents(data)
      setLoading(false)
    }
    fetchEvents()
  }, [])

  function toggleFilter(cat) {
    setActiveFilters(function(prev) {
      if (prev.includes(cat)) return prev.filter(function(c) { return c !== cat })
      return [...prev, cat]
    })
  }

  const filteredEvents = activeFilters.length === 0
    ? events
    : events.filter(function(e) { return activeFilters.includes(e.category) })

  function getEventsForDay(year, month, day) {
    const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0')
    return filteredEvents.filter(function(e) { return e.date === dateStr })
  }

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
    else setCurrentMonth(currentMonth - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
    else setCurrentMonth(currentMonth + 1)
    setSelectedDay(null)
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
  const selectedEvents = selectedDay ? getEventsForDay(currentYear, currentMonth, selectedDay) : []

  const formatSelectedDate = function() {
    if (!selectedDay) return ''
    return new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const monthEvents = filteredEvents.filter(function(e) {
    const d = new Date(e.date + 'T00:00:00')
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events Calendar</h1>
            <p className="text-gray-400 text-sm mt-1">Click a day or event to see details</p>
          </div>
          <Link to="/" className="text-gray-400 hover:text-gray-700 text-sm transition">← Back</Link>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(categoryLabels).map(function(cat) {
              const active = activeFilters.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={function() { toggleFilter(cat) }}
                  className={
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ' +
                    (active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400')
                  }
                >
                  <span className={categoryDots[cat] + ' w-1.5 h-1.5 rounded-full'}></span>
                  {categoryLabels[cat]}
                </button>
              )
            })}
            {activeFilters.length > 0 && (
              <button onClick={function() { setActiveFilters([]) }} className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-700 transition">
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900">
            <button onClick={prevMonth} className="text-gray-400 hover:text-white transition px-2 py-1 text-lg">←</button>
            <h2 className="text-white font-semibold">{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={nextMonth} className="text-gray-400 hover:text-white transition px-2 py-1 text-lg">→</button>
          </div>

          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {DAYS.map(function(day) {
              return <div key={day} className="text-center text-xs font-semibold text-gray-400 py-3">{day}</div>
            })}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map(function(_, i) {
              return <div key={'e' + i} className="border-r border-b border-gray-100 min-h-16 bg-gray-50"></div>
            })}
            {Array.from({ length: daysInMonth }).map(function(_, i) {
              const day = i + 1
              const dayStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0')
              const dayEvents = getEventsForDay(currentYear, currentMonth, day)
              const isToday = dayStr === todayStr
              const isSelected = selectedDay === day

              return (
                <div
                  key={day}
                  onClick={function() { setSelectedDay(isSelected ? null : day) }}
                  className={
                    'border-r border-b border-gray-100 min-h-16 p-2 cursor-pointer transition ' +
                    (isSelected ? 'bg-gray-100' : 'hover:bg-gray-50')
                  }
                >
                  <span className={
                    'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ' +
                    (isToday ? 'bg-gray-900 text-white' : 'text-gray-700')
                  }>
                    {day}
                  </span>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map(function(event, idx) {
                      return <span key={idx} className={categoryDots[event.category] + ' w-1.5 h-1.5 rounded-full'}></span>
                    })}
                    {dayEvents.length > 3 && <span className="text-gray-400 text-xs">+{dayEvents.length - 3}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selectedDay && (
          <div className="border border-gray-200 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">{formatSelectedDate()}</h3>
            {selectedEvents.length === 0 ? (
              <p className="text-gray-400 text-sm">No events on this day.</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(function(event) {
                  return (
                    <div
                      key={event.id}
                      onClick={function() { navigate('/event/' + event.id) }}
                      className="flex items-center gap-3 py-3 px-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <span className={categoryDots[event.category] + ' w-2 h-2 rounded-full flex-shrink-0'}></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium">{event.title}</p>
                        <p className="text-gray-400 text-sm">{event.time || 'Time TBD'}{event.location_name ? ' · ' + event.location_name : ''}</p>
                      </div>
                      <span className={categoryColors[event.category] + ' text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0'}>
                        {categoryLabels[event.category]}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {MONTHS[currentMonth]} Events {monthEvents.length > 0 ? '(' + monthEvents.length + ')' : ''}
          </p>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : monthEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">No events this month.</p>
          ) : (
            <div className="space-y-2">
              {monthEvents.map(function(event) {
                const d = new Date(event.date + 'T00:00:00')
                return (
                  <div
                    key={event.id}
                    onClick={function() { navigate('/event/' + event.id) }}
                    className="flex items-center gap-4 border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-400 hover:shadow-sm cursor-pointer transition"
                  >
                    <div className="text-center min-w-10">
                      <p className="text-gray-400 text-xs">{DAYS[d.getDay()]}</p>
                      <p className="text-gray-900 font-bold text-lg leading-none">{d.getDate()}</p>
                    </div>
                    <span className={categoryDots[event.category] + ' w-2 h-2 rounded-full flex-shrink-0'}></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">{event.title}</p>
                      <p className="text-gray-400 text-sm truncate">{event.time || ''}{event.location_name ? ' · ' + event.location_name : ''}</p>
                    </div>
                    <span className={categoryColors[event.category] + ' text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0'}>
                      {categoryLabels[event.category]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CalendarPage
