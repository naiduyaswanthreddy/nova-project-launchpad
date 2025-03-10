interface ProductCardProps {
  tag: string
  title: string
  imageUrl: string
}

export const ProductCard = ({ tag, title, imageUrl }: ProductCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            See more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <span className="text-sm text-gray-500 uppercase">{tag}</span>
        <h3 className="text-xl font-semibold mt-2 mb-4">{title}</h3>
        <img src={imageUrl} alt={title} className="w-full h-64 object-cover" />
      </div>
    </article>
  )
}
