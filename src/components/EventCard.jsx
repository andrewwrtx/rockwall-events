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

function EventCard({ event }) {
  const colorClass = categoryColors[event.category] || 'bg-gray-100 text-gray-600'
  const dotClass = categoryDots[event.category] || 'bg-gray-400'
  const label = categoryLabels[event.category] || event.category

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={
      'bg-white rounded-xl p-5 hover:shadow-md transition relative border ' +
      (event.is_featured ? 'border-yellow-400 shadow-sm' : 'border-gray-200')
    }>
      {event.is_featured && (
        <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
          FEATURED
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={dotClass + ' w-2 h-2 rounded-full mt-2 flex-shrink-0'}></div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base leading-tight pr-16">{event.title}</h3>
          <p className="text-blue-600 text-sm mt-1 font-medium">{formatDate(event.date)}</p>
          <div className="mt-1 space-y-0.5">
            {event.time && <p className="text-gray-500 text-sm">{event.time}</p>}
            {event.location_name && <p className="text-gray-500 text-sm">{event.location_name}</p>}
            {event.price && <p className="text-gray-500 text-sm">{event.price}</p>}
          </div>
          {event.description && (
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{event.description}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className={colorClass + ' text-xs font-medium px-2 py-0.5 rounded-full'}>
              {label}
            </span>
            {event.website_url && (
              <a
                href={event.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-xs hover:text-blue-700 transition"
              >
                More info →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
