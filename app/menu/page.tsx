"use client"

import { useState } from "react"
import { menus, categories } from "@/lib/data"
import type { MenuItem } from "@/lib/data"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("main")
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [cart, setCart] = useState<{ menuId: number; qty: number }[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const filteredItems = menus.filter(item => item.category === activeCategory)

  const addToCart = (menuId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuId === menuId)
      if (existing) {
        return prev.map(item =>
          item.menuId === menuId ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { menuId, qty: 1 }]
    })
  }

  const updateCart = (menuId: number, qty: number) => {
    if (qty === 0) {
      setCart(prev => prev.filter(item => item.menuId !== menuId))
    } else {
      setCart(prev =>
        prev.map(item =>
          item.menuId === menuId ? { ...item, qty } : item
        )
      )
    }
  }

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

  const cartTotal = cart.reduce((sum, item) => {
    const menuItem = menus.find(m => m.id === item.menuId)
    return sum + (menuItem?.price || 0) * item.qty
  }, 0)

  return (
    <main className="min-h-screen bg-white pb-24 sm:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 py-8 px-4 sm:px-6 md:px-8 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">Our Menu</h1>
            <p className="text-gray-600">Discover authentic flavors</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            🛒 Cart
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
            <p className="text-gray-500 text-lg">No items available in this category</p>
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
  onAddToCart: (menuId: number) => void
}) {
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
          <div className="text-2xl sm:text-3xl font-bold text-orange-600">₿{item.price}</div>
          <button
            onClick={() => onAddToCart(item.id)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}