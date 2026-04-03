"use client"

import { menus } from "@/lib/data"

interface CartItem {
  menuId: number
  qty: number
  extraSize?: boolean
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
  onUpdateCart: (menuId: number, qty: number, extraSize?: boolean) => void
  onCheckout: () => void
  total: number
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:w-96 bg-white h-full shadow-2xl p-5 overflow-y-auto border-l border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-700">🛒 รายการอาหารสินค้า</h2>
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
          >
            ปิด
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-gray-500">รายการอาหารว่าง</div>
        ) : (
          cart.map((item) => {
            const menuItem = menus.find((m) => m.id === item.menuId)
            if (!menuItem) return null
            const itemPrice = menuItem.price + (item.extraSize ? 10 : 0)
            return (
              <div key={`${item.menuId}-${item.extraSize ? 'extra' : 'normal'}`} className="border-b border-gray-200 py-3">
                <div className="font-semibold text-lg text-gray-800">
                  {menuItem.name}
                  {item.extraSize && <span className="text-orange-600 text-sm"> (พิเศษ)</span>}
                </div>
                <div className="text-sm text-gray-500">{item.qty} x ฿{itemPrice} = ฿{itemPrice * item.qty}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onUpdateCart(item.menuId, Math.max(0, item.qty - 1), item.extraSize)}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition"
                  >-</button>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">{item.qty}</span>
                  <button
                    onClick={() => onUpdateCart(item.menuId, item.qty + 1, item.extraSize)}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition"
                  >+</button>
                </div>
              </div>
            )
          })
        )}

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>ยอดรวม</span>
            <span>₿{total}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="mt-3 w-full py-2 bg-orange-500 text-white rounded disabled:opacity-50"
          >
            ไปชำระเงิน
          </button>
        </div>
      </div>
    </div>
  )
}
