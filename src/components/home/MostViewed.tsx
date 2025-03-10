export const MostViewed = () => {
  return (
    <aside className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Most Viewed Content of the Day</h2>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Nishhair</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>By Parul Gulati</span>
            <span>•</span>
            <span>Owner</span>
          </div>
        </div>
        <img
          src="https://placehold.co/337x437/d2e2fb/d2e2fb"
          alt="Most Viewed Content"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </aside>
  )
}
