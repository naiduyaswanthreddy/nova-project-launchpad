export const Banner = () => {
  return (
    <section className="bg-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <img
              src="https://placehold.co/400x400/e8b4b6/e8b4b6"
              alt="Women's Day Illustration"
              className="max-w-md mx-auto"
            />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-4xl font-bold text-pink-600 mb-4">Women's Day</h2>
            <p className="text-xl text-gray-600 mb-4">SPECIAL OFFER</p>
            <p className="text-6xl font-bold text-pink-600">50% OFF</p>
          </div>
        </div>
      </div>
    </section>
  )
}
