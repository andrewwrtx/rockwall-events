import { useState } from 'react'
import { supabase } from '../supabaseClient'

function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit() {
    if (!email) return
    setStatus('loading')

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email: email,
        first_name: firstName,
        confirmed: true,
        subscribed_at: new Date().toISOString(),
      }])

    if (error) {
      if (error.code === '23505') {
        setStatus('already')
      } else {
        setStatus('error')
      }
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-blue-700 text-white py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold mb-2">You're in!</h3>
          <p className="text-blue-100">Thanks for signing up! You'll get weekly Rockwall events in your inbox.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-700 text-white py-12 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">Never miss a Rockwall event</h3>
        <p className="text-blue-100 mb-6">Get a weekly roundup of upcoming events delivered to your inbox every Thursday.</p>

        {status === 'already' && (
          <p className="bg-blue-600 rounded-lg px-4 py-2 text-sm mb-4">You're already subscribed!</p>
        )}
        {status === 'error' && (
          <p className="bg-red-500 rounded-lg px-4 py-2 text-sm mb-4">Something went wrong. Please try again.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="text"
            value={firstName}
            onChange={function(e) { setFirstName(e.target.value) }}
            placeholder="First name (optional)"
            className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none w-full sm:w-40"
          />
          <input
            type="email"
            value={email}
            onChange={function(e) { setEmail(e.target.value) }}
            onKeyDown={function(e) { if (e.key === 'Enter') handleSubmit() }}
            placeholder="your@email.com"
            className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none flex-1"
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? 'Signing up...' : 'Sign Me Up'}
          </button>
        </div>
        <p className="text-blue-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}

export default NewsletterSignup
