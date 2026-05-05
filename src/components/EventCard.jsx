function EventCard({ event }) {
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

  const colorClass = categoryColors[event.category] || 'bg-gray-100 text-gray-700'
  const label = categoryLabels[event.category] || event.category

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const cardClass = event.is_featured
    ? 'bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition relative border-2 border-yellow-400'
    : 'bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition relative border border-gray-100'

  return (
    <div className={cardClass}>
      {event.is_featured && (
        <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
          FEATURED
        </span>
      )}
      <h3 className="font-bold text-gray-900 text-lg leading-tight pr-16">{event.title}</h3>
      <div className="mt-2 space-y-1">
        <p className="text-blue-600 font-medium text-sm">{formatDate(event.date)}</p>
        {event.time && <p className="text-gray-500 text-sm">{event.time}</p>}
        {event.location_name && <p className="text-gray-500 text-sm">{event.location_name}</p>}
        {event.price && <p className="text-gray-500 text-sm">{event.price}</p>}
      </div>
      {event.description && (
        <p className="text-gray-600 text-sm mt-3">{event.description}</p>
      )}
      <div className="mt-3">
        <span className={colorClass + ' text-xs font-medium px-2 py-1 rounded-full'}>
          {label}
        </span>
      </div>
      {event.website_url && (
        <a
          href={event.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-blue-600 text-sm hover:underline"
        >
          More info
        </a>
      )}
    </div>
  )
}

export default EventCard
