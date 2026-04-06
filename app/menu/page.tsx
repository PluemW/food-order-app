"use client"

import { useEffect, useState } from "react"
import { menus, categories, type MenuItem } from "@/lib/data"
import CartSidebar from "@/app/components/CartSidebar"
import CheckoutModal from "@/app/components/CheckoutModal"

const spiceOptions = [
  { value: "no-spicy", label: "ไม่เผ็ด" },
  { value: "less-spicy", label: "เผ็ดน้อย" },
  { value: "spicy", label: "เผ็ดปกติ" },
  { value: "extra-spicy", label: "เผ็ดมาก" },
]

const sweetnessOptions = [
  { value: "no-sugar", label: "ไม่หวาน" },
  { value: "less-sugar", label: "หวานน้อย" },
  { value: "normal-sugar", label: "หวานปกติ" },
  { value: "extra-sugar", label: "หวานมาก" },
]

const temperatureOptions = [
  { value: "hot", label: "☕ ร้อน" },
  { value: "cold", label: "🧊 เย็น" },
]

const optionLabels: Record<string, string> = {
  "no-spicy": "ไม่เผ็ด",
  "less-spicy": "เผ็ดน้อย",
  "spicy": "เผ็ดปกติ",
  "extra-spicy": "เผ็ดมาก",
  "no-sugar": "ไม่หวาน",
  "less-sugar": "หวานน้อย",
  "normal-sugar": "หวานปกติ",
  "extra-sugar": "หวานมาก",
}

type CartItem = {
  menuId: number
  qty: number
  option?: string
  extraSize?: boolean
  temperature?: "hot" | "cold"
}

type CustomerData = {
  customerName: string
  orderType: "delivery" | "dine-in"
  tableNumber?: string
  phone?: string
  notes?: string
}

function getDefaultOption(item: MenuItem) {
  if (item.requiresSpiceLevel) return "spicy"
  if (item.requiresSweetnessLevel) return "normal-sugar"
  return undefined
}

function getDefaultExtraSize(item: MenuItem) {
  return item.requiresExtraSize ? false : undefined
}

function getDefaultTemperature(item: MenuItem) {
  return item.requiresTemperature ? "hot" : undefined
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("main-dish")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({})
  const [selectedExtraSizes, setSelectedExtraSizes] = useState<Record<number, boolean>>({})
  const [selectedTemperatures, setSelectedTemperatures] = useState<Record<number, "hot" | "cold">>({})
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    title: string
    message: string
  } | null>(null)

  const filteredItems = menus.filter((item) => item.category === activeCategory)

  const getSelectedOption = (item: MenuItem) => {
    if (!item.requiresSpiceLevel && !item.requiresSweetnessLevel) return undefined
    return selectedOptions[item.id] ?? getDefaultOption(item)
  }

  const getSelectedExtraSize = (item: MenuItem) => {
    if (!item.requiresExtraSize) return undefined
    return selectedExtraSizes[item.id] ?? false
  }

  const getSelectedTemperature = (item: MenuItem) => {
    if (!item.requiresTemperature) return undefined
    return selectedTemperatures[item.id] ?? getDefaultTemperature(item)
  }

  const handleOptionChange = (menuId: number, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [menuId]: option }))
  }

  const handleExtraSizeChange = (menuId: number, extraSize: boolean) => {
    setSelectedExtraSizes((prev) => ({ ...prev, [menuId]: extraSize }))
  }

  const handleTemperatureChange = (menuId: number, temperature: "hot" | "cold") => {
    setSelectedTemperatures((prev) => ({ ...prev, [menuId]: temperature }))
  }

  const addToCart = (menuId: number, option?: string, extraSize?: boolean, temperature?: "hot" | "cold") => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuId === menuId && item.option === option && item.extraSize === extraSize && item.temperature === temperature)
      if (existing) {
        return prev.map((item) =>
          item.menuId === menuId && item.option === option && item.extraSize === extraSize && item.temperature === temperature
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { menuId, qty: 1, option, extraSize, temperature }]
    })
  }

  const updateCart = (menuId: number, qty: number, option?: string, extraSize?: boolean, temperature?: "hot" | "cold") => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => !(item.menuId === menuId && item.option === option && item.extraSize === extraSize && item.temperature === temperature)))
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.menuId === menuId && item.option === option && item.extraSize === extraSize && item.temperature === temperature ? { ...item, qty } : item
        )
      )
    }
  }

  const cartTotal = cart.reduce((sum, item) => {
    const menuItem = menus.find((m) => m.id === item.menuId)
    const extraPrice = item.extraSize ? 10 : 0
    return sum + ((menuItem?.price || 0) + extraPrice) * item.qty
  }, 0)

  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), 4000)
    return () => clearTimeout(timer)
  }, [notification])

  const handleCheckout = async (customerData: CustomerData) => {
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
        setNotification({
          type: "success",
          title: "สั่งซื้อสำเร็จ",
          message: "คำสั่งซื้อของคุณถูกส่งไปยังครัวแล้ว"
        })
        setCart([])
        setShowCheckout(false)
        setShowCart(false)
      } else {
        setNotification({
          type: "error",
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถส่งคำสั่งซื้อได้ กรุณาลองอีกครั้ง"
        })
      }
    } catch (error) {
      console.error("Error placing order:", error)
      setNotification({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: "เกิดปัญหาในการส่งคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white pb-24 sm:pb-8 text-gray-800 antialiased">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b-4 border-green-600 py-6 px-4 sm:px-6 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Restaurant Logo" 
              className="h-16 w-auto sm:h-20"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-green-700">ร้านอาหารบ้านตา</h1>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            รายการอาหาร
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2.5 py-1 rounded-full text-sm font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-24 z-30 bg-white border-b-2 border-green-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8 py-3">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                  activeCategory === cat.key
                    ? "bg-green-300 text-gray-800 shadow-md"
                    : "bg-gray-30 text-gray-700 hover:bg-green-100 border border-green-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              selectedOption={getSelectedOption(item)}
              selectedExtraSize={getSelectedExtraSize(item)}
              selectedTemperature={getSelectedTemperature(item)}
              onOptionChange={handleOptionChange}
              onExtraSizeChange={handleExtraSizeChange}
              onTemperatureChange={handleTemperatureChange}
              onAddToCart={() => addToCart(item.id, getSelectedOption(item), getSelectedExtraSize(item), getSelectedTemperature(item))}
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

      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-3xl border-l-4 bg-white p-6 shadow-2xl ${notification.type === "success" ? "border-green-600" : "border-red-600"}`}>
            <div className="flex items-start gap-4">
              <div className={`text-3xl ${notification.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {notification.type === "success" ? "✅" : "❌"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{notification.title}</h2>
                <p className="mt-2 text-gray-600">{notification.message}</p>
              </div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

function MenuItem({
  item,
  selectedOption,
  selectedExtraSize,
  selectedTemperature,
  onOptionChange,
  onExtraSizeChange,
  onTemperatureChange,
  onAddToCart,
}: {
  item: MenuItem
  selectedOption?: string
  selectedExtraSize?: boolean
  selectedTemperature?: "hot" | "cold"
  onOptionChange: (menuId: number, option: string) => void
  onExtraSizeChange: (menuId: number, extraSize: boolean) => void
  onTemperatureChange: (menuId: number, temperature: "hot" | "cold") => void
  onAddToCart: () => void
}) {
  const optionChoices = item.requiresSpiceLevel
    ? spiceOptions
    : item.requiresSweetnessLevel
    ? sweetnessOptions
    : []
  const currentOption =
    selectedOption ??
    (item.requiresSpiceLevel ? "spicy" : item.requiresSweetnessLevel ? "normal-sugar" : undefined)

  return (
    <div className="bg-white rounded-3xl border border-green-200 overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{item.name}</h3>
            </div>
            <span className="text-amber-600 text-base font-bold">฿{item.price}</span>
          </div>

          {optionChoices.length > 0 && (
            <div className="rounded-3xl bg-green-50 p-3">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>{item.requiresSpiceLevel ? "เลือกระดับความเผ็ด" : "ปรับระดับความหวาน"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {optionChoices.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => onOptionChange(item.id, choice.value)}
                    className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                      currentOption === choice.value ? "bg-green-500 text-white" : "bg-white text-gray-700 border border-green-200"
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.requiresExtraSize && (
            <div className="rounded-3xl bg-green-50 p-3">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>ขนาด</span>
                <span className="text-amber-600">+10฿</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onExtraSizeChange(item.id, false)}
                  className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                    !selectedExtraSize ? "bg-green-500 text-white" : "bg-white text-gray-700 border border-green-200"
                  }`}
                >
                  ปกติ
                </button>
                <button
                  type="button"
                  onClick={() => onExtraSizeChange(item.id, true)}
                  className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                    selectedExtraSize ? "bg-green-500 text-white" : "bg-white text-gray-700 border border-green-200"
                  }`}
                >
                  พิเศษ
                </button>
              </div>
            </div>
          )}

          {item.requiresTemperature && (
            <div className="rounded-3xl bg-blue-50 p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">
                <span>เลือกความเย็น/ร้อน</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {temperatureOptions.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => onTemperatureChange(item.id, choice.value as "hot" | "cold")}
                    className={`rounded-2xl px-3 py-2 text-sm font-medium transition ${
                      selectedTemperature === choice.value ? "bg-blue-500 text-white" : "bg-white text-gray-700 border border-blue-200"
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-green-100 p-4">
        <button
          onClick={onAddToCart}
          className="w-full rounded-2xl bg-red-500 px-3 py-2.5 text-white font-semibold hover:bg-red-600 transition-colors"
        >
          เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  )
}
