function FeaturedSuccess() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">⭐</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Received!</h1>
      <p className="text-gray-600 text-lg mb-2">Thanks for upgrading to a Featured Listing!</p>
      <p className="text-gray-500 mb-8">We'll apply the featured status to your event within a few hours. Check back soon!</p>
      <a
        href="/"
        className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition inline-block"
      >
        Back to Home
      </a>
    </div>
  )
}

export default FeaturedSuccess
