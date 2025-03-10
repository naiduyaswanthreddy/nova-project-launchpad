import { ProductCard } from "./ProductCard"
import { MostViewed } from "./MostViewed"

export const ProductGrid = () => {
  const products = [
    {
      tag: "KIDS' TOYS & FUN ACCESSORIES",
      title: "Kids' Toys",
      imageUrl: "https://placehold.co/400x300/d2e2fb/d2e2fb"
    },
    {
      tag: "MOTHER & DAUGHTER MATCHING OUTFITS",
      title: "Mother & Kid Clothing",
      imageUrl: "https://placehold.co/400x300/d2e2fb/d2e2fb"
    },
    {
      tag: "TOPS, JEANS, DRESSES, KURTA",
      title: "WOMEN CLOTHING",
      imageUrl: "https://placehold.co/400x300/d2e2fb/d2e2fb"
    }
  ]

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <MostViewed />
        </div>
      </div>
    </section>
  )
}
