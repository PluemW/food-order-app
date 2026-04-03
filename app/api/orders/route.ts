import type { Order, OrderStatus } from "@/lib/data"

// Start with empty orders - only real customer orders
let orders: Order[] = []

export async function POST(req: Request) {
  const body = await req.json()

  const newOrder: Order = {
    id: Date.now(),
    customerName: body.customerName || "Guest",
    items: body.items,
    status: "pending",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    notes: body.notes,
    orderType: body.orderType || "dine-in",
    tableNumber: body.tableNumber,
    phone: body.phone,
  }

  orders.push(newOrder)
  console.log("New Order:", newOrder)

  return Response.json(newOrder)
}

export async function GET() {
  return Response.json(orders)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { orderId, status, remake } = body

  const orderIndex = orders.findIndex((o) => o.id === orderId)
  if (orderIndex === -1) {
    return Response.json({ error: "Order not found" }, { status: 404 })
  }

  orders[orderIndex].status = status
  orders[orderIndex].updatedAt = Date.now()
  if (remake) {
    orders[orderIndex].remake = true
  }

  console.log("Order Updated:", orders[orderIndex])
  return Response.json(orders[orderIndex])
}