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

  return (
    <div className="bg-gray-900 py-12 md:py-16 px-4 border-t border-gray-800">
      <div className="max-w-xl mx-auto text-center">
        {status === 'success' ? (
          <div>
            <p className="text-xl md:text-2xl font-bold text-white mb-2">You're in!</p>
            <p className="text-gray-400 text-sm">Weekly Rockwall County events every Thursday.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Never miss an event</h3>
            <p className="text-gray-400 text-sm mb-6">Weekly roundup of upcoming events, every Thursday.</p>

            {status === 'already' && (
              <p className="text-gray-400 text-sm mb-4">You're already subscribed!</p>
            )}

            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={firstName}
                onChange={function(e) { setFirstName(e.target.value) }}
                placeholder="First name (optional)"
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-500 w-full"
              />
              <input
                type="email"
                value={email}
                onChange={function(e) { setEmail(e.target.value) }}
                onKeyDown={function(e) { if (e.key === 'Enter') handleSubmit() }}
                placeholder="your@email.com"
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-gray-500 w-full"
              />
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="bg-white text-gray-900 font-semibold px-5 py-3 rounded-lg text-sm hover:bg-gray-100 transition disabled:opacity-50 w-full"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe — It\'s Free'}
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsletterSignup
