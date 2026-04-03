"use client"

import { useState } from "react"
import { menus, categories } from "@/lib/data"
import type { MenuItem } from "@/lib/data"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("main")
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filteredItems = menus.filter(item => item.category === activeCategory)

  return (
    <main className="min-h-screen bg-white pb-24 sm:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 py-8 px-4 sm:px-6 md:px-8 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">Our Menu</h1>
            <p className="text-gray-600">Discover authentic flavors</p>
          </div>
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
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No items available in this category</p>
          </div>
        )}
      </div>
    </main>
  )
}

function MenuItem({
  item,
  isHovered,
  onHover,
}: {
  item: MenuItem
  isHovered: boolean
  onHover: (id: number | null) => void
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
        </div>
      </div>
    </div>
  )
}