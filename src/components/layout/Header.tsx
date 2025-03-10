import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const Header = () => {
  return (
    <header className="border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 gap-8">
            <img
              src="https://placehold.co/191x39/252b60/252b60"
              alt="Mercari Logo"
              className="h-10"
            />
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full pl-4 pr-10 py-2"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Premium Membership</Button>
            <Button>Sell</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
