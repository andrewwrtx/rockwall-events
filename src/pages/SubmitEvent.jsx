import { useState } from 'react'
import { supabase } from '../supabaseClient'

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_eVq6ozgRT6tc1M53wD4Vy00'

const categories = [
  { id: 'music', label: 'Music & Live Entertainment' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'arts', label: 'Arts & Culture' },
  { id: 'sports', label: 'Sports & Recreation' },
  { id: 'family', label: 'Family & Kids' },
  { id: 'theater', label: 'Theater & Comedy' },
  { id: 'business', label: 'Business & Networking' },
  { id: 'education', label: 'Education & Workshops' },
  { id: 'community', label: 'Community & Charity' },
  { id: 'festivals', label: 'Festivals & Fairs' },
]

function SubmitEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location_name: '',
    address: '',
    price: '',
    website_url: '',
    ticket_url: '',
    contact_email: '',
    submitter_name: '',
  })

  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setStatus('loading')
    setErrorMsg('')

    if (!form.title || !form.date || !form.category || !form.contact_email) {
      setErrorMsg('Please fill in all required fields.')
      setStatus('idle')
      return
    }

    const { error } = await supabase
      .from('submissions')
      .insert([{
        title: form.title,
        description: form.description,
        category: form.category,
        date: form.date,
        time: form.time,
        location_name: form.location_name,
        address: form.address,
        price: form.price,
        website_url: form.website_url,
        ticket_url: form.ticket_url,
        contact_email: form.contact_email,
        submitter_name: form.submitter_name,
        status: 'pending',
      }])

    if (error) {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('idle')
    } else {
      setStatus('success')
    }
  }

  function handleUpgradeToFeatured() {
    const stripeUrl = STRIPE_PAYMENT_LINK + '?prefilled_email=' + encodeURIComponent(form.contact_email) + '&client_reference_id=' + encodeURIComponent(form.title)
    window.open(stripeUrl, '_blank')
  }

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Event Submitted!</h1>
        <p className="text-gray-600 text-lg mb-2">Thanks for submitting your event to Rockwall Events.</p>
        <p className="text-gray-500 mb-8">We'll review it and get it posted within 24 hours. You'll hear from us at <strong>{form.contact_email}</strong>.</p>

        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
          <div className="text-3xl mb-2">⭐</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Want more visibility?</h2>
          <p className="text-gray-600 text-sm mb-4">Upgrade to a <strong>Featured Listing</strong> for just <strong>$15</strong> and get:</p>
          <ul className="text-sm text-gray-600 text-left max-w-xs mx-auto mb-5 space-y-1">
            <li>✅ Bold gold border on your event card</li>
            <li>✅ FEATURED badge on your listing</li>
            <li>✅ Pinned to the top of your category page</li>
            <li>✅ Highlighted on the homepage</li>
          </ul>
          <button
            onClick={handleUpgradeToFeatured}
            className="bg-yellow-400 text-yellow-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition text-lg"
          >
            Upgrade to Featured — $15
          </button>
          <p className="text-xs text-gray-400 mt-2">Secure payment via Stripe. One-time fee per event.</p>
        </div>

        <div className="flex gap-3 justify-center">
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
          <button
            onClick={function() {
              setStatus('idle')
              setForm({ title: '', description: '', category: '', date: '', time: '', location_name: '', address: '', price: '', website_url: '', ticket_url: '', contact_email: '', submitter_name: '' })
            }}
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Submit Another Event
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:underline text-sm">Back to Home</a>
        <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-1">Submit an Event</h1>
        <p className="text-gray-500">Share what's happening in Rockwall! All submissions are reviewed before going live.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Rockwall Farmers Market"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
              <input
                type="text"
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="e.g. 6:00 PM - 9:00 PM"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {categories.map(function(cat) {
                return <option key={cat.id} value={cat.id}>{cat.label}</option>
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell people what to expect..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Venue Name</label>
            <input
              type="text"
              name="location_name"
              value={form.location_name}
              onChange={handleChange}
              placeholder="e.g. Rockwall Harbor"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. 2060 Summer Lee Dr, Rockwall, TX"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price / Cost</label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. Free, $10, $5-15"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Event Website</label>
            <input
              type="url"
              name="website_url"
              value={form.website_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ticket Link</label>
            <input
              type="url"
              name="ticket_url"
              value={form.ticket_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Your Contact Info</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                <input
                  type="text"
                  name="submitter_name"
                  value={form.submitter_name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={form.contact_email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Your email is only used to notify you when your event is approved. It won't be shown publicly.</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Event'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default SubmitEvent
