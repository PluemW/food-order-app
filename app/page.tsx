import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="ร้านอาหารบ้านตา" width={240} height={240} />
        </div>
        <Link href="/menu" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium">
          ดูเมนู
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              ร้านอาหารบ้านตา
            </h1>
            <p className="text-2xl font-semibold text-green-800 mb-6">
              ร้านอาหารรสจัดอร่อยถูกปาก พร้อมความเป็นกันเองเหมือนกินข้าวกับครอบครัว
            </p>
            <div className="space-y-4 text-gray-700 mb-8 leading-relaxed">
              <p>ร้านจะเปิดทุกวันอาทิตย์ถึงศุกร์ เวลา 17.00-22.00 น.</p>
              <p>เมนูหลากหลายมาก (ข้าว / กับข้าว / ยำ / ต้ม / เส้น / ของกินเล่น / เครื่องดื่ม)</p>
              <p>"บ้านตา" หมายถึงความอบอุ่น (homey), อาหารบ้าน, ความเป็นกันเอง และให้ความรู้สึกเหมือนได้มากินข้าวกับครอบครัว</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/menu"
                className="px-56 py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-semibold text-center"
              >
                สั่งเลย
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-amber-100 rounded-3xl opacity-60 transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white to-green-50 rounded-3xl shadow-2xl flex items-center justify-center text-9xl">
                🍜
              </div>
            </div>
          </div>
        </div>
      </section>

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