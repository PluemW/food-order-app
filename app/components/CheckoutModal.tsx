"use client"

import { useState } from "react"
import { menus } from "@/lib/data"

interface CartItem {
  menuId: number
  qty: number
}

export default function CheckoutModal({
  cart,
  total,
  onClose,
  onSubmit,
  submitting,
}: {
  cart: CartItem[]
  total: number
  onClose: () => void
  onSubmit: (data: {
    customerName: string
    orderType: "delivery" | "dine-in"
    tableNumber?: string
    phone?: string
    notes?: string
  }) => void
  submitting: boolean
}) {
  const [orderType, setOrderType] = useState<"delivery" | "dine-in">("dine-in")
  const [customerName, setCustomerName] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!customerName.trim()) {
      setError("Please enter your name")
      return
    }

    if (orderType === "dine-in" && !tableNumber.trim()) {
      setError("Please enter your table number")
      return
    }

    if (orderType === "delivery" && !phone.trim()) {
      setError("Please enter your phone number")
      return
    }

    onSubmit({
      customerName: customerName.trim(),
      orderType,
      tableNumber: orderType === "dine-in" ? tableNumber.trim() : undefined,
      phone: orderType === "delivery" ? phone.trim() : undefined,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 p-6 sticky top-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cart.map((item) => {
                  const menuItem = menus.find(m => m.id === item.menuId)
                  if (!menuItem) return null
                  return (
                    <div key={item.menuId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {menuItem.icon} {menuItem.name} x{item.qty}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₿{menuItem.price * item.qty}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-orange-600">₿{total}</span>
              </div>
            </div>

            {/* Order Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Order Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOrderType("dine-in")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    orderType === "dine-in"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">🍽️</div>
                  <p className="font-semibold text-gray-900">Dine In</p>
                </button>
                <button
                  onClick={() => setOrderType("delivery")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    orderType === "delivery"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">🚚</div>
                  <p className="font-semibold text-gray-900">Delivery</p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Table Number or Phone */}
              {orderType === "dine-in" ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Table Number * (Numbers Only)
                  </label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter table number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">💬 รอรับ (Waiting for pickup): Enter 0</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any allergies or special instructions?"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
              >
                {submitting ? "⏳ Placing Order..." : "✅ Place Order"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
