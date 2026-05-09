import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'rockwall@2026!'

function Admin() {
  const [authed, setAuthed] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [tab, setTab] = useState('pending')
  const [submissions, setSubmissions] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  function handleLogin() {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  useEffect(() => {
    if (authed) {
      fetchAll()
    }
  }, [authed])

  async function fetchAll() {
    setLoading(true)
    const { data: subs } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: evts } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (subs) setSubmissions(subs)
    if (evts) setEvents(evts)
    setLoading(false)
  }

  async function approveSubmission(sub) {
    const { error } = await supabase
      .from('events')
      .insert([{
        title: sub.title,
        description: sub.description,
        category: sub.category,
        date: sub.date,
        time: sub.time,
        location_name: sub.location_name,
        address: sub.address,
        price: sub.price,
        website_url: sub.website_url,
        ticket_url: sub.ticket_url,
        contact_email: sub.contact_email,
        status: 'approved',
        is_featured: false,
        submitted_by: sub.contact_email,
      }])

    if (!error) {
      await supabase
        .from('submissions')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', sub.id)

      setActionMsg('Event approved and is now live!')
      fetchAll()
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  async function rejectSubmission(id) {
    await supabase
      .from('submissions')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', id)

    setActionMsg('Submission rejected.')
    fetchAll()
    setTimeout(() => setActionMsg(''), 3000)
  }

  async function deleteEvent(id) {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    setActionMsg('Event deleted.')
    fetchAll()
    setTimeout(() => setActionMsg(''), 3000)
  }

  async function toggleFeatured(event) {
    await supabase
      .from('events')
      .update({ is_featured: !event.is_featured })
      .eq('id', event.id)
    setActionMsg(event.is_featured ? 'Removed featured status.' : 'Event is now featured!')
    fetchAll()
    setTimeout(() => setActionMsg(''), 3000)
  }

  const pendingSubs = submissions.filter(function(s) { return s.status === 'pending' })
  const reviewedSubs = submissions.filter(function(s) { return s.status !== 'pending' })

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">Rockwall County Events Admin Panel</p>
          </div>
          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
              Incorrect password. Try again.
            </div>
          )}
          <input
            type="password"
            value={passwordInput}
            onChange={function(e) { setPasswordInput(e.target.value) }}
            onKeyDown={function(e) { if (e.key === 'Enter') handleLogin() }}
            placeholder="Enter admin password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rockwall County Events — Admin</h1>
          <p className="text-gray-500 text-sm">Manage submissions and events</p>
        </div>
        <a href="/" className="text-blue-600 text-sm hover:underline">View Site</a>
      </div>

      {actionMsg && (
        <div className="bg-green-500 text-white text-center py-2 text-sm font-medium">
          {actionMsg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-600">{events.length}</p>
            <p className="text-gray-500 text-sm mt-1">Live Events</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-yellow-500">{pendingSubs.length}</p>
            <p className="text-gray-500 text-sm mt-1">Pending Review</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-gray-700">{submissions.length}</p>
            <p className="text-gray-500 text-sm mt-1">Total Submissions</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={function() { setTab('pending') }}
            className={tab === 'pending' ? 'px-4 py-2 rounded-lg font-medium bg-blue-600 text-white' : 'px-4 py-2 rounded-lg font-medium bg-white text-gray-600 hover:bg-gray-50'}
          >
            Pending ({pendingSubs.length})
          </button>
          <button
            onClick={function() { setTab('events') }}
            className={tab === 'events' ? 'px-4 py-2 rounded-lg font-medium bg-blue-600 text-white' : 'px-4 py-2 rounded-lg font-medium bg-white text-gray-600 hover:bg-gray-50'}
          >
            Live Events ({events.length})
          </button>
          <button
            onClick={function() { setTab('reviewed') }}
            className={tab === 'reviewed' ? 'px-4 py-2 rounded-lg font-medium bg-blue-600 text-white' : 'px-4 py-2 rounded-lg font-medium bg-white text-gray-600 hover:bg-gray-50'}
          >
            Reviewed ({reviewedSubs.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div>

            {tab === 'pending' && (
              <div>
                {pendingSubs.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
                    No pending submissions. You are all caught up!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSubs.map(function(sub) {
                      return (
                        <div key={sub.id} className="bg-white rounded-xl shadow-sm p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg">{sub.title}</h3>
                              <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                                <p>Date: {sub.date}</p>
                                <p>Time: {sub.time || 'Not specified'}</p>
                                <p>Category: {sub.category}</p>
                                <p>Price: {sub.price || 'Not specified'}</p>
                                <p>Venue: {sub.location_name || 'Not specified'}</p>
                                <p>Submitted by: {sub.submitter_name || 'Anonymous'}</p>
                                <p>Email: {sub.contact_email}</p>
                                <p>Submitted: {new Date(sub.created_at).toLocaleDateString()}</p>
                              </div>
                              {sub.description && (
                                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{sub.description}</p>
                              )}
                              {sub.website_url && (
                                <a href={sub.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                                  {sub.website_url}
                                </a>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 min-w-fit">
                              <button
                                onClick={function() { approveSubmission(sub) }}
                                className="bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={function() { rejectSubmission(sub.id) }}
                                className="bg-red-100 text-red-700 px-5 py-2 rounded-lg font-medium hover:bg-red-200 transition"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === 'events' && (
              <div className="space-y-3">
                {events.map(function(event) {
                  return (
                    <div key={event.id} className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{event.title}</h3>
                          {event.is_featured && (
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">FEATURED</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{event.date} — {event.category} — {event.location_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={function() { toggleFeatured(event) }}
                          className={event.is_featured ? 'text-xs px-3 py-1.5 rounded-lg border border-yellow-300 text-yellow-700 hover:bg-yellow-50' : 'text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50'}
                        >
                          {event.is_featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={function() { deleteEvent(event.id) }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {tab === 'reviewed' && (
              <div className="space-y-3">
                {reviewedSubs.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
                    No reviewed submissions yet.
                  </div>
                ) : (
                  reviewedSubs.map(function(sub) {
                    return (
                      <div key={sub.id} className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{sub.title}</h3>
                          <p className="text-sm text-gray-500">{sub.date} — {sub.contact_email}</p>
                        </div>
                        <span className={sub.status === 'approved' ? 'bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full' : 'bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full'}>
                          {sub.status.toUpperCase()}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
