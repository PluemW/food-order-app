"use client"

import { useState } from "react"
import { menus, categories } from "@/lib/data"
import type { MenuItem } from "@/lib/data"
import CartSidebar from "@/app/components/CartSidebar"
import CheckoutModal from "@/app/components/CheckoutModal"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("main")
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [cart, setCart] = useState<{ menuId: number; qty: number; extraSize?: boolean }[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const filteredItems = menus.filter(item => item.category === activeCategory)

  const addToCart = (menuId: number, extraSize: boolean = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuId === menuId && item.extraSize === extraSize)
      if (existing) {
        return prev.map(item =>
          item.menuId === menuId && item.extraSize === extraSize ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { menuId, qty: 1, extraSize }]
    })
  }

  const updateCart = (menuId: number, qty: number, extraSize?: boolean) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => !(item.menuId === menuId && item.extraSize === extraSize)))
    } else {
      setCart(prev =>
        prev.map(item =>
          item.menuId === menuId && item.extraSize === extraSize ? { ...item, qty } : item
        )
      )
    }
  }

  const cartTotal = cart.reduce((sum, item) => {
    const menuItem = menus.find(m => m.id === item.menuId)
    const basePrice = menuItem?.price || 0
    const extraPrice = item.extraSize ? 10 : 0
    return sum + (basePrice + extraPrice) * item.qty
  }, 0)

  const handleCheckout = async (customerData: {
    customerName: string
    orderType: "delivery" | "dine-in"
    tableNumber?: string
    phone?: string
    notes?: string
  }) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerData.customerName,
          items: cart,
          orderType: customerData.orderType,
          tableNumber: customerData.tableNumber,
          phone: customerData.phone,
          notes: customerData.notes,
        }),
      })

      if (res.ok) {
        alert("✅ Order placed successfully!")
        setCart([])
        setShowCheckout(false)
        setShowCart(false)
      } else {
        alert("❌ Failed to place order")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("❌ Error placing order")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 sm:pb-8 text-gray-800 antialiased">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-100 border-b border-orange-300 py-8 px-4 sm:px-6 md:px-8 sticky top-0 z-30 backdrop-blur-sm shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-orange-900 mb-1">เมนูอาหารของเรา</h1>
            <p className="text-gray-600">ค้นหารสชาติดั้งเดิมอร่อยทุกเมนู</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            🛒 รายการอาหาร
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2.5 py-1 rounded-full text-sm font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-20 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                  activeCategory === cat.key
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onHover={setHoveredId}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">ไม่มีรายการในหมวดหมู่นี้</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <CartSidebar
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateCart={updateCart}
          onCheckout={() => {
            setShowCart(false)
            setShowCheckout(true)
          }}
          total={cartTotal}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
          submitting={submitting}
        />
      )}
    </main>
  )
}

function MenuItem({
  item,
  isHovered,
  onHover,
  onAddToCart,
}: {
  item: MenuItem
  isHovered: boolean
  onHover: (id: number | null) => void
  onAddToCart: (menuId: number, extraSize?: boolean) => void
}) {
  const isMainDish = item.category === "main"

  return (
    <div
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-6xl sm:text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mt-6">
          <div className="text-2xl sm:text-3xl font-bold text-orange-600">฿{item.price}</div>
          {isMainDish ? (
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(item.id, false)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                เพิ่มปกติ
              </button>
              <button
                onClick={() => onAddToCart(item.id, true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                พิเศษ +10฿
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item.id, false)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              เพิ่ม
            </button>
          )}
        </div>
      </div>
    </div>
  )
}