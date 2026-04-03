"use client"

import { menus } from "@/lib/data"

interface CartItem {
  menuId: number
  qty: number
}

export default function CartSidebar({
  cart,
  onClose,
  onUpdateCart,
  onCheckout,
  total,
}: {
  cart: CartItem[]
  onClose: () => void
  onUpdateCart: (menuId: number, qty: number) => void
  onCheckout: () => void
  total: number
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">🛒 Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const menuItem = menus.find(m => m.id === item.menuId)
                if (!menuItem) return null

                return (
                  <div
                    key={item.menuId}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-3xl">{menuItem.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{menuItem.name}</h3>
                      <p className="text-orange-600 font-bold">₿{menuItem.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateCart(item.menuId, item.qty - 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                      >
                        −
                      </button>
                      <span className="px-3 font-semibold">{item.qty}</span>
                      <button
                        onClick={() => onUpdateCart(item.menuId, item.qty + 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-3xl font-bold text-orange-600">₿{total}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  )
}
