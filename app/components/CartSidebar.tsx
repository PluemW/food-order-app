"use client"

import { menus } from "@/lib/data"

const optionLabels: Record<string, string> = {
  "no-spicy": "ไม่เผ็ด",
  "less-spicy": "เผ็ดน้อย",
  "spicy": "เผ็ดปกติ",
  "extra-spicy": "เผ็ดมาก",
  "no-sugar": "ไม่หวาน",
  "less-sugar": "หวานน้อย",
  "normal-sugar": "หวานปกติ",
  "extra-sugar": "หวานมาก",
  "hot": "ร้อน",
  "cold": "เย็น",
}

interface CartItem {
  menuId: number
  qty: number
  option?: string
  extraSize?: boolean
  temperature?: "hot" | "cold"
}

export default function CartSidebar({
  cart,
  onClose,
  onUpdateCart,
  onCheckout,
  total,
}: {
  cart: CartItem[]
  onClose: () => void, temperature?: "hot" | "cold"
  onUpdateCart: (menuId: number, qty: number, option?: string, extraSize?: boolean, temperature?: "hot" | "cold") => void
  onCheckout: () => void
  total: number
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:w-114 bg-white h-full shadow-2xl p-5 overflow-y-auto border-l-4 border-green-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700">รายการอาหารสินค้า</h2>
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 transition"
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
            const extraPrice = item.extraSize ? 10 : 0
            const itemPrice = menuItem.price + extraPrice
            return (
              <div key={`${item.menuId}-${item.option ?? "default"}-${item.extraSize ? "big" : "normal"}-${item.temperature ?? "default"}`} className="border-b border-gray-200 py-3">
                <div className="font-semibold text-lg text-gray-800">
                  {menuItem.name}
                  {item.extraSize && (
                    <span className="text-green-600 text-sm"> (ใหญ่พิเศษ)</span>
                  )}
                  {item.option && (
                    <span className="text-green-600 text-sm"> ({optionLabels[item.option] ?? item.option})</span>
                  )}
                  {item.temperature && (
                    <span className="text-blue-600 text-sm"> ({optionLabels[item.temperature] ?? item.temperature})</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{item.qty} x ฿{itemPrice} = ฿{itemPrice * item.qty}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onUpdateCart(item.menuId, Math.max(0, item.qty - 1), item.option, item.extraSize, item.temperature)}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
                  >-</button>
                  <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700">{item.qty}</span>
                  <button
                    onClick={() => onUpdateCart(item.menuId, item.qty + 1, item.option, item.extraSize, item.temperature)}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
                  >+</button>
                </div>
              </div>
            )
          })
        )}

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>ยอดรวม</span>
            <span className="text-amber-600">฿{total}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="mt-3 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition"
          >
            ไปชำระเงิน
          </button>
        </div>
      </div>
    </div>
  )
}
