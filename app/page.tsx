import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold text-orange-600">🍽️ FoodHub</div>
        <Link href="/menu" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
          Browse Menu
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Authentic Flavors, <span className="text-orange-600">Fresh Taste</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover the finest selection of authentic Asian cuisine. From aromatic curries to perfect noodle dishes, we bring you restaurant-quality food delivered fresh to your table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/menu"
                className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-center"
              >
                Start Ordering
              </Link>
              <Link 
                href="/menu"
                className="px-8 py-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-center"
              >
                View Full Menu
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl opacity-30 transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-50 to-yellow-50 rounded-3xl shadow-2xl flex items-center justify-center text-9xl">
                🍜
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon="✨" title="Premium Quality" description="Freshly prepared with the finest ingredients selected daily" />
            <FeatureCard icon="⚡" title="Quick Delivery" description="Fast and reliable service to your doorstep" />
            <FeatureCard icon="💰" title="Best Prices" description="Competitive pricing for authentic restaurant-quality food" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-20">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl py-16 px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-lg opacity-90 mb-8">Browse our delicious menu and place your order now</p>
          <Link 
            href="/menu"
            className="inline-block px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Browse Menu Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">© 2026 FoodHub. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}