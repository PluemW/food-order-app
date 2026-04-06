"use client"

import { useEffect, useState } from "react"
import { menus, getMenuItemName, getMenuItemIcon } from "@/lib/data"
import type { Order, OrderStatus } from "@/lib/data"

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

const statusColors: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  cooking: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  "waiting-for-payment": { bg: "bg-indigo-100", text: "text-indigo-800", dot: "bg-indigo-500" },
  completed: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "กำลังรอ",
  cooking: "กำลังทำอาหาร",
  "waiting-for-payment": "รอชำระเงิน",
  completed: "เสร็จสิ้น",
}

const statusFlow: OrderStatus[] = ["pending", "cooking", "waiting-for-payment", "completed"]

function getOrderTotal(order: Order) {
  return order.items.reduce((sum, item) => {
    const menuItem = menus.find((m) => m.id === item.menuId)
    const basePrice = menuItem?.price || 0
    const extraPrice = item.extraSize ? 10 : 0
    return sum + (basePrice + extraPrice) * item.qty
  }, 0)
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isPolling, setIsPolling] = useState(true)
  const [filterStatus, setFilterStatus] = useState<"all" | "preparing" | "payment" | "completed">("all")
  const [savedNet, setSavedNet] = useState(0)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLog() {
    try {
      const res = await fetch("/api/orders/log")
      if (!res.ok) throw new Error("Failed to fetch log")
      const data = await res.json()
      setSavedNet(data.savedNet ?? 0)
    } catch (error) {
      console.error("Error fetching order log:", error)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchOrders()
    fetchLog()
  }, [])

  // Polling without loading state
  useEffect(() => {
    if (!isPolling) return

    const pollInterval = setInterval(() => {
      fetchOrders()
    }, 4000) // Poll every 4 seconds

    return () => clearInterval(pollInterval)
  }, [isPolling])

  async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      const updatedOrder = await res.json()

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      )
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const preparingOrders = orders.filter((o) => o.status === "pending" || o.status === "cooking")
  const paymentOrders = orders.filter((o) => o.status === "waiting-for-payment")
  const completedOrders = orders.filter((o) => o.status === "completed")
  const totalNet = savedNet + completedOrders.reduce((sum, order) => sum + getOrderTotal(order), 0)
  const isResetDisabled = totalNet === 0

  async function handleConfirmReset() {
    try {
      const [logRes, ordersRes] = await Promise.all([
        fetch("/api/orders/log", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "clear" }),
        }),
        fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "clearCompleted" }),
        }),
      ])

      if (!logRes.ok || !ordersRes.ok) {
        throw new Error("Failed to reset total net and history")
      }

      const logData = await logRes.json()
      const ordersData = await ordersRes.json()

      setSavedNet(logData.savedNet ?? 0)
      setOrders(ordersData.remainingOrders ?? [])
      setShowResetConfirm(false)
    } catch (error) {
      console.error("Error resetting order log:", error)
      setShowResetConfirm(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 md:px-8 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-15 w-15 rounded-full object-cover" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">หน้าจอครัว</h1>
          </div>
          <p className="text-gray-600">จัดการคำสั่งซื้อและติดตามการทำงานของอาหาร</p>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="bg-white border-b-2 border-green-200 shadow-sm sticky top-[7rem] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                filterStatus === "all"
                  ? "bg-green-200 text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterStatus("preparing")}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                filterStatus === "preparing"
                  ? "bg-green-200 text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              กำลังทำ
            </button>
            <button
              onClick={() => setFilterStatus("payment")}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                filterStatus === "payment"
                  ? "bg-green-200 text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              รอชำระเงิน
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap rounded-lg font-medium text-sm transition-all ${
                filterStatus === "completed"
                  ? "bg-green-200 text-gray-800 shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">กำลังโหลดรายการออเดอร์...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">ยังไม่มีรายการสั่งซื้อ</p>
          </div>
        ) : (
          <>
            {filterStatus === "all" && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {/* Left column: pending + cooking */}
                      <div>
                        <h2 className="text-xl font-bold text-green-700 mb-3">คำสั่งซื้อที่กำลังทำ</h2>
                        {preparingOrders.length === 0 ? (
                          <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-500">ไม่มีคำสั่งซื้อที่กำลังรอหรือกำลังทำ</div>
                        ) : (
                          <div className="space-y-4">
                            {preparingOrders.map((order) => (
                              <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right column: waiting-for-payment */}
                      <div>
                        <h2 className="text-xl font-bold text-green-700 mb-3">รอชำระเงิน</h2>
                        {paymentOrders.length === 0 ? (
                          <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-500">
                            ไม่มีคำสั่งซื้อรอชำระเงิน
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {paymentOrders.map((order) => (
                              <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-green-200 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-green-700 mb-2">ยอดสุทธิ</h3>
                      <p className="text-4xl font-bold text-gray-900">฿{totalNet}</p>
                      <p className="text-sm text-gray-500 mt-2">รวมยอดคำสั่งซื้อทั้งหมดในประวัติและยอดเก่า</p>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(true)}
                        disabled={isResetDisabled}
                        className={`mt-4 w-full px-4 py-3 rounded-lg font-semibold transition-colors ${isResetDisabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
                      >
                        รีเซ็ตยอดสุทธิ และล้างประวัติ
                      </button>
                      {isResetDisabled && (
                        <p className="mt-2 text-sm text-gray-500">ไม่มียอดสุทธิสำหรับรีเซ็ต</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Completed Orders Section */}
                {completedOrders.length > 0 ? (
                  <div className="mt-8 pt-8 border-t-2 border-gray-200">
                    <h2 className="text-xl font-bold text-green-700 mb-3">ประวัติคำสั่งซื้อที่เสร็จสิ้น</h2>
                    <div className="space-y-4">
                      {completedOrders.map((order) => (
                        <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 pt-8 border-t-2 border-gray-200 p-6 bg-white rounded-3xl border border-gray-200 text-gray-500">
                    ไม่มีคำสั่งซื้อที่เสร็จสิ้นในตอนนี้
                  </div>
                )}
              </>
            )}

            {filterStatus === "preparing" && (
              <div>
                <h2 className="text-xl font-bold text-green-700 mb-3">คำสั่งซื้อที่กำลังทำ</h2>
                {preparingOrders.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-500">ไม่มีคำสั่งซื้อที่กำลังรอหรือกำลังทำ</div>
                ) : (
                  <div className="space-y-4">
                    {preparingOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {filterStatus === "payment" && (
              <div>
                <h2 className="text-xl font-bold text-green-700 mb-3">รอชำระเงิน</h2>
                {paymentOrders.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-500">ไม่มีคำสั่งซื้อรอชำระเงิน</div>
                ) : (
                  <div className="space-y-4">
                    {paymentOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {filterStatus === "completed" && (
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <div>
                  <h2 className="text-xl font-bold text-green-700 mb-3">เสร็จสิ้น</h2>
                  {completedOrders.length === 0 ? (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-500">ไม่มีคำสั่งซื้อที่เสร็จสิ้นในตอนนี้</div>
                  ) : (
                    <div className="space-y-4">
                      {completedOrders.map((order) => (
                        <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-3xl border border-green-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">ยอดสุทธิ</h3>
                    <p className="text-4xl font-bold text-gray-900">฿{totalNet}</p>
                    <p className="text-sm text-gray-500 mt-2">รวมยอดคำสั่งซื้อทั้งหมดในประวัติและยอดเก่า</p>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      disabled={isResetDisabled}
                      className={`mt-4 w-full px-4 py-3 rounded-lg font-semibold transition-colors ${isResetDisabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
                    >
                      รีเซ็ตยอดสุทธิ และล้างประวัติ
                    </button>
                    {isResetDisabled && (
                      <p className="mt-2 text-sm text-gray-500">ไม่มียอดสุทธิสำหรับรีเซ็ต</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border-l-4 border-green-600 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">ยืนยันการรีเซ็ตยอดสุทธิ</h3>
            <p className="text-gray-600 mb-4">
              คุณแน่ใจหรือไม่ว่าจะรีเซ็ตยอดสุทธิทั้งหมดและล้างประวัติคำสั่งซื้อที่เสร็จสิ้น?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order
  onUpdateStatus: (orderId: number, status: OrderStatus) => void
}) {
  const colors = statusColors[order.status as OrderStatus] || statusColors.completed
  const currentStatusIndex = statusFlow.indexOf(order.status as OrderStatus)
  const nextStatus = statusFlow[currentStatusIndex + 1]

  const orderTotal = order.items.reduce((sum, item) => {
    const menuItem = menus.find((m) => m.id === item.menuId)
    const basePrice = menuItem?.price || 0
    const extraPrice = item.extraSize ? 10 : 0
    return sum + (basePrice + extraPrice) * item.qty
  }, 0)

  const getTimeString = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <div className="bg-white rounded-xl border border-green-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-green-100">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
              {statusLabels[order.status]}
            </div>
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Order #{order.id}</h3>
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            <p>
              ลูกค้า: <span className="font-semibold text-gray-900">{order.customerName}</span> • {getTimeString(order.createdAt)}
            </p>
            <p>
              ประเภท: <span className="font-semibold text-gray-900">
                {order.orderType === "delivery" ? "🚚 จัดส่ง" : "🍽️ นั่งทาน"}
              </span>
              {order.orderType === "dine-in" && order.tableNumber && (
                <span> (โต๊ะ: {order.tableNumber})</span>
              )}
              {order.orderType === "delivery" && order.phone && (
                <span> (โทร: {order.phone})</span>
              )}
            </p>
            {order.notes && (
              <p>
                บันทึก: <span className="italic text-gray-700">{order.notes}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-6 py-4 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMenuItemIcon(item.menuId)}</span>
                <div>
                  <p className="font-medium text-gray-900">
                    {getMenuItemName(item.menuId)}
                    {item.extraSize && (
                      <span className="text-orange-600 text-sm"> (ใหญ่พิเศษ)</span>
                    )}
                    {item.option && (
                      <span className="text-orange-600 text-sm"> ({optionLabels[item.option] ?? item.option})</span>
                    )}
                  </p>
                </div>
              </div>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold text-sm">
                x {item.qty}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-800">รวมทั้งหมด: <span className="text-orange-600">₿{orderTotal}</span></p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        {order.status !== "completed" && (
          <button
            onClick={() => {
              const next = order.status === "pending" ? "cooking" : order.status === "cooking" ? "waiting-for-payment" : "completed"
              onUpdateStatus(order.id, next as OrderStatus)
            }}
            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            {order.status === "pending" && "👨‍🍳 เริ่มทำอาหาร"}
            {order.status === "cooking" && "🍽️ ทำอาหารเสร็จแล้ว (รอชำระเงิน)"}
            {order.status === "waiting-for-payment" && "💳 ยืนยันชำระเงิน"}
          </button>
        )}

        {order.status === "completed" && (
          <div className="flex-1 px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-lg text-center">
            ✅ เสร็จสิ้นแล้ว
          </div>
        )}
      </div>
    </div>
  )
}