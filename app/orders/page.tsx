"use client"

import { useEffect, useState } from "react"
import { getMenuItemName, getMenuItemIcon } from "@/lib/data"
import type { Order, OrderStatus } from "@/lib/data"

const statusColors: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  cooking: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  completed: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-500" },
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  cooking: "Cooking",
  completed: "Completed",
}

const statusFlow: OrderStatus[] = ["pending", "cooking", "completed"]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<"active" | "completed">("active")
  const [isPolling, setIsPolling] = useState(true)

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

  // Initial fetch
  useEffect(() => {
    fetchOrders()
  }, [])

  // Polling without loading state
  useEffect(() => {
    if (!isPolling) return

    const pollInterval = setInterval(() => {
      fetchOrders()
    }, 4000) // Poll every 4 seconds

    return () => clearInterval(pollInterval)
  }, [isPolling])

  async function updateOrderStatus(orderId: number, newStatus: OrderStatus, remake: boolean = false) {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus, remake }),
      })
      const updatedOrder = await res.json()

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      )
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const activeOrders = orders.filter((o) => o.status !== "completed")
  const completedOrders = orders.filter((o) => o.status === "completed")
  const displayOrders = selectedTab === "active" ? activeOrders : completedOrders

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 md:px-8 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">👨‍🍳 Chef Dashboard</h1>
          <p className="text-gray-600">Manage incoming orders and track preparation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex gap-8 py-4">
            <button
              onClick={() => setSelectedTab("active")}
              className={`pb-4 font-semibold transition-colors border-b-2 ${
                selectedTab === "active"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Active Orders
              {activeOrders.length > 0 && (
                <span className="ml-2 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                  {activeOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedTab("completed")}
              className={`pb-4 font-semibold transition-colors border-b-2 ${
                selectedTab === "completed"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed
              {completedOrders.length > 0 && (
                <span className="ml-2 px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-bold">
                  {completedOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading orders...</p>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">
              {selectedTab === "active" ? "No active orders" : "No completed orders"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order
  onUpdateStatus: (orderId: number, status: OrderStatus, remake?: boolean) => void
}) {
  const colors = statusColors[order.status as OrderStatus] || statusColors.completed
  const currentStatusIndex = statusFlow.indexOf(order.status as OrderStatus)
  const nextStatus = statusFlow[currentStatusIndex + 1]

  const getTimeString = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
              {statusLabels[order.status]}
            </div>
            {order.remake && (
              <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                🔄 Remake
              </div>
            )}
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Order #{order.id}</h3>
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            <p>
              Customer: <span className="font-semibold text-gray-900">{order.customerName}</span> •{" "}
              {getTimeString(order.createdAt)}
            </p>
            <p>
              Type: <span className="font-semibold text-gray-900">
                {order.orderType === "delivery" ? "🚚 Delivery" : "🍽️ Dine In"}
              </span>
              {order.orderType === "dine-in" && order.tableNumber && (
                <span> (Table: {order.tableNumber})</span>
              )}
              {order.orderType === "delivery" && order.phone && (
                <span> (Phone: {order.phone})</span>
              )}
            </p>
            {order.notes && (
              <p>
                Notes: <span className="italic text-gray-700">{order.notes}</span>
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
                  <p className="font-medium text-gray-900">{getMenuItemName(item.menuId)}</p>
                </div>
              </div>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold text-sm">
                x {item.qty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        {nextStatus && order.status !== "completed" && (
          <button
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            {nextStatus === "cooking"
              ? "👨‍🍳 Start Cooking"
              : "✅ Complete Order"}
          </button>
        )}

        {order.status !== "completed" && (
          <button
            onClick={() => onUpdateStatus(order.id, "pending", true)}
            className="flex-1 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors"
            title="Mark as remake - moves back to pending"
          >
            🔄 Remake
          </button>
        )}

        {order.status === "completed" && (
          <div className="flex-1 px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-lg text-center">
            ✅ Completed
          </div>
        )}
      </div>
    </div>
  )
}